/**
 * 由 agent.slug 派生 app-icon 的「字母 + 颜色」。
 *
 * - 取 slug 的前两个字符大写作为字母（无字母时退回 'OA'）
 * - 颜色用首字符 charCode 哈希到固定 palette，保证刷新后稳定
 *
 * 放在旧 components/market 目录下作为 Registry 视图层 helper，不进 lib/*。
 */

const COLORS = [
  "#17857b", // brand
  "#0f6f67", // deep brand
  "#2f8278", // muted teal
  "#3a7a5d", // moss
  "#1d6f79", // blue teal
] as const;

export function avatarFromSlug(slug: string): {
  initials: string;
  color: string;
} {
  const cleaned = (slug ?? "").replace(/[^a-z0-9]/gi, "");
  const seed = cleaned.length > 0 ? cleaned : "oa";
  const initials = seed.slice(0, 2).toUpperCase();
  const idx = seed.charCodeAt(0) % COLORS.length;
  return { initials, color: COLORS[idx] };
}
