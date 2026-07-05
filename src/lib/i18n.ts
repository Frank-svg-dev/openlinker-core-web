export const LOCALE_COOKIE = "ol_locale";
export const LOCALES = ["zh", "en"] as const;

export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "en";

export type LocalizedText = {
  zh: string;
  en: string;
};

function localeFromLanguageTag(value: string | null | undefined): Locale | null {
  const tag = value?.trim().toLowerCase().replace("_", "-");
  if (!tag) return null;
  if (tag === "zh" || tag.startsWith("zh-")) return "zh";
  if (tag === "en" || tag.startsWith("en-")) return "en";
  return null;
}

export function normalizeLocale(value: string | null | undefined, fallback: Locale = DEFAULT_LOCALE): Locale {
  return localeFromLanguageTag(value) ?? fallback;
}

export function localeFromAcceptLanguage(value: string | null | undefined, fallback: Locale = DEFAULT_LOCALE): Locale {
  if (!value) return fallback;

  const candidates = value
    .split(",")
    .map((entry, index) => {
      const [rawTag, ...params] = entry.trim().split(";");
      const qParam = params.find((param) => param.trim().toLowerCase().startsWith("q="));
      const q = qParam ? Number.parseFloat(qParam.split("=")[1] ?? "") : 1;
      return { tag: rawTag, q: Number.isFinite(q) ? q : 0, index };
    })
    .filter((candidate) => candidate.tag && candidate.q > 0)
    .sort((a, b) => b.q - a.q || a.index - b.index);

  for (const candidate of candidates) {
    const locale = localeFromLanguageTag(candidate.tag);
    if (locale) return locale;
  }

  return fallback;
}

export function localeFromNavigator(languages: readonly string[] | string | null | undefined, fallback: Locale = DEFAULT_LOCALE): Locale {
  const values = Array.isArray(languages) ? languages : languages ? [languages] : [];
  for (const value of values) {
    const locale = localeFromLanguageTag(value);
    if (locale) return locale;
  }
  return fallback;
}

export function text(locale: Locale, value: LocalizedText): string {
  return value[locale];
}
