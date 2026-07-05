"use client";

/**
 * Client Component 专用：把当前会话里的 JWT 自动注入 apiFetch。
 *
 * 用法：
 *   "use client";
 *   const { fetch } = useApi();
 *   const { data } = useQuery({
 *     queryKey: ["agents"],
 *     queryFn: () => fetch<{ items: Agent[] }>("/api/v1/agents"),
 *   });
 *
 * Server Component 不要用此 hook，请用 `apiFetchAuthed`。
 */

import { signOut, useSession } from "next-auth/react";
import { useCallback } from "react";
import { apiFetch, UnauthorizedError, type FetchOptions } from "@/lib/api";

type UseApiFetchOptions = Omit<FetchOptions, "token"> & {
  signOutOnUnauthorized?: boolean;
};

export function useApi() {
  const { data: session, status } = useSession();
  const token = session?.jwt;

  const fetch = useCallback(
    <T = unknown>(
      path: string,
      opts: UseApiFetchOptions = {},
    ): Promise<T> => {
      const { signOutOnUnauthorized = true, ...fetchOpts } = opts;
      return apiFetch<T>(path, { ...fetchOpts, token }).catch((error) => {
        if (
          signOutOnUnauthorized &&
          error instanceof UnauthorizedError &&
          typeof window !== "undefined"
        ) {
          const current = `${window.location.pathname}${window.location.search}`;
          void signOut({
            callbackUrl: `/login?callbackUrl=${encodeURIComponent(current || "/")}`,
          });
        }
        throw error;
      });
    },
    [token],
  );

  return {
    fetch,
    token,
    isAuthenticated: !!token,
    isLoading: status === "loading",
    status,
  };
}
