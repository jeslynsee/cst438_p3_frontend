// Admin Settings
// - Delete user accounts
// - Delete user post

import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";

import { clearAllPosts } from "../../src/lib/postsStore";
import { clearLocalProfile, getLocalProfile } from "../../src/lib/profile";
import { getTeam } from "../../src/lib/team";
import { useSession } from "../context/userContext";

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

type UIUser = { username: string; admin: boolean; };

export default function SettingsScreen() {
  const { session, signOut } = useSession();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<UIUser>({
    username: session.username,
    admin: session.admin
  });


  // Load saved profile + team
  useEffect(() => {
    (async () => {
      const prof = await getLocalProfile();
      const t = await getTeam();
      setUser({
        username: user.username,
        email: user.email,
        photoUri: prof.photoUri ?? null,
        team: user.team, // this needs to be fixed to actually show user's team. not properly loading right now due to leftover logic
        admin: user.admin,
      });
      setHydrated(true);
    })();
  }, []);

  async function onDeleteOtherAccount() {
    const ok = await confirm(
      "Delete Account",
      "Are you sure? This clears local profile, team, and posts on this device."
    );
    if (!ok) return;

    // Clear local data
    await Promise.all([
      clearLocalProfile(),
      AsyncStorage.removeItem("userTeam"),
      clearAllPosts(),
    ]);

    // Optional local UI reset
    setUser({ username: "", email: "", team: "Cats", photoUri: null, admin: false });

  }


  if (!hydrated) return null;

    return (
    <ScrollView
      style={s.page}
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={s.heading}>Admin Settings</Text>



      {/* Username */}
      <View style={s.fieldBlock}>
        <Text style={s.label}>Users</Text>
        <TextInput
          style={s.input}
          value={user.username}
          onChangeText={(v)=>setUser(p=>({ ...p, username:v }))}
          autoCapitalize="none"
        />
      </View>

      {/* Post */}
      <View style={s.fieldBlock}>
        <Text style={s.label}>Post</Text>
        <TextInput
          style={s.input}
          value={user.username}
          onChangeText={(v)=>setUser(p=>({ ...p, username:v }))}
          autoCapitalize="none"
        />
      </View>

      {/* Actions */}
        {/* Save this for a pop up when selecting account */}
        {/* Will also be used to make popup for when deleting post */}
      
        {/* <Pressable onPress={onDeleteAccount} style={s.dangerBtn}>
          <Text style={s.dangerTxt}>DELETE ACCOUNT</Text>
        </Pressable> */}

        <Pressable onPress={() => router.push("/settings")} style={s.signOutButton}>
          <Text style={s.primaryTxt}>BACK TO SETTINGS</Text>
        </Pressable>

      {/* END OF FIXED WRAPPER VIEW */}

    </ScrollView>
  );
}

/* your palette/look */
const colors = {
  bg:"#E9D8C8", card:"#F3E7DA", dark:"#3B261A", mid:"#9B6A44",
  cream:"#EDE1D5", white:"#FFFFFF", red:"#C84B3A"
};
const s = StyleSheet.create({
  page:{ flex:1, backgroundColor:colors.bg },
  content:{ padding:16, paddingBottom:28 },
  heading:{ fontSize:28, fontWeight:"900", color:colors.dark, marginBottom:14 },

  photoWrap:{ backgroundColor:colors.card, borderRadius:18, paddingVertical:22, paddingHorizontal:16, alignItems:"center", marginBottom:16 },
  photoCircle:{ width:110, height:110, borderRadius:55, backgroundColor:colors.cream, alignItems:"center", justifyContent:"center", marginBottom:14, overflow:"hidden" },
  photoText:{ color:colors.dark, opacity:0.7, fontWeight:"700" },
  photoImg:{ width:110, height:110 },

  uploadBtn:{ backgroundColor:colors.mid, paddingVertical:10, paddingHorizontal:18, borderRadius:22 },
  uploadTxt:{ color:colors.white, fontWeight:"900", letterSpacing:0.5 },

  fieldBlock:{ marginBottom:14 },
  label:{ color:colors.dark, fontWeight:"800", marginBottom:8 },
  input:{ backgroundColor:colors.white, borderRadius:12, paddingVertical:10, paddingHorizontal:12, borderWidth:1, borderColor:"rgba(59,38,26,0.12)" },

  segmentWrap:{ flexDirection:"row", backgroundColor:colors.cream, borderRadius:10, overflow:"hidden" },
  segmentHalf:{ flex:1, alignItems:"center", justifyContent:"center", paddingVertical:12 },
  segmentActive:{ backgroundColor:colors.dark },
  segmentInactive:{ backgroundColor:"transparent" },
  segmentTxt:{ fontWeight:"900", color:colors.dark },
  segmentTxtActive:{ color:"#fff" },

  primaryBtn:{ backgroundColor:colors.dark, borderRadius:12, paddingVertical:12, alignItems:"center", marginTop:6 },
  primaryTxt:{ color:"#fff", fontWeight:"900" },
  secondaryBtn:{ backgroundColor:colors.mid, borderRadius:12, paddingVertical:12, alignItems:"center", marginTop:10 },
  secondaryTxt:{ color:"#fff", fontWeight:"900" },
  dangerBtn:{ backgroundColor:colors.red, borderRadius:12, paddingVertical:12, alignItems:"center", marginTop:10 },
  dangerTxt:{ color:"#fff", fontWeight:"900" },
  signOutButton:{ backgroundColor:colors.dark, borderRadius:12, paddingVertical:12, alignItems:"center", marginTop:10 },
  signOutTxt: { color:"#fff", fontWeight:"900" }

});

