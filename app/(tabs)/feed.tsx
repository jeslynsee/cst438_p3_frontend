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
      <FlatList data={posts} 
      renderItem={renderPost} 
      keyExtractor={(item) => item.id?.toString()}
      ListEmptyComponent={
        <View style={{ paddingVertical: 20, alignItems: "center" }}>
          <Text style={{ fontSize: 16, color: "#333" }}>
            No posts yet
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
  page: {  // Add this!
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  header: {
    marginTop: 30
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 35,
    paddingTop: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  postCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    borderColor: "gray",
    borderWidth: 0.5,
    padding: 15,
    marginVertical: 8,
    alignItems: "center",
    width: "90%", // using percentage instead of fixed width, so looks good on both web and mobile
    maxWidth: 600, // helps posts not look zoomed in on mobile
    alignSelf: "center", // centering card itself
  },
  postUsername: {
    fontWeight: "bold",
    fontSize: 20,
    alignSelf: "flex-start", // helps align username to left/start
    width: "100%", // helps username take full width to sit nicely on top left corner of postCard
  },
  image: {
    width: 300,
    height: 200
  },
  postDescription: {
    padding: 10,
    fontSize: 14,
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
  },
  postLikes: {
    padding: 10,
  },
  postLikeButton: {
    // borderRadius: 5,
    marginTop: 10,
    borderColor: "black",
    borderRadius: 10
  }
});