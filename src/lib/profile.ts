// Central helpers for the local "profile" we're mocking right now.
// Later connect to backend, replace these with real API calls.

import AsyncStorage from "@react-native-async-storage/async-storage";

// Helper to get user-specific keys
function getUserKey(userId: string | number, field: string): string {
  return `profile.${userId}.${field}`;
}

export type LocalProfile = {
  username: string;
  email: string;
  photoUri?: string | null;
};

export async function getLocalProfile(userId: string | number): Promise<LocalProfile> {
  const [u, e, p] = await Promise.all([
    AsyncStorage.getItem(getUserKey(userId, "username")),
    AsyncStorage.getItem(getUserKey(userId, "email")),
    AsyncStorage.getItem(getUserKey(userId, "photo")),
  ]);
  return {
    username: u ?? "user",
    email: e ?? "user@example.com",
    photoUri: p || null,
  };
}

export async function setLocalProfile(userId: string | number, p: LocalProfile) {
  await AsyncStorage.multiSet([
    [getUserKey(userId, "username"), p.username],
    [getUserKey(userId, "email"), p.email],
    [getUserKey(userId, "photo"), p.photoUri ?? ""],
  ]);
}

export async function clearLocalProfile(userId: string | number) {
  await Promise.all([
    AsyncStorage.removeItem(getUserKey(userId, "username")),
    AsyncStorage.removeItem(getUserKey(userId, "email")),
    AsyncStorage.removeItem(getUserKey(userId, "photo")),
  ]);
}
