import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Dimensions,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  likePost,
  loadPosts,
  postsWithin,
  topByTeam,
  type Post,
} from "../../src/lib/postsStore";
import { getVoteStatus, recordVote } from "../../src/lib/votes";
import { closeWeekIfNeeded } from "../../src/lib/winners";
import PostCard from "../components/PostCard";

/* ---------- layout helpers ---------- */
const { width: WIN_W } = Dimensions.get("window");
// Only stack on *very* small phones. iPhone widths show stacked; tablets/web stay side-by-side.
const IS_STACKED = WIN_W < 560;

export default function TopPostsScreen() {
  const router = useRouter();
  const [all, setAll] = useState<Post[]>([]);
  const [votedId, setVotedId] = useState<string | null>(null);

  async function refresh() {
    const posts = await loadPosts();
    setAll(posts);
    const v = await getVoteStatus();
    setVotedId(v.hasVotedToday ? v.postId : null);
    await closeWeekIfNeeded(posts);
  }

  useEffect(() => { refresh(); }, []);
  useFocusEffect(useCallback(() => { refresh(); }, []));

  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);
  start.setDate(start.getDate() - start.getDay());
  const end = new Date(start); end.setDate(start.getDate() + 7);

  const { cat, dog } = useMemo(() => {
    const w = postsWithin(all, start.getTime(), end.getTime());
    return { cat: topByTeam(w, "cats"), dog: topByTeam(w, "dogs") };
  }, [all]);

  async function vote(post: Post) {
    const status = await getVoteStatus();
    if (status.hasVotedToday) {
      Alert.alert("You've already voted today", "Come back tomorrow!");
      return;
    }
    await likePost(post.id);
    await recordVote(post.id);
    await refresh();
  }

  return (
    <View style={s.page}>
      {/* HERO */}
      <View style={s.hero}>
        <View style={s.heroBg1} pointerEvents="none" />
        <View style={s.heroBg2} pointerEvents="none" />

        <View style={s.container}>
          {/* Winners button */}
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

      {/* CARDS (centered; row by default) */}
      <View style={s.container}>
        <View style={[s.cardsRow, IS_STACKED && s.cardsCol]}>
          <View style={[s.glassCard, s.catRing, IS_STACKED && s.cardFull]}>
            {cat ? (
              <>
                <Badge text="CATS" tone="cat" />
                <PostCard post={cat} rank={1} />
                <Pressable
                  onPress={() => vote(cat)}
                  disabled={votedId !== null}
                  style={[s.voteBtn, s.catBtn, votedId !== null && s.voteBtnDisabled]}>
                  <Text style={s.voteBtnTxt}>{votedId === cat.id ? "VOTED" : "Vote Cats"}</Text>
                </Pressable>
              </>
            ) : <EmptySide emoji="🐱" label="No Cat yet" />}
          </View>

          {/* VS token */}
          <View style={[s.vsWrap, IS_STACKED && { marginVertical: 12 }]}>
            <View style={s.vsToken}><Text style={s.vsTxt}>VS</Text></View>
          </View>

          <View style={[s.glassCard, s.dogRing, IS_STACKED && s.cardFull]}>
            {dog ? (
              <>
                <Badge text="DOGS" tone="dog" />
                <PostCard post={dog} rank={1} />
                <Pressable
                  onPress={() => vote(dog)}
                  disabled={votedId !== null}
                  style={[s.voteBtn, s.dogBtn, votedId !== null && s.voteBtnDisabled]}>
                  <Text style={s.voteBtnTxt}>{votedId === dog.id ? "VOTED" : "Vote Dogs"}</Text>
                </Pressable>
              </>
            ) : <EmptySide emoji="🐶" label="No Dog yet" />}
          </View>
        </View>

        {/* FOOTNOTE / TIP */}
        {votedId ? (
          <Text style={s.footnote}>You’ve used your vote today. See you tomorrow 👋</Text>
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

/* helpers */
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

/* styles */
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


