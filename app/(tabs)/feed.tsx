// @ts-nocheck
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from "react";
import {
  Alert,
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


export default function Feed() {
  const router = useRouter();
  const { session } = useSession();
  const [posts, setPosts] = useState([]);

  /** Cross-platform confirm (Alert on native, window.confirm on web) */
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
      const response = await fetch(
        `https://catsvsdogs-e830690a69ba.herokuapp.com/posts/team/${session.team}`
      );
      const data = await response.json();
      setPosts(data);
    } catch (err) {
      console.error("Error fetching team posts:", err);
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
  


  //TODO: Need to grab usernames of each post's user
  // grab item.userId, then call API for backend route of getUser, which takes in id
  // once we have user, just grab user's username and display that in flatlist card
  
  // render each item in FlatList
  // anon arrow below for updatePostLikes ensures we don't get inifinite loop (updating on render instead of onPress)
  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <Text style={styles.postUsername}>{item.username || "Unknown User"}</Text>
      <Image 
        source={{ uri: item.imageUrl }}
        style={styles.image}
      />
      <Text style={styles.postDescription}>{item.description}</Text>
      <View style={styles.postLikesContainer}> 
      <Text style={styles.postLikes}> {item.likes} </Text>
      <TouchableOpacity style={styles.postLikeButton} onPress={() => updatePostLikes(item.id)}> 
        <Text> 👍 </Text>
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
      }
  
    } catch (error) {
      console.log("Error updating likes: " + error);
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
        <View style={{ paddingVertical: 40, alignItems: "center" }}>
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
  bg:"#E9D8C8", card:"#F3E7DA", dark:"#3B261A", mid:"#9B6A44",
  cream:"#EDE1D5", white:"#FFFFFF", red:"#C84B3A"
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#C4A484",
  },
  header: {
    marginTop: 20
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
    padding: 15,
    marginVertical: 8,
  },
  postUsername: {
    fontWeight: "bold",
    marginBottom: 5,
  },
  image: {
    width: 100,
    height: 100
  },
  postDescription: {
    fontSize: 14,
  },
  postLikesContainer: {
    flexDirection: "row",
  },
  postLikes: {
    padding: 10,
  },
  postLikeButton: {
    // borderRadius: 5,
    marginTop: 10
  }
});