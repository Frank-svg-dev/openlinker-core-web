"use client";

import { useRouter } from "next/navigation";
import { useOptimistic, useTransition } from "react";

import { LOCALE_COOKIE, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const OPTIONS: Array<{ locale: Locale; label: string }> = [
  { locale: "zh", label: "中" },
  { locale: "en", label: "EN" },
];

function writeLocaleCookie(nextLocale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${nextLocale}; Path=/; Max-Age=31536000; SameSite=Lax`;
}

export function LanguageToggle({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [visibleLocale, setVisibleLocale] = useOptimistic(locale);

  const switchLocale = (nextLocale: Locale) => {
    if (nextLocale === visibleLocale) return;
    startTransition(() => {
      setVisibleLocale(nextLocale);
      writeLocaleCookie(nextLocale);
      router.refresh();
    });
  };

  return (
    <div
      className="ol-language-toggle inline-flex h-9 items-center rounded-xl border border-[color:var(--ol-line)] bg-white p-1"
      data-pending={pending ? "true" : undefined}
      aria-label={visibleLocale === "zh" ? "语言切换" : "Language switcher"}
      aria-busy={pending || undefined}
    >
      {OPTIONS.map((option) => {
        const active = option.locale === visibleLocale;
        return (
          <button
            key={option.locale}
            type="button"
            onClick={() => switchLocale(option.locale)}
            className={cn(
              "inline-flex h-7 min-w-8 items-center justify-center rounded-lg px-2 text-[12px] font-black transition-colors",
              pending && active ? "cursor-progress" : "cursor-pointer",
              active
                ? "bg-[color:var(--ol-primary)] text-white"
                : "text-[color:var(--ol-muted)] hover:bg-[color:var(--ol-soft)] hover:text-[color:var(--ol-ink)]",
            )}
            aria-pressed={active}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
