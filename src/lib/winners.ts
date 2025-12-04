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
const LAST_CHECK_KEY = "lastWinnerCheck";

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

/** 
 * Check if we need to close yesterday and save a winner.
 * This runs every time the app opens/refreshes, but only saves once per day.
 */
export async function closeWeekIfNeeded() {
  const now = new Date();
  const today = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
  
  // Get the last day we checked
  const lastCheck = await AsyncStorage.getItem(LAST_CHECK_KEY);
  
  // If we already checked today, don't do anything
  if (lastCheck === today) {
    return;
  }
  
  // Calculate yesterday's date
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().slice(0, 10);
  
  // Check if we already have a winner for yesterday
  const winners = await getWinners();
  const hasYesterdayWinner = winners.some(w => {
    const winnerDate = new Date(w.weekStart).toISOString().slice(0, 10);
    return winnerDate === yesterdayStr;
  });
  
  // If we already saved yesterday's winner, just update last check and return
  if (hasYesterdayWinner) {
    await AsyncStorage.setItem(LAST_CHECK_KEY, today);
    return;
  }
  
  // We need to save yesterday's winner!
  console.log("Closing yesterday and saving winner...");
  
  // Fetch all posts from backend
  const backendPosts = await fetchAllPostsFromBackend();
  if (backendPosts.length === 0) {
    await AsyncStorage.setItem(LAST_CHECK_KEY, today);
    return;
  }

  // Find the post with most likes from ALL posts
  const champ = [...backendPosts].sort((a, b) => b.likes - a.likes)[0];

  const entry: WeeklyWinner = {
    weekStart: yesterday.toISOString(), // Use yesterday's date
    weekEnd: now.toISOString(),
    postId: champ.id.toString(),
    team: champ.team === "cat" ? "cats" : "dogs",
    title: champ.description || "Untitled",
    author: champ.username || "Unknown",
    likesAtClose: champ.likes,
    imageURL: champ.imageUrl || null,
  };
  
  await saveWinners([entry, ...winners]);
  await AsyncStorage.setItem(LAST_CHECK_KEY, today);
  console.log("Winner saved for", yesterdayStr);
}

export async function clearWinners() {
  await AsyncStorage.removeItem(KEY);
  await AsyncStorage.removeItem(LAST_CHECK_KEY);
}