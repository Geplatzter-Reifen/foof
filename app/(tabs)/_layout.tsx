import { Tabs } from "expo-router";
import { foofDarkTheme } from "@/constants/custom-theme";
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  IconElement,
} from "@ui-kitten/components";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { FC, useState } from "react";
import { ImageProps } from "react-native";

const MapIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon {...props} name={"map"} style={[props?.style, { width: "auto" }]} />
);

const HomeIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon {...props} name={"location-arrow"} />
);

const BottomTabBar: FC<BottomTabBarProps> = ({ navigation, state }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <BottomNavigation
      selectedIndex={selectedIndex}
      onSelect={(index) => {
        setSelectedIndex(index);
        navigation.navigate(state.routeNames[index]);
      }}
    >
      <BottomNavigationTab title="Aufzeichnen" icon={HomeIcon} />
      <BottomNavigationTab title="Tour" icon={MapIcon} />
    </BottomNavigation>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        headerTintColor: foofDarkTheme["color-basic-100"],
        headerStyle: {
          backgroundColor: foofDarkTheme["color-basic-500"],
        },
      }}
    >
      <Tabs.Screen
        name="(home)"
        options={{
          headerShown: false,
        }}
      />
      <Tabs.Screen
        name="(touren)"
        options={{
          headerShown: false,
        }}
      />
    </Tabs>
  );
}
