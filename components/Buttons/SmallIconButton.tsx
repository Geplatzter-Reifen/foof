import React from "react";
import { RenderProp } from "@ui-kitten/components/devsupport";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import { Icon } from "@ui-kitten/components";

type SmallButtonType = React.PropsWithChildren<TouchableOpacityProps> & {
  icon: string;
}; // ist das richtig so?

export default function SmallIconButton(props: SmallButtonType) {
  return (
    <TouchableOpacity
      {...props}
      style={[props.style, styles.button]}
      onPress={props.onPress}
    >
      <Icon
        {...props}
        name={props.icon}
        style={{ height: 24, width: "auto" }}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: 22,
    elevation: 3,
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 1,
    paddingTop: 1,
  },
});
