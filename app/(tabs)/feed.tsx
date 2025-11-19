import { useRouter } from 'expo-router';
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
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

  // useEffect function to check if user is Team Cat or Team Dog, then display only that team's posts
  useEffect(() => {
   // use session.team to determine if team cat or dog posts will be displayed
   const fetchTeamPosts = async () => {

    try {
      const response = await fetch(`https://catsvsdogs-e830690a69ba.herokuapp.com/posts/team/${session.team}`, {
        method: "GET",
        headers: {
          "Accept": "application/json" 
        }
      });
  
      const data = await response.json();
      console.log("Current team posts: " + data);
      setPosts(data);

    } catch (error) {
      console.log("Error being caught: " + error);
    }
   

   };

   // below ensures we have access to the session/user info of team before trying to call API with user's team (cat or dog)
   if (session?.team) {
    fetchTeamPosts();
  }

  }, [session?.team]);


  // render each item in FlatList
  const renderPost = ({ item }) => (
    <View style={styles.postCard}>
      <Text style={styles.postUsername}>{item.user?.username || "Unknown User"}</Text>
      <Text style={styles.postDescription}>{item.description}</Text>
    </View>
  );

  


  return (
    <View style={styles.container}>
      
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

      // contentContainerStyle={{
      //   flexGrow: 1,             // FlatList fills screen
      //   justifyContent: "center", // centers our text vertically
      // }}
      
      />

    </View>
  );

}

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
  postDescription: {
    fontSize: 14,
  },
});