// Fetches a random image for a given team.

import { Team } from "./team";

export async function getRandomImage(team: Team): Promise<string | null> {
  try {
    if (team === "cats") {
      const headers: Record<string, string> = {};
      const key = process.env.EXPO_PUBLIC_CAT_API_KEY;
      if (key) headers["x-api-key"] = key;

      const res = await fetch("https://api.thecatapi.com/v1/images/search", { headers });
      const data = await res.json();
      return data?.[0]?.url ?? null;
    } else {
      const res = await fetch("https://dog.ceo/api/breeds/image/random");
      const data = await res.json();
      return data?.message ?? null;
    }
  } catch (e) {
    console.warn("image fetch failed", e);
    return null;
  }
}
