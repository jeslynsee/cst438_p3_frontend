// Top Posts ranks by likes. It shows only the chosen team if one is set.
// Pulls posts from postsStore and supports pull-to-refresh.

import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { likePost, loadPosts, type Post } from "../../src/lib/postsStore";
import { getTeam, type Team } from "../../src/lib/team";
import PostCard from "../components/PostCard";

type TimeRange = "today" | "week" | "all";

export default function TopPostsScreen() {
  const [items, setItems] = useState<Post[]>([]);
  const [team, setTeam] = useState<Team | null>(null);
  const [range, setRange] = useState<TimeRange>("week");
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  async function refresh() {
    const [p, t] = await Promise.all([loadPosts(), getTeam()]);
    setItems(p); setTeam(t);
  }

  useEffect(() => { refresh(); }, []);
  useFocusEffect(useCallback(() => { refresh(); }, []));

  const filtered = useMemo(() => {
    const now = Date.now();
    const cutoff = range === "today" ? now - 86400000 : range === "week" ? now - 7*86400000 : 0;
    return items
      .filter(p => !team || p.team === team)
      .filter(p => (cutoff ? new Date(p.createdAt).getTime() >= cutoff : true))
      .sort((a, b) => b.likes - a.likes);
  }, [items, team, range]);

  async function onLike(id: string) { await likePost(id); refresh(); }

  return (
    <View style={s.wrap}>
      <View style={s.header}>
        <Text style={s.title}>Top {team ? (team === "cats" ? "Cats" : "Dogs") : "Posts"}</Text>
        <View style={s.segmented}>
          {(["today","week","all"] as TimeRange[]).map(k => {
            const label = k === "today" ? "Today" : k === "week" ? "Week" : "All";
            const active = range === k;
            return (
              <Text key={k} onPress={()=>setRange(k)} style={[s.seg, active && s.segActive]}>
                {label}
              </Text>
            );
          })}
        </View>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(p) => p.id}
        contentContainerStyle={s.list}
        renderItem={({ item, index }) => (
          <PostCard post={item} rank={index + 1} onLike={() => onLike(item.id)} />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={async () => { setRefreshing(true); await refresh(); setRefreshing(false); }} />
        }
        ListEmptyComponent={<Text style={s.empty}>Nothing trending yet.</Text>}
      />

      <Text onPress={() => router.push("/create-post")} style={s.fab} accessibilityRole="button">＋</Text>
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { flex: 1, backgroundColor: "#FFF7EE" },
  header: { paddingHorizontal: 16, paddingTop: 14, paddingBottom: 6, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  title: { fontSize: 24, fontWeight: "900", color: "#3B1F12" },
  segmented: { flexDirection: "row", gap: 8, backgroundColor: "#F0E3D5", padding: 4, borderRadius: 10 },
  seg: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 8, color: "#3B1F12", fontWeight: "700" },
  segActive: { backgroundColor: "#3B1F12", color: "white" },
  list: { padding: 16, gap: 12, paddingBottom: 80 },
  empty: { textAlign: "center", color: "#6b4b3a", marginTop: 20 },
  fab: {
    position: "absolute", right: 18, bottom: 24, fontSize: 34, lineHeight: 40, textAlign: "center",
    width: 56, height: 56, borderRadius: 28, backgroundColor: "#3B1F12", color: "white", fontWeight: "900",
    shadowColor: "#000", shadowOpacity: 0.2, shadowRadius: 8, shadowOffset: { width: 0, height: 4 }
  }
});
