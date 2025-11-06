// src/lib/strings.ts

/** "1 like" vs "2 likes" (never negative). */
export function likesLabel(n: number): string {
  const count = Math.max(0, Math.floor(n));
  return `${count} ${count === 1 ? "like" : "likes"}`;
}

/** Truncate to `max` chars; append "…" if truncated. */
export function truncate(text: string, max: number): string {
  if (max <= 0) return "";
  if (text.length <= max) return text;
  return text.slice(0, Math.max(0, max - 1)) + "…";
}
