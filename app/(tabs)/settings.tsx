// Settings with real actions:
// - Upload profile photo
// - Save changes locally
// - Reset Password (confirm -> "email sent")
// - Delete Account (confirm -> clear local data -> redirect to /sign-up)

import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Alert, Image, Platform,
  Pressable, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSession } from "../context/userContext";

import { getLocalProfile, setLocalProfile } from "../../src/lib/profile";
import { getTeam, setTeam, type Team } from "../../src/lib/team";

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

type UIUser = { username: string; email: string; team: "Cats" | "Dogs"; photoUri?: string | null; admin: boolean; };

export default function SettingsScreen() {
  const { session, signOut } = useSession();
  const router = useRouter();
  const [hydrated, setHydrated] = useState(false);
  const [user, setUser] = useState<UIUser>({
    username: session.username,
    email: session.email,
    team: session.team,
    photoUri: null,
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

  async function onPickTeam(side: "Cats" | "Dogs") {
    if (side === user.team) return;
    setUser(p => ({ ...p, team: side }));
    const t: Team = side === "Cats" ? "cats" : "dogs";
    await setTeam(t);
    Alert.alert("Team updated", `You’re on the ${side} feed now.`);
  }

  async function uploadPhoto() {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (perm.status !== "granted") { Alert.alert("Permission", "Please allow photo access."); return; }
    const res = await ImagePicker.launchImageLibraryAsync({ allowsEditing: true });
    if (!res.canceled) setUser(p => ({ ...p, photoUri: res.assets[0].uri }));
  }

  async function onSaveChanges() {
    await setLocalProfile({
      username: user.username,
      email: user.email,
      photoUri: user.photoUri ?? null,
    });
    Alert.alert("Saved", "Your profile changes were saved locally.");
  }

  async function onResetPassword() {
    const ok = await confirm("Reset Password", `Send a reset link to ${user.email}?`);
    if (!ok) return;
    // TODO: replace with real backend call later.
    Alert.alert("Email sent", "Check your inbox for the reset link.");
  }

  async function onDeleteAccount() {
    const ok = await confirm(
      "Delete Account",
      "Are you sure? This clears local profile, team, and posts on this device."
    );
    if (!ok) return;

    try {
      const response = await fetch(`https://catsvsdogs-e830690a69ba.herokuapp.com/api/users/${session.id}`, {
        method: "DELETE"
      });

      if (response.status === 204) {
        Alert.alert("Successfully deleted account!");

        // clear session since we only do that when user hits sign out button, but in this case, deleting account 
        await signOut();
        
        // Go back to login page, so user has option to login to different account or sign up
        router.replace("/");
      } else {
        Alert.alert("Something went wrong");
      }

    } catch(error) {
      console.log("Error deleting account: " + error);
    }

  }

  const onSignOut = async () => {
    await signOut();
  }

  if (!hydrated) return null;

    return (
    <ScrollView
      style={s.page}
      contentContainerStyle={s.content}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={s.heading}>Account Settings</Text>

      {/* Photo */}
      <View style={s.photoWrap}>
        <View style={s.photoCircle}>
          {user.photoUri
            ? <Image source={{ uri: user.photoUri }} style={s.photoImg} />
            : <Text style={s.photoText}>No Photo</Text>}
        </View>
        <Pressable onPress={uploadPhoto} style={s.uploadBtn}>
          <Text style={s.uploadTxt}>UPLOAD PROFILE PHOTO</Text>
        </Pressable>
      </View>

      {/* Username */}
      <View style={s.fieldBlock}>
        <Text style={s.label}>Username</Text>
        <TextInput
          style={s.input}
          value={user.username}
          onChangeText={(v)=>setUser(p=>({ ...p, username:v }))}
          autoCapitalize="none"
        />
      </View>

      {/* Email */}
      <View style={s.fieldBlock}>
        <Text style={s.label}>Email</Text>
        <TextInput
          style={s.input}
          value={user.email}
          onChangeText={(v)=>setUser(p=>({ ...p, email:v }))}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      {/* Team */}
      <View style={s.fieldBlock}>
        <Text style={s.label}>Team</Text>
        <View style={s.segmentWrap}>
          <Pressable
            onPress={()=>onPickTeam("Cats")}
            style={[s.segmentHalf, user.team==="Cats"?s.segmentActive:s.segmentInactive]}
          >
            <Text style={[s.segmentTxt, user.team==="Cats"&&s.segmentTxtActive]}>Cats</Text>
          </Pressable>
          <Pressable
            onPress={()=>onPickTeam("Dogs")}
            style={[s.segmentHalf, user.team==="Dogs"?s.segmentActive:s.segmentInactive]}
          >
            <Text style={[s.segmentTxt, user.team==="Dogs"&&s.segmentTxtActive]}>Dogs</Text>
          </Pressable>
        </View>
      </View>



      {/* Actions */}
      {/* WRAP ACTION BUTTONS IN A VIEW TO FIX SCROLLVIEW CLOSING */}
      {/* Admin Settings Button */}
      <View style={{ marginTop: 10 }}>
        {user?.admin && (
          <Pressable onPress={() => router.push("/admin-settings")} style={s.dangerBtn}>
            <Text style={s.primaryTxt}>ADMIN SETTINGS</Text>
          </Pressable>
        )}
          
        <Pressable onPress={onSaveChanges} style={s.primaryBtn}>
          <Text style={s.primaryTxt}>SAVE CHANGES</Text>
        </Pressable>

        <Pressable onPress={onResetPassword} style={s.secondaryBtn}>
          <Text style={s.secondaryTxt}>RESET PASSWORD</Text>
        </Pressable>

        <Pressable onPress={onDeleteAccount} style={s.dangerBtn}>
          <Text style={s.dangerTxt}>DELETE ACCOUNT</Text>
        </Pressable>

        <Pressable onPress={onSignOut} style={s.signOutButton}>
          <Text style={s.signOutTxt}>SIGN OUT</Text>
        </Pressable>
      </View>
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