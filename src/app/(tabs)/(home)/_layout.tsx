import { Stack } from 'expo-router';

export default function HomeLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false, title: "Home" }} />
      <Stack.Screen name="details" options={{ title: "Details" }} />
      <Stack.Screen name="request" options={{ title: "Request" }} />
    </Stack>
  );
}
