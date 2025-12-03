import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { getVoteStatus, recordVote } from "../../src/lib/votes";
import PostCard from "../components/PostCard";
import { useSession } from "../context/userContext";

const { width: WIN_W } = Dimensions.get("window");
const IS_STACKED = WIN_W < 560;

// Type definition for backend posts
type BackendPost = {
  id: number;
  userId: number;
  imageUrl: string;
  description: string;
  likes: number;
  username: string;
  team: string;
};

// Convert to frontend Post format
type Post = {
  id: string;
  team: "cats" | "dogs";
  author: string;
  title: string;
  body: string;
  likes: number;
  createdAt: string;
  imageURL: string | null;
};

export default function TopPostsScreen() {
  const router = useRouter();
  const { session } = useSession();
  const [catPost, setCatPost] = useState<Post | null>(null);
  const [dogPost, setDogPost] = useState<Post | null>(null);
  const [votedId, setVotedId] = useState<string | null>(null);

  async function fetchTopPosts() {
    try {
      // Fetch cat top post
      const catResponse = await fetch(
        "https://catsvsdogs-e830690a69ba.herokuapp.com/posts/team/cat"
      );
      const catData: BackendPost[] = await catResponse.json();
      
      // Fetch dog top post
      const dogResponse = await fetch(
        "https://catsvsdogs-e830690a69ba.herokuapp.com/posts/team/dog"
      );
      const dogData: BackendPost[] = await dogResponse.json();

      // Get top post by likes for each team
      if (catData.length > 0) {
        const topCat = catData.sort((a, b) => b.likes - a.likes)[0];
        setCatPost({
          id: topCat.id.toString(),
          team: "cats",
          author: topCat.username || "Unknown",
          title: topCat.description.substring(0, 30) + "...",
          body: topCat.description,
          likes: topCat.likes,
          createdAt: new Date().toISOString(),
          imageURL: topCat.imageUrl,
        });
      } else {
        setCatPost(null);
      }

      if (dogData.length > 0) {
        const topDog = dogData.sort((a, b) => b.likes - a.likes)[0];
        setDogPost({
          id: topDog.id.toString(),
          team: "dogs",
          author: topDog.username || "Unknown",
          title: topDog.description.substring(0, 30) + "...",
          body: topDog.description,
          likes: topDog.likes,
          createdAt: new Date().toISOString(),
          imageURL: topDog.imageUrl,
        });
      } else {
        setDogPost(null);
      }

      // Check vote status for this user
      if (session?.id) {
      const v = await getVoteStatus(session.id);
      setVotedId(v.hasVotedToday ? v.postId : null);
      } else {
      setVotedId(null);
      }
    } catch (error) {
      console.error("Error fetching top posts:", error);
    }
  }

  useEffect(() => { fetchTopPosts(); }, []);
  useFocusEffect(useCallback(() => { fetchTopPosts(); }, []));

  async function vote(post: Post) {
  if (!session?.id) {
    Alert.alert("Not signed in", "Please sign in again to vote.");
    return;
  }

  const status = await getVoteStatus(session.id);
  if (status.hasVotedToday) {
    Alert.alert("You've already voted today", "Come back tomorrow!");
    return;
  }

  try {
    const response = await fetch(
      `https://catsvsdogs-e830690a69ba.herokuapp.com/posts/${post.id}/like`,
      { method: "POST" }
    );

    if (response.ok) {
      await recordVote(session.id, post.id);
      await fetchTopPosts(); // Refresh to show updated likes + “VOTED” state
    }
  } catch (error) {
    console.error("Error voting:", error);
    Alert.alert("Error", "Failed to submit vote");
  }
}


  return (
    <View style={s.page}>
      <View style={s.hero}>
        <View style={s.heroBg1} pointerEvents="none" />
        <View style={s.heroBg2} pointerEvents="none" />

        <View style={s.container}>
          <Pressable
            onPress={() => router.push("/winners")}
            hitSlop={12}
            style={({ pressed }) => [s.topLink, pressed && s.topLinkPressed]}
            accessibilityRole="button"
            accessibilityLabel="Open winners"
          >
            <Text style={s.topLinkTxt}>🏆 Winners</Text>
          </Pressable>

          <Text style={s.heroEyebrow}>Weekly Showdown</Text>
          <Text style={s.heroTitle}>🏆 Cats <Text style={s.dim}>&</Text> Dogs</Text>
          <Text style={s.heroSub}>
            One vote per day · Resets weekly · Winners saved on <Text style={s.bold}>Winners</Text>.
          </Text>
        </View>
      </View>

      <View style={s.container}>
        <View style={[s.cardsRow, IS_STACKED && s.cardsCol]}>
          <View style={[s.glassCard, s.catRing, IS_STACKED && s.cardFull]}>
            {catPost ? (
              <>
                <Badge text="CATS" tone="cat" />
                <PostCard post={catPost} rank={1} />
                <Pressable
                  onPress={() => vote(catPost)}
                  disabled={votedId !== null}
                  style={[s.voteBtn, s.catBtn, votedId !== null && s.voteBtnDisabled]}>
                  <Text style={s.voteBtnTxt}>{votedId === catPost.id ? "VOTED" : "Vote Cats"}</Text>
                </Pressable>
              </>
            ) : <EmptySide emoji="🐱" label="No Cat yet" />}
          </View>

          <View style={[s.vsWrap, IS_STACKED && { marginVertical: 12 }]}>
            <View style={s.vsToken}><Text style={s.vsTxt}>VS</Text></View>
          </View>

          <View style={[s.glassCard, s.dogRing, IS_STACKED && s.cardFull]}>
            {dogPost ? (
              <>
                <Badge text="DOGS" tone="dog" />
                <PostCard post={dogPost} rank={1} />
                <Pressable
                  onPress={() => vote(dogPost)}
                  disabled={votedId !== null}
                  style={[s.voteBtn, s.dogBtn, votedId !== null && s.voteBtnDisabled]}>
                  <Text style={s.voteBtnTxt}>{votedId === dogPost.id ? "VOTED" : "Vote Dogs"}</Text>
                </Pressable>
              </>
            ) : <EmptySide emoji="🐶" label="No Dog yet" />}
          </View>
        </View>

        {votedId ? (
          <Text style={s.footnote}>You've used your vote today. See you tomorrow 👋</Text>
        ) : (
          <View style={s.ruleBanner}>
            <Text style={s.ruleTxt}>
              Tip: Add more posts in <Text style={s.bold}>Post</Text> — leaders change in real time.
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

function Badge({ text, tone }: { text: string; tone: "cat" | "dog" }) {
  return (
    <View style={[s.badge, tone === "cat" ? s.badgeCat : s.badgeDog]}>
      <Text style={s.badgeTxt}>{tone === "cat" ? "🐱 " : "🐶 "}{text}</Text>
    </View>
  );
}

function EmptySide({ emoji, label }: { emoji: string; label: string }) {
  return (
    <View style={s.emptySide}>
      <Text style={s.emptyEmoji}>{emoji}</Text>
      <Text style={s.emptyTxt}>{label}</Text>
    </View>
  );
}

const C = {
  bg: "#F6EEE6",
  ink: "#2b1c13",
  dim: "#6a5244",
  cat: "#6e3b3b",
  dog: "#274c7a",
  glass: "rgba(255,255,255,0.6)",
  border: "rgba(0,0,0,0.06)",
};
const MAX_W = 1100;
const CARD_W = Math.min(420, WIN_W * 0.44);

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.bg },
  container: {
    width: "100%",
    maxWidth: MAX_W,
    alignSelf: "center",
    paddingHorizontal: 12,
    position: "relative",
    zIndex: 1,
  },
  hero: { paddingTop: 18, paddingBottom: 18, overflow: "hidden", position: "relative" },
  heroBg1: { position: "absolute", top: -60, left: -40, width: 280, height: 280, borderRadius: 140, backgroundColor: "#ffe7cf", opacity: 0.9, zIndex: 0 },
  heroBg2: { position: "absolute", right: -40, top: -80, width: 260, height: 260, borderRadius: 130, backgroundColor: "#f0d9ff", opacity: 0.55, zIndex: 0 },
  heroEyebrow: { color: C.dim, fontWeight: "800", letterSpacing: 0.5 },
  heroTitle: { fontSize: 28, fontWeight: "900", color: C.ink, marginTop: 2 },
  heroSub: { color: C.dim, marginTop: 6 },
  bold: { fontWeight: "900", color: C.ink },
  dim: { color: C.dim },
  topLink: {
    position: "absolute", right: 12, top: 6,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 14, paddingVertical: 10, borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth, borderColor: "rgba(0,0,0,0.08)",
    zIndex: 50, elevation: 6,
    ...Platform.select({ web: { cursor: "pointer", userSelect: "none" } }),
  },
  topLinkPressed: { transform: [{ scale: 0.98 }] },
  topLinkTxt: { fontWeight: "900", color: C.ink },
  cardsRow: {
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "space-between",
    marginTop: 10,
    gap: 12,
  },
  cardsCol: { flexDirection: "column" },
  glassCard: {
    width: CARD_W,
    borderRadius: 20,
    padding: 10,
    backgroundColor: C.glass,
    borderWidth: StyleSheet.hairlineWidth, borderColor: C.border,
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 20, shadowOffset: { width: 0, height: 10 },
  },
  cardFull: { width: "100%" },
  catRing: { shadowColor: "#ffbfb5" },
  dogRing: { shadowColor: "#b8d7ff" },
  badge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, marginBottom: 8 },
  badgeCat: { backgroundColor: "rgba(255,153,137,0.25)" },
  badgeDog: { backgroundColor: "rgba(120,170,255,0.25)" },
  badgeTxt: { fontWeight: "900", color: C.ink, letterSpacing: 0.3 },
  voteBtn: { marginTop: 10, paddingVertical: 12, borderRadius: 14, alignItems: "center", shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 6 } },
  voteBtnDisabled: { opacity: 0.45 },
  voteBtnTxt: { color: "#fff", fontWeight: "900", letterSpacing: 0.3 },
  catBtn: { backgroundColor: C.cat, shadowColor: C.cat },
  dogBtn: { backgroundColor: C.dog, shadowColor: C.dog },
  vsWrap: { width: 60, alignItems: "center", justifyContent: "center", alignSelf: "center" },
  vsToken: {
    width: 48, height: 48, borderRadius: 24,
    backgroundColor: "#fff", borderWidth: 2, borderColor: "rgba(0,0,0,0.08)",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.06, shadowRadius: 8, shadowOffset: { width: 0, height: 4 },
  },
  vsTxt: { fontWeight: "900", color: C.ink },
  emptySide: {
    height: 180, borderRadius: 16, backgroundColor: "rgba(255,255,255,0.5)",
    borderWidth: StyleSheet.hairlineWidth, borderColor: C.border, alignItems: "center", justifyContent: "center",
  },
  emptyEmoji: { fontSize: 28, marginBottom: 6 },
  emptyTxt: { color: C.dim, fontWeight: "700" },
  ruleBanner: { marginTop: 16, backgroundColor: "rgba(0,0,0,0.04)", padding: 12, borderRadius: 12 },
  ruleTxt: { color: C.dim },
  footnote: { marginTop: 16, color: C.dim, fontStyle: "italic" },
});