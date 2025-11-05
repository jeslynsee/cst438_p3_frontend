// Local "database" for posts stored in AsyncStorage.
// Fields match your backend plan, including imageURL and team.
// addPost() can receive an imageURL OR auto-fetch one based on team.

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getRandomImage } from "./imageAPI";
import type { Team } from "./team";

export type Post = {
  id: string;
  team: Team;
  author: string;
  title: string;
  body: string;
  likes: number;
  createdAt: string; 
  imageURL?: string | null;
};

const KEY = "posts_v2";

const SEED: Post[] = [
  {
    id: "p1", team: "cats", author: "mira",
    title: "Whiskers vs laser", body: "Laser pointer supremacy.",
    likes: 42, createdAt: new Date().toISOString(), imageURL: null
  },
  {
    id: "p2", team: "dogs", author: "chase",
    title: "Fetch league finals", body: "Golden retriever clutch play.",
    likes: 51, createdAt: new Date(Date.now() - 36e5).toISOString(), imageURL: null
  }
];

async function save(posts: Post[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(posts));
}

export async function loadPosts(): Promise<Post[]> {
  const raw = await AsyncStorage.getItem(KEY);
  if (!raw) { await save(SEED); return SEED; }
  try { return JSON.parse(raw) as Post[]; } catch { return SEED; }
}

export async function addPost(p: {
  title: string; body: string; author: string; team: Team; imageURL?: string | null;
}) {
  const posts = await loadPosts();

  // If image not provided, fetch a random one for team
  const ensuredImage = typeof p.imageURL === "string" ? p.imageURL : await getRandomImage(p.team);

  const newPost: Post = {
    id: `p_${Date.now()}`,
    title: p.title,
    body: p.body,
    author: p.author,
    team: p.team,
    likes: 0,
    createdAt: new Date().toISOString(),
    imageURL: ensuredImage ?? null
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
