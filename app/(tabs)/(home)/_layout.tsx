import { Stack } from "expo-router";
import { useTheme } from "@ui-kitten/components";

export default function HomeStackLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerTintColor: theme["text-basic-color"],
        headerShown: true,
        headerStyle: {
          backgroundColor: theme["color-basic-100"],
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home" }} />
    </Stack>
  );
}
