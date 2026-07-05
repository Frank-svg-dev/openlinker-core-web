"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useRef } from "react";

export function SessionExpiryGuard() {
  const { data: session, status } = useSession();
  const signingOut = useRef(false);

  useEffect(() => {
    if (status !== "authenticated" || signingOut.current) return;
    if (!session?.jwt || session.authError || jwtExpired(session.jwt)) {
      signingOut.current = true;
      void signOut({ callbackUrl: loginCallbackURL() });
    }
  }, [session?.authError, session?.jwt, status]);

  return null;
}

function loginCallbackURL(): string {
  if (typeof window === "undefined") return "/login";
  const { pathname, search } = window.location;
  if (pathname === "/login" || pathname === "/register") {
    const callbackUrl = new URLSearchParams(search).get("callbackUrl");
    return callbackUrl ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}` : "/login";
  }
  const current = `${pathname}${search}`;
  return `/login?callbackUrl=${encodeURIComponent(current || "/")}`;
}

function jwtExpired(jwt: string): boolean {
  const [, payload] = jwt.split(".");
  if (!payload) return true;
  try {
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(normalized.length + ((4 - (normalized.length % 4)) % 4), "=");
    const decoded = JSON.parse(window.atob(padded)) as { exp?: unknown };
    return typeof decoded.exp === "number" ? Date.now() >= decoded.exp * 1000 : true;
  } catch {
    return true;
  }
}
