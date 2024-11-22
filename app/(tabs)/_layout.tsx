import { Tabs } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { useTheme } from "@ui-kitten/components";

export default function TabLayout() {
  const theme = useTheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTintColor: theme["text-basic-color"],
        headerStyle: {
          backgroundColor: theme["background-basic-color-1"],
        },
        tabBarStyle: {
          backgroundColor: theme["color-basic-100"],
        },
        tabBarActiveTintColor: theme["color-primary-500"],
      }}
    >
      <Tabs.Screen
        name="(touren)"
        options={{
          title: "Touren",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <FontAwesomeIcon
              icon="map"
              color={
                focused ? theme["color-primary-500"] : theme["color-basic-1100"]
              }
            />
          ),
        }}
      />
      <Tabs.Screen
        name="(home)"
        options={{
          title: "Home",
          headerShown: false,
          tabBarIcon: ({ focused }) => (
            <FontAwesomeIcon
              icon="home"
              color={
                focused ? theme["color-primary-500"] : theme["color-basic-1100"]
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}
