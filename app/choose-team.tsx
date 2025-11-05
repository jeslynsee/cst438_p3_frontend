// When user has no saved team, they land here. Saves choice then goes to /feed.

import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { setTeam } from "../src/lib/team";

export default function ChooseTeam() {
  const router = useRouter();
  async function pick(side: "cats" | "dogs") { await setTeam(side); router.replace("/(tabs)/feed"); }

  return (
    <View style={s.wrap}>
      <Text style={s.title}>Pick your home feed</Text>
      <View style={s.row}>
        <TouchableOpacity style={[s.card, s.cats]} onPress={() => pick("cats")}><Text style={s.big}>🐱</Text><Text style={s.label}>Cats</Text></TouchableOpacity>
        <TouchableOpacity style={[s.card, s.dogs]} onPress={() => pick("dogs")}><Text style={s.big}>🐶</Text><Text style={s.label}>Dogs</Text></TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  wrap:{ flex:1, backgroundColor:"#FFF7EE", alignItems:"center", justifyContent:"center", padding:20 },
  title:{ fontSize:24, fontWeight:"800", color:"#3B1F12", marginBottom:20 },
  row:{ flexDirection:"row", gap:16 },
  card:{ width:140, height:160, borderRadius:16, alignItems:"center", justifyContent:"center",
         shadowColor:"#000", shadowOpacity:0.12, shadowRadius:8, shadowOffset:{width:0,height:3}, elevation:4 },
  cats:{ backgroundColor:"#F3E2D1" }, dogs:{ backgroundColor:"#DDEEE4" },
  big:{ fontSize:50 }, label:{ fontSize:18, fontWeight:"700", marginTop:8, color:"#3B1F12" }
});
