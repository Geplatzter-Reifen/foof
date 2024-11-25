import { Stack } from "expo-router";
import { foofDarkTheme } from "@/constants/custom-theme";

export default function ReiseStackLayout() {
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
      <Stack.Screen
        name="index"
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={"touren"}
        options={{
          headerShown: false,
        }}
      ></Stack.Screen>
    </Stack>
  );
}
