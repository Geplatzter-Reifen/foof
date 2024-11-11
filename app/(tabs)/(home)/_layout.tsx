import { Stack } from "expo-router";
import { foofDarkTheme } from "@/constants/custom-theme";

export default function HomeStackLayout() {
  return (
    <Stack
      screenOptions={{
        headerTintColor: foofDarkTheme["color-basic-100"],
        headerShown: true,
        headerStyle: {
          backgroundColor: foofDarkTheme["color-basic-500"],
        },
      }}
    >
      <Stack.Screen name="index" options={{ title: "Home" }} />
    </Stack>
  );
}
