// @ts-nocheck
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from "react";
import {
  Alert,
  Dimensions,
  FlatList,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import Header from "../components/Header";
import { useSession } from "../context/userContext";

const { width } = Dimensions.get("window");

export default function Feed() {
  const router = useRouter();
  const { session } = useSession();
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  async function confirm(title: string, message: string): Promise<boolean> {
    if (Platform.OS === "web") {
      return window.confirm(`${title}\n\n${message}`);
    }
    return new Promise((resolve) => {
      Alert.alert(title, message, [
        { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
        { text: "OK", onPress: () => resolve(true) },
      ]);
    });
  }

  // this grabs the team posts based on user's team (cat or dog)
  const fetchTeamPosts = async () => {
  try {
    console.log(`Fetching posts for team: ${session.team}`);
    const response = await fetch(
      `https://catsvsdogs-e830690a69ba.herokuapp.com/posts/team/${session.team}`
    );

    if (!response.ok) {
      throw new Error(`Status ${response.status}`);
    }

    const data = await response.json();
    console.log(`Received ${data.length} posts for ${session.team} team`);

    // ✅ just trust the backend here
    setPosts(data);
  } catch (err) {
    console.error("Error fetching team posts:", err);
    Alert.alert("Error", "Failed to load posts");
  }
};

  
  // we know which posts to render (only cat or only dog) from user's team once session is ready to give that info
  // using useFocusEffect and useCallBack instead of useEffect, so when user uploads, automatically shows new post in feed page
  useFocusEffect(
    useCallback(() => {
      if (!session?.team) return;
      fetchTeamPosts();
    }, [session?.team])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTeamPosts();
    setRefreshing(false);
  };

  //TODO: Need to grab usernames of each post's user
  // grab item.userId, then call API for backend route of getUser, which takes in id
  // once we have user, just grab user's username and display that in flatlist card
  
  // render each item in FlatList
  // anon arrow below for updatePostLikes ensures we don't get inifinite loop (updating on render instead of onPress)
  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      {/* Header with username and team badge */}
      <View style={styles.postHeader}>
        <View style={styles.userInfo}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {item.username ? item.username[0].toUpperCase() : "?"}
            </Text>
          </View>
          <Text style={styles.postUsername}>{item.username || "Unknown User"}</Text>
        </View>
        <View style={[styles.teamBadge, session.team === "cat" ? styles.catBadge : styles.dogBadge]}>
          <Text style={styles.teamBadgeText}>{session.team === "cat" ? "🐱 CATS" : "🐶 DOGS"}</Text>
        </View>
      </View>

      {/* Image */}
      {item.imageUrl && (
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: item.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
        </View>
      )}

      {/* Description */}
      <Text style={styles.postDescription}>{item.description}</Text>

      {/* Like section */}
      <View style={styles.postFooter}>
        <TouchableOpacity 
          style={styles.likeButton} 
          onPress={() => updatePostLikes(item.id)}
          activeOpacity={0.7}
        > 
          <Text style={styles.likeEmoji}>❤️</Text>
          <Text style={styles.likesCount}>{item.likes}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const updatePostLikes = async (postId) => {
    try {
      // update for user first, so clean UI
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, likes: p.likes + 1 } : p
      ));
  
      // here we call to the API to actually update the post's like count
      const response = await fetch(
        `https://catsvsdogs-e830690a69ba.herokuapp.com/posts/${postId}/like`, { 
          method: "POST" 
        }
      );
  
      if (!response.ok) {
        console.log("Failed to like post");
        // Revert on failure
        setPosts(prev => prev.map(p =>
          p.id === postId ? { ...p, likes: p.likes - 1 } : p
        ));
      }
    } catch (error) {
      console.log("Error updating likes: " + error);
      setPosts(prev => prev.map(p =>
        p.id === postId ? { ...p, likes: p.likes - 1 } : p
      ));
    }
  };

  return (
    <View style={styles.page}>
      <View style={styles.header}>
        <Header/>
      </View>

      {/* below, keyExtractor knows how to uniquely identify a post by its id from db, references in renderPost */}
      <FlatList 
        data={posts} 
        renderItem={renderPost} 
        keyExtractor={(item) => item.id?.toString()}
        contentContainerStyle={styles.listContent}
        refreshing={refreshing}
        onRefresh={onRefresh}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyEmoji}>
              {session.team === "cat" ? "🐱" : "🐶"}
            </Text>
            <Text style={styles.emptyText}>
              No posts yet in the {session.team === "cat" ? "Cats" : "Dogs"} feed
            </Text>
            <Text style={styles.emptySubtext}>
              Be the first to post!
            </Text>
          </View>
        }
      />
    </View>
  );
}

const colors = {
  bg: "#F8F4F0",
  cardBg: "#FFFFFF",
  dark: "#3B261A",
  mid: "#9B6A44",
  cream: "#EDE1D5",
  catAccent: "#FF9989",
  dogAccent: "#78AAFF",
  border: "rgba(59, 38, 26, 0.1)",
  shadow: "rgba(0, 0, 0, 0.08)",
};

const styles = StyleSheet.create({
  page: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    backgroundColor: colors.cardBg,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  postCard: {
    backgroundColor: colors.cardBg,
    borderRadius: 20,
    padding: 16,
    marginBottom: 20,
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 5,
    borderWidth: 1,
    borderColor: colors.border,
  },
  postHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.cream,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: colors.border,
  },
  avatarText: {
    fontSize: 18,
    fontWeight: "900",
    color: colors.dark,
  },
  postUsername: {
    fontWeight: "800",
    fontSize: 16,
    color: colors.dark,
  },
  teamBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
  },
  catBadge: {
    backgroundColor: "rgba(255, 153, 137, 0.2)",
  },
  dogBadge: {
    backgroundColor: "rgba(120, 170, 255, 0.2)",
  },
  teamBadgeText: {
    fontSize: 12,
    fontWeight: "900",
    color: colors.dark,
    letterSpacing: 0.5,
  },
  imageContainer: {
    width: "100%",
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 12,
    backgroundColor: colors.cream,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  postDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: colors.dark,
    marginBottom: 12,
  },
  postFooter: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  likeButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.cream,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    gap: 8,
  },
  likeEmoji: {
    fontSize: 20,
  },
  likesCount: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.dark,
  },
  emptyContainer: {
    paddingVertical: 60,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: "700",
    color: colors.dark,
    marginBottom: 8,
    textAlign: "center",
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.mid,
    textAlign: "center",
  },
});