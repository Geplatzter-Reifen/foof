import React from "react";
import { Button } from "@ui-kitten/components";
import { ImageProps, StyleSheet } from "react-native";
import { RenderProp } from "@ui-kitten/components/devsupport";

type BigButtonProps = {
  icon?: RenderProp<ImageProps>;
  onPress?: () => void;
};
export default function BigRoundButton(props: BigButtonProps) {
  return (
    <Button
      style={styles.button}
      accessoryLeft={props.icon}
      onPress={props.onPress}
    ></Button>
  );
}

const styles = StyleSheet.create({
  button: {
    margin: 10,
    width: 100, // Adjust the width as needed
    height: 100, // Adjust the height as needed
    borderRadius: 50,
  },
});
