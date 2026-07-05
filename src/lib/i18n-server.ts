import { cookies, headers } from "next/headers";

import { LOCALE_COOKIE, localeFromAcceptLanguage, normalizeLocale, type Locale } from "@/lib/i18n";

export async function getLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;
  if (cookieLocale) return normalizeLocale(cookieLocale);

  const headerStore = await headers();
  return localeFromAcceptLanguage(headerStore.get("accept-language"));
}
