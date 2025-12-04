import * as ImagePicker from "expo-image-picker";
import { MediaTypeOptions } from "expo-image-picker";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSession } from "../context/userContext";

import ConfettiCannon from "react-native-confetti-cannon";
import { getRandomImage } from "../../src/lib/imageAPI";
import { getLocalProfile } from "../../src/lib/profile";
import { getTeam, type Team } from "../../src/lib/team";

import { supabase } from "../../src/lib/supabase";

export default function CreatePost() {
  const router = useRouter();
  const { session } = useSession();

  const [team, setTeam] = useState<Team>("cats");
  const [author, setAuthor] = useState("");
  const [title, setTitle] = useState("");
  const [description, setBody] = useState("");
  const [imageUrl, setImageURL] = useState<string | null>(null);
  const [celebrate, setCelebrate] = useState(false);

  async function hydrateTeam() { const t = await getTeam(); if (t) setTeam(t); }
  async function hydrateAuthor() { 
    const p = await getLocalProfile(session.id); 
    setAuthor(session.username); 
  }

  useEffect(() => { hydrateTeam(); hydrateAuthor(); }, []);
  useFocusEffect(useCallback(() => { hydrateTeam(); hydrateAuthor(); }, []));

  async function uploadImageToSupabase(uri) {
    try {
      // convert image URI to Binary Large Object (blob) for react native
      const response = await fetch(uri);
      const binaryData = await response.blob(); // grabbing file from user's device (response) and turning it into binary data 
      
      // creating unique file name, avoid problems with duplicates
      const fileExt = uri.split('.').pop() || 'jpg';
      const fileName = `${session.id}-${Date.now()}.${fileExt}`;
      const filePath = fileName;
  
      // upload to supabase storage
      const { data, error } = await supabase.storage
        .from('post-images')
        .upload(filePath, binaryData, {
          contentType: 'image/jpeg',
          upsert: false
        });
  
      if (error) {
        console.error("Upload error:", error);
        Alert.alert("Upload failed", error.message);
        return null;
      }
  
      // get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('post-images')
        .getPublicUrl(filePath);
  
      return publicUrl; // gives us the URL we need, so when we call to backend API for creating a post, we can 
      // give this string as the imageURL

    } catch (error) {
      console.error("Error uploading image:", error);
      Alert.alert("Error", "Failed to upload image");
      return null;
    }
  }

  // may need to alter below to get image info to send to backend
  async function pickImage() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") { Alert.alert("Permission needed", "Allow photo access."); return; }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.9,
    });

    if (!result.canceled) {
      const uri = result.assets[0].uri;
      
      // attempting upload to supabase storage
      Alert.alert("Uploading to Supabase Storage...");
      const uploadedUrl = await uploadImageToSupabase(uri);
      
      if (uploadedUrl) {
        setImageURL(uploadedUrl);
        Alert.alert("Success! Image uploaded");
      }
    }

  }

  async function autoImage(userTeam) {
    try {
      if (userTeam === "cat") {
        // Fetch cat image
        const url = await getRandomImage("cats"); // Make sure we pass "cats" not team variable
        if (!url) {
          Alert.alert("Oops", "Couldn't fetch a random cat image right now.");
        } else {
          setImageURL(url);
        }
      } else if (userTeam === "dog") {
        // Fetch dog image
        const response = await fetch("https://dog.ceo/api/breeds/image/random");
        const data = await response.json();
        const url = data?.message; 
        
        if (!url) {
          Alert.alert("Error", "Couldn't fetch a random dog image right now.");
        } else {
          setImageURL(url);
        }
      }
    } catch (error) {
      console.log("Error fetching random image: " + error);
      Alert.alert("Error", "Failed to load random image");
    }
  }

  function clearImage() { setImageURL(null); }

  async function submit() {
    if (!title.trim() || !description.trim() || !author.trim()) {
      Alert.alert("Missing info", "Please fill in title, body, and author.");
      return;
    }

    try {
      const response = await fetch("https://catsvsdogs-e830690a69ba.herokuapp.com/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({ userId: session.id, imageUrl: imageUrl, description: description })
      });

      // 201 code means post created
      if (response.status === 201) {
        // Clear form
        setAuthor("");
        setBody("");
        setTitle("");
        setImageURL("");
        
        // Show confetti
        setCelebrate(true);
        
        // Wait 2 seconds, then navigate to feed
        setTimeout(() => {
          setCelebrate(false);
          router.push("/(tabs)/feed");
        }, 2000);
        
      } else {
        Alert.alert("Something went wrong");
      }
    } catch (error) {
      console.log("Error making post: " + error);
    }
  }

  const Wrapper: React.ComponentType<any> =
    Platform.OS === "ios" || Platform.OS === "android" ? KeyboardAvoidingView : View;

  return (
    <Wrapper {...(Platform.OS !== "web" ? { behavior: "padding" } : {})} style={{ flex: 1 }}>
      <View style={s.header}>
        <Text style={s.headerTitle}>New Post</Text>
      </View>

      <ScrollView style={s.wrap} contentContainerStyle={s.content} keyboardShouldPersistTaps="handled">
        {/* Team indicator */}
        <View style={[s.teamIndicator, session.team === "cat" ? s.catTeam : s.dogTeam]}>
          <Text style={s.teamIndicatorText}>
            {session.team === "cat" ? "🐱 Posting to CATS feed" : "🐶 Posting to DOGS feed"}
          </Text>
        </View>

        <Text style={s.label}>Title</Text>
        <TextInput style={s.input} value={title} onChangeText={setTitle} placeholder="Catchy headline" />

        <Text style={s.label}>Body</Text>
        <TextInput
          style={[s.input, s.textarea]}
          value={description}
          onChangeText={setBody}
          placeholder="What's on your mind?"
          multiline
        />

        <Text style={s.label}>Author</Text>
        <TextInput style={s.input} value={author} onChangeText={setAuthor} placeholder="Your name" />

        {/* Image card */}
        {!!imageUrl && (
          <View style={s.imageCard}>
            <Image source={{ uri: imageUrl }} style={s.image} resizeMode="cover" />
          </View>
        )}

        {/* Actions row */}
        <View style={s.row}>
          {imageUrl ? (
            <TouchableOpacity onPress={clearImage} style={[s.btn, s.tertiary]}>
              <Text style={s.btnTxtDark}>Remove Photo</Text>
            </TouchableOpacity>
          ) : (
            <>
              <TouchableOpacity onPress={pickImage} style={[s.btn, s.secondary]}>
                <Text style={s.btnTxtDark}>Upload Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => autoImage(session.team)} style={[s.btn, s.secondary]}>
                <Text style={s.btnTxtDark}>Random {session?.team === "dog" ? "Dog" : "Cat"}</Text>
              </TouchableOpacity>
            </>
          )}
        </View>

        <View style={s.btn}>
        <TouchableOpacity onPress={submit} style={s.headerAction} accessibilityRole="button">
          <Text style={s.headerActionTxt}>Post</Text>
        </TouchableOpacity>
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>

      {/* 🎉 Confetti overlay */}
      {celebrate && (
        <ConfettiCannon
          count={150}
          origin={{ x: -10, y: 0 }}
          fadeOut
          fallSpeed={3000}
          explosionSpeed={500}
        />
      )}
    </Wrapper>
  );
}

