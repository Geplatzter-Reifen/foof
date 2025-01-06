import { Stack } from "expo-router";
import { useTheme } from "@ui-kitten/components";

export default function ReiseStackLayout() {
  const theme = useTheme();
  return (
    <Stack
      screenOptions={{
        headerTintColor: theme["text-basic-color"],
        headerShown: true,
        headerStyle: {
          backgroundColor: theme["background-basic-color-1"],
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
        name={"settings"}
        options={{
          headerShown: true,
          title: "Einstellungen",
          headerTitleAlign: "center",
        }}
      />
      <Stack.Screen
        name="createManualStage"
        options={{
          headerShown: true,
          title: "Etappe",
        }}
      />
      <Stack.Screen
        name="stagesMapViewWrapper"
        options={{
          headerShown: false,
          title: "Tourübersicht",
        }}
      />
      <Stack.Screen
        name="stage"
        options={{
          headerShown: true,
        }}
      />
    </Stack>
  );
}
