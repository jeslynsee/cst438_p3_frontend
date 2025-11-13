import AsyncStorage from "@react-native-async-storage/async-storage";

const VOTE_KEY = "dailyVote"; // { date: "YYYY-MM-DD", postId: "..." }

function todayKey() {
  const d = new Date();
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export async function getVoteStatus() {
  const raw = await AsyncStorage.getItem(VOTE_KEY);
  const data = raw ? JSON.parse(raw) as { date: string; postId: string } : null;
  const today = todayKey();
  return {
    hasVotedToday: !!data && data.date === today,
    postId: data?.postId ?? null,
    today,
  };
}

export async function recordVote(postId: string) {
  await AsyncStorage.setItem(VOTE_KEY, JSON.stringify({ date: todayKey(), postId }));
}

export async function clearVoteHistoryForAdmin() {
  await AsyncStorage.removeItem(VOTE_KEY);
}
