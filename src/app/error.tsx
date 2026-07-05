"use client";

import Link from "next/link";
import { useEffect } from "react";

import { Brand } from "@/components/layout/brand";
import { NavTabs } from "@/components/layout/nav-tabs";
import { useClientLocale } from "@/hooks/use-client-locale";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useClientLocale();
  const copy =
    locale === "zh"
      ? {
          signIn: "登录",
          home: "首页",
          current: "页面错误",
          kicker: "页面错误",
          title: "页面暂时无法加载",
          lead: "当前数据源或会话状态不可用。页面外壳保持一致，你可以重试或回到 Registry。",
          retry: "重试",
          registry: "打开 Registry",
        }
      : {
          signIn: "Sign in",
          home: "Home",
          current: "Page error",
          kicker: "Page error",
          title: "This page could not load",
          lead: "The current data source or session state is unavailable. You can retry or return to Registry.",
          retry: "Retry",
          registry: "Open Registry",
        };

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <header className="ol-topbar sticky top-0 z-30 border-b border-[color:var(--ol-line)]/60 bg-white/72 backdrop-blur">
        <div className="ol-topbar-inner mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:gap-6 sm:px-6">
          <div className="ol-topbar-brand-slot">
            <Brand locale={locale} />
          </div>
          <div className="ol-topbar-nav-slot hidden min-w-0 md:block">
            <NavTabs locale={locale} />
          </div>
          <div className="ol-topbar-actions flex shrink-0 items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="inline-flex h-9 items-center justify-center whitespace-nowrap rounded-xl bg-[color:var(--ol-primary)] px-3 text-[12px] font-bold text-white shadow-sm hover:bg-[color:var(--ol-primary-dark)] sm:px-4 sm:text-[13px]"
            >
              {copy.signIn}
            </Link>
          </div>
        </div>
        <div className="overflow-x-auto border-t border-[color:var(--ol-line)]/60 px-4 pb-3 pt-2 md:hidden">
          <NavTabs locale={locale} className="flex w-max min-w-full justify-start" />
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 pb-16">
        <div className="ol-breadcrumb">
          <Link href="/">{copy.home}</Link>
          <span className="sep">/</span>
          <span className="current">{copy.current}</span>
        </div>

        <div className="ol-page-head">
          <div className="ol-page-title">
            <div className="ol-kicker">{copy.kicker}</div>
            <h1>{copy.title}</h1>
            <p>{copy.lead}</p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <button type="button" onClick={reset} className="ol-mini-btn ol-mini-btn-primary">
            {copy.retry}
          </button>
          <Link href="/registry" className="ol-mini-btn">
            {copy.registry}
          </Link>
        </div>
      </main>
    </>
  );
}
