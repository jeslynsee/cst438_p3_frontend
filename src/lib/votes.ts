import AsyncStorage from "@react-native-async-storage/async-storage";

const VOTE_KEY = "dailyVote"; // { date: "YYYY-MM-DD", postId: "..." }

type VoteStatus = {
  hasVotedToday: boolean;
  postId: string | null;
};

// Build a unique key for each user
function voteKey(userId: string) {
  return `dailyVote:${userId}`;
}

export async function getVoteStatus(userId: string): Promise<VoteStatus> {
  try {
    const raw = await AsyncStorage.getItem(voteKey(userId));
    if (!raw) {
      return { hasVotedToday: false, postId: null };
    }

    const saved = JSON.parse(raw) as { date: string; postId: string };
    const today = new Date().toISOString().slice(0, 10);

    if (saved.date === today) {
      return { hasVotedToday: true, postId: saved.postId };
    }

    // Old vote from a previous day → treat as no vote today
    return { hasVotedToday: false, postId: null };
  } catch (err) {
    console.log("Error reading vote status", err);
    return { hasVotedToday: false, postId: null };
  }
}

export async function recordVote(userId: string, postId: string): Promise<void> {
  try {
    const today = new Date().toISOString().slice(0, 10);
    const payload = JSON.stringify({ date: today, postId });
    await AsyncStorage.setItem(voteKey(userId), payload);
  } catch (err) {
    console.log("Error saving vote", err);
  }
}

export async function clearVoteHistoryForAdmin() {
  await AsyncStorage.removeItem(VOTE_KEY);
}
