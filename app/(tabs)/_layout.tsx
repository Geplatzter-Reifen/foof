import { Tabs } from "expo-router";
import { foofLightTheme } from "@/constants/custom-theme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTintColor: foofLightTheme["text-basic-color"],
        headerStyle: {
          backgroundColor: foofLightTheme["background-basic-color-1"],
        },
        tabBarStyle: {
          backgroundColor: foofLightTheme["color-basic-100"],
        },
        tabBarActiveTintColor: foofLightTheme["color-primary-500"],
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
                focused
                  ? foofLightTheme["color-primary-500"]
                  : foofLightTheme["color-basic-1100"]
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
                focused
                  ? foofLightTheme["color-primary-500"]
                  : foofLightTheme["color-basic-1100"]
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}
