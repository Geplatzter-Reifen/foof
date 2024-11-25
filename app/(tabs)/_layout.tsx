import { Tabs } from "expo-router";
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  IconElement,
} from "@ui-kitten/components";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { FC, useState } from "react";
import { ImageProps } from "react-native";
import { useTheme } from "@ui-kitten/components";

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
  const theme = useTheme();
  return (
    <Tabs
      tabBar={(props) => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: true,
        headerTintColor: theme["text-basic-color"],
        headerStyle: {
          backgroundColor: theme["background-basic-color-1"],
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
