import { Stack } from "expo-router";

export default function ReiseStackLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Meine Reisen" }} />
      {/*<Stack.Screen name="[journeyId]" options={{ title: "Reise" }} />*/}
    </Stack>
  );
}
