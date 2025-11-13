import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Post } from "./postsStore";

export type WeeklyWinner = {
  weekStart: string;
  weekEnd: string;
  postId: string;
  team: "cats" | "dogs";
  title: string;
  author: string;
  likesAtClose: number;
  imageURL: string | null;
};

const KEY = "weeklyWinners";

function startOfWeek(d = new Date()) {
  const x = new Date(d);
  const day = x.getDay(); // 0 = Sun
  x.setHours(0,0,0,0);
  x.setDate(x.getDate() - day);
  return x;
}
function endOfWeek(d = new Date()) {
  const s = startOfWeek(d);
  const e = new Date(s);
  e.setDate(e.getDate() + 7);
  return e;
}

export function currentWeekWindow() {
  return { start: startOfWeek(), end: endOfWeek() };
}

export async function getWinners(): Promise<WeeklyWinner[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? (JSON.parse(raw) as WeeklyWinner[]) : [];
}

async function saveWinners(list: WeeklyWinner[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

/** Close current week and append a winner once-per-week if not already saved. */
export async function closeWeekIfNeeded(posts: Post[]) {
  const winners = await getWinners();
  const { start, end } = currentWeekWindow();

  const exists = winners.some(w => new Date(w.weekStart).getTime() === start.getTime());
  if (exists) return;

  const inWindow = posts.filter(p => {
    const t = new Date(p.createdAt).getTime();
    return t >= start.getTime() && t < end.getTime();
  });
  if (inWindow.length === 0) return;

  const champ = [...inWindow].sort((a,b) => b.likes - a.likes)[0];

  const entry: WeeklyWinner = {
    weekStart: start.toISOString(),
    weekEnd: end.toISOString(),
    postId: champ.id,
    team: champ.team,
    title: champ.title,
    author: champ.author,
    likesAtClose: champ.likes,
    imageURL: (champ as any).imageURL ?? null,
  };
  await saveWinners([entry, ...winners]);
}

export async function clearWinners() {
  await AsyncStorage.removeItem(KEY);
}
