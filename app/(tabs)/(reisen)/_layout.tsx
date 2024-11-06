import { Stack } from "expo-router";

export default function ReiseStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="[journeyId]" options={{ headerShown: false }} />
    </Stack>
  );
}
