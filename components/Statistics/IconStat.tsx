import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Icon, TextProps, useTheme } from "@ui-kitten/components";
import { EvaStatus } from "@ui-kitten/components/devsupport";

type IconStatPropType = React.PropsWithChildren<TextProps> & {
  icon: string;
  iconHeight?: number;
  iconWidth?: number;
  fontSize?: number;
};

export default function IconStat(props: IconStatPropType) {
  const iconHeight = props.iconHeight ?? 22;
  const iconWidth = props.iconWidth ?? "auto";
  const fontSize = props.fontSize ?? 18;

  // Iconfarbe wird durch den EvaStatus (oder "text") bestimmt
  const theme = useTheme();
  function getColorStringByStatus(iconStatus: EvaStatus): string {
    switch (iconStatus) {
      case "basic":
        return theme["color-basic-500"];
      case "success":
        return theme["color-success-500"];
      case "info":
        return theme["color-info-500"];
      case "warning":
        return theme["color-warning-500"];
      case "danger":
        return theme["color-danger-500"];
      case "text":
        return theme["text-basic-color"];
      default:
        return theme["color-primary-500"];
    }
  }
  const iconColorString = getColorStringByStatus(props.status ?? "primary");

  return (
    <View style={styles.view} testID="container">
      <Icon
        name={props.icon}
        style={{ height: iconHeight, width: iconWidth, color: iconColorString }}
      />
      <Text style={{ fontSize: fontSize, ...styles.text }}>
        {props.children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flexDirection: "row",
  },
  text: {
    marginLeft: 8,
    flexShrink: 1,
    flexWrap: "wrap",
  },
});
