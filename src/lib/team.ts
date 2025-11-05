// Simple helpers to remember the user's team choice.
// Stored key: "userTeam" as "cats" | "dogs".

import AsyncStorage from "@react-native-async-storage/async-storage";

export type Team = "cats" | "dogs";
const KEY = "userTeam";

export async function getTeam(): Promise<Team | null> {
  const v = await AsyncStorage.getItem(KEY);
  return v === "cats" || v === "dogs" ? v : null;
}

export async function setTeam(team: Team) {
  await AsyncStorage.setItem(KEY, team);
}
