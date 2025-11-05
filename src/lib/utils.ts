// src/lib/utils.ts

export type Team = "DOGS" | "CATS";
export type PostLite = { id: string; team: Team; likes: number; createdAt: string };

/** Return posts for a given team (or all if team is null/undefined). */
export function filterByTeam<T extends { team: Team }>(posts: T[], team?: Team | null): T[] {
  if (!team) return posts;
  return posts.filter(p => p.team === team);
}

/** Sort posts by likes (desc). If likes tie, newer first by createdAt ISO string. */
export function sortByLikesThenDate<T extends PostLite>(posts: T[]): T[] {
  return [...posts].sort((a, b) => {
    if (b.likes !== a.likes) return b.likes - a.likes;
    // newer date first
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
}

/** Small helper for UI labels like "11/4/2025". */
export function formatMDY(iso: string): string {
  const d = new Date(iso);
  const m = d.getUTCMonth() + 1;   // use UTC, not local
  const day = d.getUTCDate();
  const y = d.getUTCFullYear();
  return `${m}/${day}/${y}`;
}

