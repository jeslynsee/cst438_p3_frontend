import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useState } from "react";
import {
    Dimensions,
    FlatList,
    Image,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { getWinners, type WeeklyWinner } from "../../src/lib/winners";

const { width } = Dimensions.get("window");

export default function WinnersScreen() {
  const router = useRouter();
  const [items, setItems] = useState<WeeklyWinner[]>([]);
  const refresh = async () => setItems(await getWinners());
  useFocusEffect(useCallback(() => { refresh(); }, []));

  return (
    <View style={s.page}>
      <View style={s.hero}>
        {/* bg shapes shouldn't block touches */}
        <View style={s.halo1} pointerEvents="none" />

        {/* Top-right: back to Top Posts */}
        <Pressable
          onPress={() => router.push("/top-posts")}
          hitSlop={12}
          style={({ pressed }) => [s.topLink, pressed && { transform: [{ scale: 0.98 }] }]}
          accessibilityRole="button"
          accessibilityLabel="Back to Top Posts"
        >
          <Text style={s.topLinkTxt}>Top Posts</Text>
        </Pressable>

        <Text style={s.title}>Poll Winners</Text>
        <Text style={s.subtitle}>Archive of weekly champions</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(w) => w.weekStart}
        contentContainerStyle={{ padding: 12, paddingBottom: 28 }}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyEmoji}>🏆</Text>
            <Text style={s.emptyTxt}>No winners yet. Cast your vote on Top Posts!</Text>
          </View>
        }
        renderItem={({ item, index }) => <WinnerCard item={item} first={index === 0} />}
      />
    </View>
  );
}

function WinnerCard({ item, first }: { item: WeeklyWinner; first: boolean }) {
  const teamIsCat = item.team === "cats";
  return (
    <View style={[s.card, first && s.cardFirst]}>
      {/* left rail */}
      <View style={s.rail}>
        <View style={s.dot} />
        <View style={s.line} />
      </View>

      <View style={s.cardMain}>
        <View style={s.cardHeader}>
          <Text style={s.cardTitle}>{first ? "🏆 " : ""}{item.title}</Text>
          <View style={s.chipsRow}>
            <Chip text={teamIsCat ? "CATS" : "DOGS"} tone={teamIsCat ? "cat" : "dog"} />
            <Chip
              text={`${new Date(item.weekStart).toLocaleDateString()} – ${new Date(item.weekEnd).toLocaleDateString()}`}
              tone="date"
            />
          </View>
        </View>

        <Text style={s.cardMeta}>by {item.author}</Text>
        <Text style={s.cardLikes}>Likes at close: {item.likesAtClose}</Text>
      </View>

      <View style={s.thumbWrap}>
        {item.imageURL ? (
          <Image source={{ uri: item.imageURL }} style={s.thumb} />
        ) : (
          <View style={s.thumbFallback}>
            <Text style={s.thumbEmoji}>{teamIsCat ? "🐱" : "🐶"}</Text>
          </View>
        )}
      </View>
    </View>
  );
}

function Chip({ text, tone }: { text: string; tone: "cat" | "dog" | "date" }) {
  return (
    <View
      style={[
        s.chip,
        tone === "cat" && s.chipCat,
        tone === "dog" && s.chipDog,
        tone === "date" && s.chipDate,
      ]}
    >
      <Text style={s.chipTxt}>{text}</Text>
    </View>
  );
}

/* --- palette/styles --- */
const C = {
  bg: "#FCF6F0",
  ink: "#2b1c13",
  dim: "#6a5244",
  cat: "#6e3b3b",
  dog: "#274c7a",
  date: "#6b5c4e",
  card: "#ffffff",
  border: "rgba(0,0,0,0.06)",
};

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.bg },

  hero: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 8,
    overflow: "hidden",
    position: "relative",
  },
  halo1: {
    position: "absolute",
    top: -70,
    right: -50,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: "#ffe7cf",
    opacity: 0.6,
    zIndex: 0,
  },
  title: { fontSize: 28, fontWeight: "900", color: C.ink },
  subtitle: { color: C.dim, marginTop: 4 },

  /* Top-right link (matches Top Posts header pill) */
  topLink: {
    position: "absolute",
    right: 12,
    top: 6,
    backgroundColor: "rgba(255,255,255,0.9)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
    zIndex: 5,
    elevation: 6,
    ...Platform.select({ web: { cursor: "pointer", userSelect: "none" } }),
  },
  topLinkTxt: { fontWeight: "900", color: C.ink },

  empty: {
    marginTop: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyEmoji: { fontSize: 40, marginBottom: 8 },
  emptyTxt: { color: C.dim, fontWeight: "700" },

  card: {
    flexDirection: "row",
    alignItems: "stretch",
    backgroundColor: C.card,
    borderRadius: 18,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
  },
  cardFirst: {
    borderWidth: 2,
    borderColor: "rgba(255,204,0,0.45)",
  },

  rail: { width: 16, alignItems: "center" },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ffcc00",
    marginTop: 6,
  },
  line: {
    flex: 1,
    width: 2,
    backgroundColor: "rgba(0,0,0,0.07)",
    marginTop: 6,
    borderRadius: 1,
  },

  cardMain: { flex: 1, paddingHorizontal: 8 },
  cardHeader: { marginBottom: 4 },
  cardTitle: { fontSize: 16, fontWeight: "900", color: C.ink },
  chipsRow: { flexDirection: "row", gap: 8, marginTop: 6, flexWrap: "wrap" },
  cardMeta: { color: C.dim, marginTop: 2 },
  cardLikes: { marginTop: 8, fontWeight: "800", color: C.ink },

  thumbWrap: {
    width: Math.min(96, width * 0.22),
    alignItems: "center",
    justifyContent: "center",
  },
  thumb: { width: "100%", height: 72, borderRadius: 12, backgroundColor: "#eee" },
  thumbFallback: {
    width: "100%",
    height: 72,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.04)",
    alignItems: "center",
    justifyContent: "center",
  },
  thumbEmoji: { fontSize: 28 },

  chip: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
  },
  chipTxt: { fontWeight: "900", color: C.ink, letterSpacing: 0.2 },
  chipCat: { backgroundColor: "rgba(255,153,137,0.25)" },
  chipDog: { backgroundColor: "rgba(120,170,255,0.25)" },
  chipDate: { backgroundColor: "rgba(0,0,0,0.04)" },
});

