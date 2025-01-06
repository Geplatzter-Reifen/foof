import React from "react";
import { StyleSheet, View } from "react-native";
import { Text, Icon, TextProps, useTheme } from "@ui-kitten/components";
import { EvaStatus } from "@ui-kitten/components/devsupport";

type IconStatPropType = React.PropsWithChildren<TextProps> & {
  icon: string;
  iconSize?: number;
  fontSize?: number;
  centered?: boolean;
  reversed?: boolean;
};

export default function IconStat(props: IconStatPropType) {
  const iconSize = props.iconSize ?? 22;
  const fontSize = props.fontSize ?? 18;
  const centered = props.centered ?? false;
  const reversed = props.reversed ?? false;

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
    <View
      style={
        centered
          ? styles.viewCentered
          : reversed
            ? styles.viewReversed
            : styles.view
      }
      testID="container"
    >
      <Icon
        name={props.icon}
        style={{ height: iconSize, width: "auto", color: iconColorString }}
      />
      <Text style={{ fontSize: fontSize, marginHorizontal: 8 }}>
        {props.children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    flexDirection: "row",
  },
  viewReversed: {
    flex: 1,
    flexDirection: "row-reverse",
  },
  viewCentered: {
    flex: 1,
    alignItems: "center",
    gap: 4,
  },
});
