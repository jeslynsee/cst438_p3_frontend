import { Redirect, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { useSession } from "../context/userContext";

export default function TabLayout() {
  const { session, isLoading } = useSession();
  const [isReady, setIsReady] = useState(false);

  // wait for storage to finish loading before making routing decisions
  // had to use useEffect, else session was being read as null early, and would direct to login page even if signed in already
  // upon restart of app
  useEffect(() => {
    if (!isLoading) {
      setIsReady(true);
    }
  }, [isLoading]);

  // isReady flag to help us make routing decision
  if (!isReady) {
    return null;
  }

  // now can safely check the session
  if (session === null) {
    return <Redirect href="/" />;
  }

  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="feed" options={{ title: 'Home' }} />
      <Tabs.Screen name="feed-kass" options={{ title: "Home (Kass)" }} />
      <Tabs.Screen name="top-posts" options={{ title: "Top Posts" }} />
      <Tabs.Screen name="create-post" options={{ title: "Post" }} />
      <Tabs.Screen name="settings" options={{ title: 'Settings' }} />
    </Tabs>
  );
}