const colors = {
  bg: "#FFF7EE",
  dark: "#3B1F12",
  accent: "#3B1F12",
  chip: "#EADBC8",
  chipAlt: "#EFE1D2",
  white: "#FFFFFF",
  border: "rgba(59,31,18,0.10)",
};

const s = StyleSheet.create({
  header: {
    backgroundColor: colors.bg,
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: { fontSize: 26, fontWeight: "900", color: colors.dark },
  headerAction: {
    backgroundColor: colors.accent,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  headerActionTxt: { color: "#fff", fontWeight: "900", letterSpacing: 0.2 },
  wrap: { flex: 1, backgroundColor: colors.bg },
  content: { padding: 16, paddingBottom: 120 },
  teamIndicator: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  catTeam: {
    backgroundColor: "rgba(255, 153, 137, 0.3)",
    borderWidth: 2,
    borderColor: "#FF9989",
  },
  dogTeam: {
    backgroundColor: "rgba(120, 170, 255, 0.3)",
    borderWidth: 2,
    borderColor: "#78AAFF",
  },
  teamIndicatorText: {
    fontSize: 16,
    fontWeight: "900",
    color: colors.dark,
    letterSpacing: 0.5,
  },
  label: { marginTop: 10, marginBottom: 6, color: colors.dark, fontWeight: "700" },
  input: {
    backgroundColor: colors.white,
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textarea: { minHeight: 120, textAlignVertical: "top", lineHeight: 20 },
  imageCard: {
    marginTop: 12,
    width: "100%",
    maxWidth: 900,
    alignSelf: "center",
    aspectRatio: 16 / 9,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.border,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 5,
  },
  image: { width: "100%", height: "100%" },
  row: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
    flexWrap: "wrap",
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  secondary: { backgroundColor: colors.chip },
  tertiary: { backgroundColor: colors.chipAlt },
  btnTxtDark: { color: colors.dark, fontWeight: "900" },
});