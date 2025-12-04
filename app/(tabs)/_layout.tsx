import { Ionicons } from '@expo/vector-icons';
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

  // TODO: change tab bar icons
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="feed" options={{ title: 'Home', tabBarIcon: ({ color, focused }) => (
          <Ionicons name={focused ? 'home' : 'home-outline'} size={24} color={color} />
        ), }} />
      <Tabs.Screen name="feed-kass" options={{ title: "Home (Kass)" }}/>
      <Tabs.Screen name="top-posts" options={{ title: "Top Posts", tabBarIcon: ({ color, focused}) => (
        <Ionicons name={focused ? 'arrow-up' : 'arrow-up-outline'} size={24} color={color}/>
      ), }} />
      <Tabs.Screen name="create-post" options={{ title: "Post", tabBarIcon: ({ color, focused}) => (
        <Ionicons name={focused ? 'images' : 'images-outline'} size={24} color={color}/>
      ), }} /> 
      <Tabs.Screen name="settings" options={{ title: 'Settings', tabBarIcon: ({ color, focused}) => (
        <Ionicons name={focused ? 'settings' : 'settings-outline'} size={24} color={color}/>
      ), }} />
      <Tabs.Screen name="winners" options={{ title: "Winners", href: null, }} />
    </Tabs>
  );
}