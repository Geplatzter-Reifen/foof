import React from "react";
import { Button, ButtonProps } from "@ui-kitten/components";
import { RenderProp } from "@ui-kitten/components/devsupport";
import { ImageProps, StyleSheet } from "react-native";

type BigButtonType = Omit<
  React.PropsWithChildren<ButtonProps>,
  "accessoryLeft"
> & { icon: RenderProp<Partial<ImageProps>> | undefined };
export default function SmallRoundButton(props: BigButtonType) {
  return (
    <Button
      {...props}
      style={styles.button}
      accessoryLeft={props.icon}
      onPress={props.onPress}
    ></Button>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 25,
    elevation: 3,
  },
});
