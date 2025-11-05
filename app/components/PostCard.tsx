import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import type { Post } from "../../src/lib/postsStore";

export default function PostCard({
  post, rank, onLike
}: { post: Post; rank?: number; onLike?: () => void }) {
  return (
    <View style={s.card}>
      {typeof rank === "number" && (
        <View style={s.rank}><Text style={s.rankTxt}>{rank}</Text></View>
      )}

      <Text style={s.title} numberOfLines={2}>{post.title}</Text>
      <Text style={s.meta}>
        {post.team.toUpperCase()} • by {post.author} • {new Date(post.createdAt).toLocaleDateString()}
      </Text>

      {post.imageURL && (
        <View style={s.imageFrame}>
          <Image source={{ uri: post.imageURL }} style={s.image} resizeMode="cover" />
        </View>
      )}

      <Text style={s.body} numberOfLines={post.imageURL ? 4 : 6}>{post.body}</Text>

      <View style={s.footer}>
        <Pressable onPress={onLike} style={s.likePill}><Text style={s.likeTxt}>❤️ {post.likes}</Text></Pressable>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: "#fff", borderRadius: 16, padding: 14, gap: 8,
    shadowColor: "#000", shadowOpacity: 0.12, shadowRadius: 10, shadowOffset: { width: 0, height: 4 },
    elevation: 5, borderWidth: 1, borderColor: "rgba(59,31,18,0.06)"
  },
  rank:{ alignSelf:"flex-start", backgroundColor:"#3B1F12", borderRadius:14, paddingHorizontal:10, paddingVertical:4 },
  rankTxt:{ color:"#fff", fontWeight:"900", fontSize:12 },
  title:{ fontSize:17, fontWeight:"800", color:"#2a1a12" },
  meta:{ fontSize:12, color:"#6b4b3a" },

  /* same 16:9 treatment here */
  imageFrame:{ width:"100%", aspectRatio:16/9, borderRadius:12, overflow:"hidden", backgroundColor:"#fff", marginTop:4 },
  image:{ width:"100%", height:"100%" },

  body:{ fontSize:14, color:"#1f1f1f", lineHeight:20 },
  footer:{ flexDirection:"row", justifyContent:"flex-end", marginTop:6 },
  likePill:{ backgroundColor:"#F5E9DB", paddingVertical:6, paddingHorizontal:10, borderRadius:20 },
  likeTxt:{ color:"#3B1F12", fontWeight:"800" }
});
