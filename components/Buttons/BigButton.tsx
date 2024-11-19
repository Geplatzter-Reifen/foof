import React from "react";
import { Button, ButtonProps } from "@ui-kitten/components";
import { ImageProps, StyleSheet } from "react-native";
import { RenderProp } from "@ui-kitten/components/devsupport";

/**
 * Button that takes in an icon and displays it in a big round button.
 *
 * @extends ui-kitten/components/Button
 * @property {RenderProp<Partial<ImageProps>>} icon - Icon to display in the button.
 */
type BigButtonType = Omit<
  React.PropsWithChildren<ButtonProps>,
  "accessoryLeft"
> & { icon: RenderProp<Partial<ImageProps>> | undefined };
export default function BigRoundButton(props: BigButtonType) {
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
    marginHorizontal: 25,
    marginVertical: 10,
    width: 100,
    height: 100,
    borderRadius: 50,
    elevation: 3,
  },
});
