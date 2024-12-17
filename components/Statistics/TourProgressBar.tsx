import { ProgressBar, Text, ThemeType, useTheme } from "@ui-kitten/components";
import { StyleProp, StyleSheet, View } from "react-native";
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
      <ProgressBar progress={progress} style={styles.progressBar} />
      <Text
        //@ts-ignore - wegen dem String-Konstrukt bei "left" hat sich TS beschwert
        style={{
          position: "absolute",
          top: "28%",
          left:
            progress < 0.18
              ? `${((progress + 0.04) * 100).toFixed(2)}%`
              : progress < 1
                ? `${((progress - 0.125) * 100).toFixed(2)}%`
                : "44%",
          color: progress >= 0.15 ? "#fff" : theme["text-basic-color"],
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
