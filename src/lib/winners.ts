import AsyncStorage from "@react-native-async-storage/async-storage";

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

// NEW: Fetch posts from backend and determine winner
async function fetchAllPostsFromBackend() {
  try {
    const [catResponse, dogResponse] = await Promise.all([
      fetch("https://catsvsdogs-e830690a69ba.herokuapp.com/posts/team/cat"),
      fetch("https://catsvsdogs-e830690a69ba.herokuapp.com/posts/team/dog")
    ]);
    
    const catData = await catResponse.json();
    const dogData = await dogResponse.json();
    
    return [...catData, ...dogData];
  } catch (error) {
    console.error("Error fetching posts from backend:", error);
    return [];
  }
}

/** Close current week and append a winner if not already saved. */
export async function closeWeekIfNeeded() {
  const winners = await getWinners();
  const { start } = currentWeekWindow();
  const today = new Date().toISOString().slice(0, 10);

  // Check if we already have a winner for today
  const existsToday = winners.some(w => {
    const winnerDate = new Date(w.weekStart).toISOString().slice(0, 10);
    return winnerDate === today;
  });
  
  if (existsToday) return;

  // Fetch all posts from backend
  const backendPosts = await fetchAllPostsFromBackend();
  if (backendPosts.length === 0) return;

  // Find the post with most likes from ALL posts
  const champ = [...backendPosts].sort((a, b) => b.likes - a.likes)[0];

  const entry: WeeklyWinner = {
    weekStart: new Date().toISOString(),
    weekEnd: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    postId: champ.id.toString(),
    team: champ.team === "cat" ? "cats" : "dogs",
    title: champ.description || "Untitled",
    author: champ.username || "Unknown",
    likesAtClose: champ.likes,
    imageURL: champ.imageUrl || null,
  };
  
  await saveWinners([entry, ...winners]);
}

export async function clearWinners() {
  await AsyncStorage.removeItem(KEY);
}