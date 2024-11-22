import { Stack } from "expo-router";
import { foofLightTheme } from "@/constants/custom-theme";

export default function HomeStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: foofLightTheme["text-basic-color"],
        headerShown: true,
        headerStyle: {
          backgroundColor: foofLightTheme["color-basic-100"],
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home" }} />
    </Stack>
  );
}
