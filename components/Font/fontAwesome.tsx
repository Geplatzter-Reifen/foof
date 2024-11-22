import React from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Icon from "@expo/vector-icons/FontAwesome6";
import { SvgProps } from "react-native-svg";

export const FontAwesomeIconsPack = {
  name: "FontAwesome",
  icons: createIconsMap(),
};

function createIconsMap() {
  return new Proxy(
    {},
    {
      get(target, name: string) {
        return IconProvider(name);
      },
    },
  );
}

const IconProvider = (name: string) => ({
  toReactElement: (props: SvgProps) => FontAwesomeIcon({ name, ...props }),
});

function FontAwesomeIcon({
  name,
  style,
}: {
  name: string;
  style?: StyleProp<ViewStyle>;
}) {
  // @ts-ignore - UI Kitten components pass here `tintColor`
  const { height, tintColor, ...iconStyle } = StyleSheet.flatten(style);
  return <Icon name={name} size={height} color={tintColor} style={iconStyle} />;
}
