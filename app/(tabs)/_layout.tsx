import { Tabs } from "expo-router";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="(reisen)"
        options={{
          title: "Reisen",
          headerShown: false,
          tabBarIcon: () => <FontAwesomeIcon icon="map" />,
        }}
      />
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: () => <FontAwesomeIcon icon="home" />,
        }}
      />
    </Tabs>
  );
}
