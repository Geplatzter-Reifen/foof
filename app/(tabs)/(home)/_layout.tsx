import { Stack } from "expo-router";
import { useTheme } from "@ui-kitten/components";

export default function HomeStackLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home" }} />
    </Stack>
  );
}
