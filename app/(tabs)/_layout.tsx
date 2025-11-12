import { Redirect, Tabs } from "expo-router";
import { useEffect, useState } from "react";
import { getTeam, type Team } from "../../src/lib/team";
 
// import { IconSymbol } from 'components/ui/icon-symbol';
// import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
//   const colorScheme = useColorScheme();
  const [team, setTeam] = useState<Team | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => { getTeam().then(t => { setTeam(t); setLoaded(true); }); }, []);

  if (!loaded) return null;           // wait for AsyncStorage
  if (!team) return <Redirect href="/choose-team" />;

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        headerShown: false,
        // tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="feed"
        options={{
          title: 'Home',
          // tabBarIcon: ({ color }) => <IconSymbol size={28} name="house.fill" color={color} />,
        }}
      />
      <Tabs.Screen 
      name="top-posts" 
      options={{ 
        title: "Top Posts" 
        }} 
      />
      <Tabs.Screen 
      name="create-post" 
      options={{ 
        title: "Post" 
        }} 
      />
      <Tabs.Screen
        name="settings"
        options={{ 
          title: 'Settings' }}
      />
      <Tabs.Screen
        name="winners"
        options={{
          title: "Winners",
          href: null,                
        }}
      />
    </Tabs>
  );
}
