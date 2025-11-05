// Central helpers for the local "profile" we’re mocking right now.
// Later connect to backend, replace these with real API calls.

import AsyncStorage from "@react-native-async-storage/async-storage";

const PROFILE = {
  username: "profile.username",
  email: "profile.email",
  photo: "profile.photoUri",
};

export type LocalProfile = {
  username: string;
  email: string;
  photoUri?: string | null;
};

export async function getLocalProfile(): Promise<LocalProfile> {
  const [u, e, p] = await Promise.all([
    AsyncStorage.getItem(PROFILE.username),
    AsyncStorage.getItem(PROFILE.email),
    AsyncStorage.getItem(PROFILE.photo),
  ]);
  return {
    username: u ?? "kassandra",
    email: e ?? "kass@example.com",
    photoUri: p || null,
  };
}

export async function setLocalProfile(p: LocalProfile) {
  await AsyncStorage.multiSet([
    [PROFILE.username, p.username],
    [PROFILE.email, p.email],
    [PROFILE.photo, p.photoUri ?? ""],
  ]);
}

export async function clearLocalProfile() {
  await Promise.all([
    AsyncStorage.removeItem(PROFILE.username),
    AsyncStorage.removeItem(PROFILE.email),
    AsyncStorage.removeItem(PROFILE.photo),
  ]);
}
