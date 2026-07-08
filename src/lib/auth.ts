/**
 * NextAuth v5 配置。
 *
 * 设计要点：
 *   - Credentials provider：调后端 POST /api/v1/auth/login
 *   - jwt / session callbacks 把后端 JWT 透传给客户端，方便 useSession 读取
 *   - session strategy: jwt（NextAuth 自身签名 cookie，存后端 JWT 字符串）
 *
 * Server Component 通过 `auth()` 拿 session；
 * Client Component 通过 `useSession()` 拿 session。
 */

import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getApiBaseUrl } from "@/lib/api-root";

const API_URL = getApiBaseUrl();
const BACKEND_JWT_REFRESH_LEAD_MS = 15 * 60 * 1000;
const AUTH_SECRET =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  (process.env.NODE_ENV === "production" ? undefined : "openlinker-dev-auth-secret");

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: AUTH_SECRET,
  trustHost: process.env.AUTH_TRUST_HOST === "true",
  providers: [
    Credentials({
      // 邮箱 + 密码登录
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        const email = credentials?.email as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!email || !password) return null;

        const res = await fetch(`${API_URL}/api/v1/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        });

        if (!res.ok) return null;

        const data = (await res.json()) as {
          user_id: string;
          email: string;
          display_name: string;
          jwt: string;
        };

        return {
          id: data.user_id,
          email: data.email,
          name: data.display_name,
          jwt: data.jwt,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    // 把后端 JWT 透传到 NextAuth token，并在临近过期时刷新。
    async jwt({ token, user }) {
      if (user) {
        const backendJWT = (user as { jwt?: string }).jwt;
        token.jwt = backendJWT;
        token.userId = user.id;
        token.jwtExpiresAt = backendJWTExpiresAtMs(backendJWT);
        delete token.authError;
        return token;
      }

      if (typeof token.jwt !== "string" || token.jwt === "") {
        return token;
      }

      const expiresAt =
        typeof token.jwtExpiresAt === "number"
          ? token.jwtExpiresAt
          : backendJWTExpiresAtMs(token.jwt);
      if (expiresAt) token.jwtExpiresAt = expiresAt;

      if (expiresAt && Date.now() >= expiresAt) {
        return null;
      }

      if (!expiresAt || Date.now() < expiresAt - BACKEND_JWT_REFRESH_LEAD_MS) {
        return token;
      }

      try {
        const refreshed = await refreshBackendJWT(token.jwt);
        token.jwt = refreshed.jwt;
        token.userId = refreshed.user_id;
        token.jwtExpiresAt = backendJWTExpiresAtMs(refreshed.jwt);
        delete token.authError;
      } catch {
        return null;
      }
      return token;
    },
    // 暴露给客户端 useSession()
    async session({ session, token }) {
      // 注：next-auth 的 JWT 接口是 `Record<string, unknown>`，
      // 即便我们做了 module augmentation，索引签名仍会让自定义字段
      // 推断成 unknown，因此这里需要一次显式断言。
      if (typeof token.jwt === "string") session.jwt = token.jwt;
      if (typeof token.authError === "string") session.authError = token.authError;
      if (typeof token.jwtExpiresAt === "number") session.jwtExpiresAt = token.jwtExpiresAt;
      if (typeof token.userId === "string" && session.user) {
        session.user.id = token.userId;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 24h
  },
});

type BackendAuthResponse = {
  user_id: string;
  email: string;
  display_name: string;
  jwt: string;
};

async function refreshBackendJWT(jwt: string): Promise<BackendAuthResponse> {
  const res = await fetch(`${API_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { Authorization: `Bearer ${jwt}` },
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`refresh failed: HTTP ${res.status}`);
  }
  return (await res.json()) as BackendAuthResponse;
}

function backendJWTExpiresAtMs(jwt: string | undefined): number | undefined {
  if (!jwt) return undefined;
  const [, payload] = jwt.split(".");
  if (!payload) return undefined;
  try {
    const decoded = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as {
      exp?: unknown;
    };
    return typeof decoded.exp === "number" ? decoded.exp * 1000 : undefined;
  } catch {
    return undefined;
  }
}
