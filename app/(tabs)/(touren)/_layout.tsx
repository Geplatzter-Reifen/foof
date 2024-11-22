import { Stack } from "expo-router";
import { foofLightTheme } from "@/constants/custom-theme";

export default function ReiseStackLayout() {
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
      <Stack.Screen
        name="index"
        options={{
          headerShown: true,
          title: "Meine Touren",
        }}
      />
    </Stack>
  );
}
