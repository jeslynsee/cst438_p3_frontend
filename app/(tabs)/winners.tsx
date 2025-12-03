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
  
  useFocusEffect(useCallback(() => { 
    refresh(); 
  }, []));

  return (
    <View style={s.page}>
      <View style={s.hero}>
        <View style={s.halo1} pointerEvents="none" />

        <Pressable
          onPress={() => router.push("/top-posts")}
          hitSlop={12}
          style={({ pressed }) => [s.topLink, pressed && { transform: [{ scale: 0.98 }] }]}
          accessibilityRole="button"
          accessibilityLabel="Back to Top Posts"
        >
          <Text style={s.topLinkTxt}>← Top Posts</Text>
        </Pressable>

        <Text style={s.title}>🏆 Hall of Fame</Text>
        <Text style={s.subtitle}>Daily champions who won the most votes</Text>
      </View>

      <FlatList
        data={items}
        keyExtractor={(w) => w.weekStart}
        contentContainerStyle={{ padding: 12, paddingBottom: 28 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={s.empty}>
            <Text style={s.emptyEmoji}>🏆</Text>
            <Text style={s.emptyTxt}>No winners yet!</Text>
            <Text style={s.emptySubtxt}>Cast your vote on Top Posts to crown a champion</Text>
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
      {/* Trophy indicator for latest winner */}
      {first && (
        <View style={s.trophyBadge}>
          <Text style={s.trophyText}>🏆 LATEST WINNER</Text>
        </View>
      )}

      {/* Main image - full width and larger */}
      {item.imageURL && (
        <View style={s.imageContainer}>
          <Image 
            source={{ uri: item.imageURL }} 
            style={s.mainImage}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Post content */}
      <View style={s.cardContent}>
        {/* Header with team and date */}
        <View style={s.cardHeader}>
          <View style={s.chipsRow}>
            <Chip 
              text={teamIsCat ? "🐱 CATS" : "🐶 DOGS"} 
              tone={teamIsCat ? "cat" : "dog"} 
            />
            <Chip
              text={new Date(item.weekStart).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric',
                year: 'numeric'
              })}
              tone="date"
            />
          </View>
        </View>

        {/* Title/Description */}
        <Text style={s.cardTitle}>{item.title}</Text>
        
        {/* Author info */}
        <View style={s.authorRow}>
          <View style={s.authorAvatar}>
            <Text style={s.authorAvatarText}>
              {item.author[0].toUpperCase()}
            </Text>
          </View>
          <Text style={s.cardAuthor}>by {item.author}</Text>
        </View>

        {/* Stats */}
        <View style={s.statsRow}>
          <View style={s.statItem}>
            <Text style={s.statEmoji}>❤️</Text>
            <Text style={s.statValue}>{item.likesAtClose}</Text>
            <Text style={s.statLabel}>Likes</Text>
          </View>
        </View>
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

const C = {
  bg: "#FCF6F0",
  ink: "#2b1c13",
  dim: "#6a5244",
  cat: "#FF9989",
  dog: "#78AAFF",
  date: "#6b5c4e",
  card: "#ffffff",
  border: "rgba(0,0,0,0.06)",
  gold: "#FFD700",
};

const s = StyleSheet.create({
  page: { flex: 1, backgroundColor: C.bg },

  hero: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 16,
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
  title: { fontSize: 28, fontWeight: "900", color: C.ink, marginBottom: 4 },
  subtitle: { color: C.dim, fontSize: 14 },

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
  topLinkTxt: { fontWeight: "900", color: C.ink, fontSize: 14 },

  empty: {
    marginTop: 60,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emptyEmoji: { fontSize: 64, marginBottom: 16 },
  emptyTxt: { 
    color: C.ink, 
    fontWeight: "900", 
    fontSize: 20,
    marginBottom: 8,
    textAlign: "center"
  },
  emptySubtxt: {
    color: C.dim,
    fontSize: 14,
    textAlign: "center"
  },

  card: {
    backgroundColor: C.card,
    borderRadius: 24,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    borderWidth: 1,
    borderColor: C.border,
    elevation: 8,
  },
  cardFirst: {
    borderWidth: 3,
    borderColor: C.gold,
    shadowOpacity: 0.2,
  },

  trophyBadge: {
    backgroundColor: C.gold,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: "center",
  },
  trophyText: {
    fontSize: 14,
    fontWeight: "900",
    color: C.ink,
    letterSpacing: 1,
  },

  imageContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    backgroundColor: "#f0f0f0",
  },
  mainImage: {
    width: "100%",
    height: "100%",
  },

  cardContent: {
    padding: 20,
  },
  cardHeader: {
    marginBottom: 12,
  },
  chipsRow: { 
    flexDirection: "row", 
    gap: 8, 
    flexWrap: "wrap" 
  },
  
  cardTitle: { 
    fontSize: 20, 
    fontWeight: "900", 
    color: C.ink,
    marginBottom: 12,
    lineHeight: 28,
  },

  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    gap: 10,
  },
  authorAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#EDE1D5",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: C.border,
  },
  authorAvatarText: {
    fontSize: 14,
    fontWeight: "900",
    color: C.ink,
  },
  cardAuthor: { 
    color: C.dim, 
    fontSize: 15,
    fontWeight: "700",
  },

  statsRow: {
    flexDirection: "row",
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: C.border,
    gap: 24,
  },
  statItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statEmoji: {
    fontSize: 20,
  },
  statValue: {
    fontSize: 18,
    fontWeight: "900",
    color: C.ink,
  },
  statLabel: {
    fontSize: 12,
    color: C.dim,
    fontWeight: "700",
  },

  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: C.border,
  },
  chipTxt: { 
    fontWeight: "900", 
    color: C.ink, 
    letterSpacing: 0.3,
    fontSize: 12,
  },
  chipCat: { backgroundColor: "rgba(255, 153, 137, 0.25)" },
  chipDog: { backgroundColor: "rgba(120, 170, 255, 0.25)" },
  chipDate: { backgroundColor: "rgba(0,0,0,0.04)" },
});