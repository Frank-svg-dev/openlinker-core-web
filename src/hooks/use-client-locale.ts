"use client";

import { useState } from "react";

import { DEFAULT_LOCALE, LOCALE_COOKIE, localeFromNavigator, normalizeLocale, type Locale } from "@/lib/i18n";

export function useClientLocale(defaultLocale: Locale = DEFAULT_LOCALE): Locale {
  const [locale] = useState<Locale>(() => {
    if (typeof document === "undefined") return defaultLocale;
    const raw = document.cookie
      .split("; ")
      .find((part) => part.startsWith(`${LOCALE_COOKIE}=`))
      ?.split("=")[1];
    if (raw) return normalizeLocale(decodeURIComponent(raw), defaultLocale);
    const browserLanguages =
      typeof navigator === "undefined" ? null : navigator.languages.length > 0 ? navigator.languages : navigator.language;
    return localeFromNavigator(browserLanguages, defaultLocale);
  });

  return locale;
}
