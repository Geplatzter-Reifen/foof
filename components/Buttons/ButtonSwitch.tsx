import React from "react";
import { StyleSheet, View, ViewProps } from "react-native";
import { ButtonElement } from "@ui-kitten/components";

interface ButtonSwitchProps extends ViewProps {
  fullWidth?: boolean;
  children: ButtonElement[];
  selectedIndex: number;
  onSelect: (index: number) => void;
}

export type ButtonSwitchElement = React.ReactElement<ButtonSwitchProps>;

const STATUS_DEFAULT: string = "basic";
const STATUS_SELECTED: string = "primary";

export class ButtonSwitch extends React.Component<ButtonSwitchProps> {
  private get childCount(): number {
    return React.Children.count(this.props.children);
  }

  private renderComponentChildren = (
    children: ButtonElement[],
  ): ButtonElement[] => {
    return React.Children.map(
      children,
      (element: ButtonElement, index: number): ButtonElement => {
        return React.cloneElement(element, {
          style: [
            element.props.style,
            this.props.fullWidth && styles.buttonFullWidth,
          ],
          status:
            index === this.props.selectedIndex
              ? STATUS_SELECTED
              : STATUS_DEFAULT,
          onPress: () => this.props.onSelect(index),
        });
      },
    );
  };

  public render(): React.ReactElement<ViewProps> {
    const { style, children, ...viewProps } = this.props;
    return (
      <View {...viewProps} style={[styles.container, style]}>
        {this.renderComponentChildren(children)}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  buttonFullWidth: {
    flex: 1,
  },
});
