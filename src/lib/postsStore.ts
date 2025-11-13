import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Team } from "./team";

export type Post = {
  id: string;
  team: Team;
  author: string;
  title: string;
  body: string;
  likes: number;
  createdAt: string;
  imageURL: string | null;
};

const KEY = "posts";

const SEED: Post[] = [
  { id: "p1", team: "cats", author: "mira",  title: "Whiskers vs laser",
    body: "Laser pointer supremacy.", likes: 42,
    createdAt: new Date().toISOString(), imageURL: null },
  { id: "p2", team: "dogs", author: "chase", title: "Fetch league finals",
    body: "Golden retriever clutch play.", likes: 51,
    createdAt: new Date(Date.now() - 36e5).toISOString(), imageURL: null },
];

async function save(posts: Post[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(posts));
}
export async function loadPosts(): Promise<Post[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) { await save(SEED); return SEED; }
  return JSON.parse(raw) as Post[];
}

export async function addPost(p: Omit<Post, "id" | "likes" | "createdAt">) {
  const posts = await loadPosts();
  const newPost: Post = {
    id: `p_${Date.now()}_${Math.random().toString(36).slice(2,8)}`,
    likes: 0,
    createdAt: new Date().toISOString(),
    ...p,
  };
  const next = [newPost, ...posts];
  await save(next);
  return newPost;
}

export async function likePost(id: string) {
  const posts = await loadPosts();
  const next = posts.map(p => p.id === id ? { ...p, likes: p.likes + 1 } : p);
  await save(next);
}

export async function clearAllPosts() {
  await AsyncStorage.removeItem(KEY);
}

/** Helpers used by Top Posts UI */
export function postsWithin(posts: Post[], fromMs: number, toMs: number) {
  return posts.filter(p => {
    const t = new Date(p.createdAt).getTime();
    return t >= fromMs && t < toMs;
  });
}
export function topByTeam(posts: Post[], team: Team) {
  return [...posts].filter(p => p.team === team).sort((a,b)=>b.likes-a.likes)[0] ?? null;
}
