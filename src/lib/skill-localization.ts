export type SkillLocale = "zh" | "en";

export type SkillTranslation = {
  name?: string | null;
  description?: string | null;
};

export type LocalizableSkill = {
  id: string;
  name?: string | null;
  description?: string | null;
  translations?: {
    en?: SkillTranslation | null;
  } | null;
};

export type SkillTranslations = NonNullable<LocalizableSkill["translations"]>;
export type SkillTranslationIndex = ReadonlyMap<string, SkillTranslations>;

const UPPERCASE_WORDS = new Set([
  "a2a",
  "ai",
  "api",
  "asr",
  "ci",
  "cd",
  "http",
  "mcp",
  "pdf",
  "qa",
  "rag",
  "seo",
  "sft",
  "sms",
  "sql",
  "tts",
  "url",
]);

function humanizeWord(value: string): string {
  const lower = value.toLowerCase();
  if (UPPERCASE_WORDS.has(lower)) return lower.toUpperCase();
  return lower ? `${lower[0].toUpperCase()}${lower.slice(1)}` : "";
}

/** Turn a stable machine ID into locale-neutral copy without using DB prose. */
export function humanizeSkillID(skillID: string): string {
  const groups = skillID
    .trim()
    .split("/")
    .map((group) => group
      .split(/[-_]+/)
      .filter(Boolean)
      .map(humanizeWord)
      .join(" "))
    .filter(Boolean);
  return groups.length > 0 ? groups.join(" · ") : "Unknown Skill";
}

/**
 * Select Skill copy without leaking another locale. Canonical English copy is
 * supplied by Core. Unknown/custom Skills use a humanized ID and deliberately
 * omit their description on English surfaces.
 */
export function localizedSkill(
  skill: LocalizableSkill,
  locale: SkillLocale,
): { name: string; description: string } {
  if (locale === "en") {
    const translation = skill.translations?.en;
    return {
      name: translation?.name?.trim() || humanizeSkillID(skill.id),
      description: translation?.description?.trim() || "",
    };
  }
  return {
    name: skill.name?.trim() || humanizeSkillID(skill.id),
    description: skill.description?.trim() || "",
  };
}

/** Build one reusable ID lookup for Agent Skill refs returned without copy. */
export function indexSkillTranslations(
  skills: readonly LocalizableSkill[],
): Map<string, SkillTranslations> {
  const index = new Map<string, SkillTranslations>();
  for (const skill of skills) {
    if (skill.translations) index.set(skill.id, skill.translations);
  }
  return index;
}

/** Attach catalog translations without changing the original API object. */
export function withSkillTranslations<T extends LocalizableSkill>(
  skill: T,
  index: SkillTranslationIndex,
): T {
  const catalog = index.get(skill.id);
  if (!catalog) return skill;
  const current = skill.translations;
  const translations: SkillTranslations = {
    ...catalog,
    ...current,
    en: {
      ...catalog.en,
      ...current?.en,
    },
  };
  return { ...skill, translations } as T;
}
