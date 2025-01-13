import { Icon, IconElement, TopNavigationAction } from "@ui-kitten/components";
import { router } from "expo-router";
import { ImageProps } from "react-native";
import React from "react";

const BackIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon {...props} name="chevron-left" style={[props?.style, { height: 24 }]} />
);

const renderBackAction = () => (
  <TopNavigationAction
    icon={BackIcon}
    hitSlop={15}
    onPress={() => router.back()}
  />
);

export default renderBackAction;
