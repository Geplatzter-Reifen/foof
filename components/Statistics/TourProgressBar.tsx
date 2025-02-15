import { ProgressBar, Text, ThemeType, useTheme } from "@ui-kitten/components";
import { DimensionValue, StyleProp, StyleSheet, View } from "react-native";
import React from "react";

type TourProgressBarProps = React.PropsWithChildren<StyleProp<any>> & {
  progress: number;
};

export function TourProgressBar(props: TourProgressBarProps) {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const { progress, ...rest } = props;

  return (
    <View {...rest}>
      <ProgressBar
        progress={progress}
        animating={false}
        style={styles.progressBar}
      />
      <Text
        style={{
          position: "absolute",
          left: (progress < 0.18
            ? `${((progress + 0.015) * 100).toFixed(2)}%`
            : progress < 1
              ? `${((progress - 0.145) * 100).toFixed(2)}%`
              : "44%") as DimensionValue,
          color: progress < 0.18 ? theme["text-basic-color"] : "#fff",
          fontSize: 19,
        }}
      >
        {(progress * 100).toFixed(1) + "%"}
      </Text>
    </View>
  );
}

const makeStyles = (theme: ThemeType): any => {
  return StyleSheet.create({
    progressBar: {
      height: 27,
      backgroundColor: theme["background-basic-color-2"],
      borderRadius: 6,
    },
  });
};
