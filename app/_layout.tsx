import { Stack } from "expo-router";
import { SessionProvider } from "./context/userContext";

export default function RootLayout() {
  return (
    // wrapping app only once with Session Provider to avoid making another "context" with it
    <SessionProvider>
    <Stack>
      <Stack.Screen name="index" options={ {headerShown: false }} />
      <Stack.Screen name="sign-up" options={ {headerShown: false }} />
      <Stack.Screen name="choose-team" options={{ headerShown: false }}/>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
    </SessionProvider>
  );
}
