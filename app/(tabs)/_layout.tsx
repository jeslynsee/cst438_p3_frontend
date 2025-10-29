import { Tabs } from 'expo-router';

 
// import { IconSymbol } from 'components/ui/icon-symbol';
// import { useColorScheme } from '@/hooks/use-color-scheme';

export default function TabLayout() {
//   const colorScheme = useColorScheme();

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
        name="settings"
        options={{ 
          title: 'Settings' }}
      />

    </Tabs>
  );
}
