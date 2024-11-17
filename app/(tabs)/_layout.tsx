import { Tabs } from "expo-router";
import { foofDarkTheme } from "@/constants/custom-theme";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        headerTintColor: foofDarkTheme["color-basic-100"],
        headerStyle: {
          backgroundColor: foofDarkTheme["color-basic-500"],
        },
        tabBarStyle: {
          backgroundColor: foofDarkTheme["color-basic-500"],
        },
        tabBarActiveTintColor: foofDarkTheme["color-primary-500"],
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
                  ? foofDarkTheme["color-primary-500"]
                  : foofDarkTheme["color-basic-100"]
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
                  ? foofDarkTheme["color-primary-500"]
                  : foofDarkTheme["color-basic-100"]
              }
            />
          ),
        }}
      />
    </Tabs>
  );
}
