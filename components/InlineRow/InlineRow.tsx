import React from "react";
import { View, StyleSheet } from "react-native";

/**
 * InlineRow
 *
 * A flexible layout component for creating a horizontal row with two sections:
 * - A left section  that takes up 80% of the row width.
 * - A right section for action icons or buttons, aligned consistently.
 *
 * @param {InlineRowProps} props - The props for the component.
 * @param {React.ReactNode} props.leftComponent - The content to display in the left section (e.g., text, input fields).
 * @param {React.ReactNode} props.actions - The content to display in the right section (e.g., icons, buttons).
 *
 * @returns {React.ReactElement} A row layout with customizable left and right sections.
 *
 * @remarks
 * - Use this component to maintain consistent styling for rows with mixed content in settings.
 * - Customize the `leftComponent` and `actions` for your specific use case.
 */

interface InlineRowProps {
  leftComponent: React.ReactNode;
  actions: React.ReactNode;
}

export default function InlineRow({ leftComponent, actions }: InlineRowProps) {
  return (
    <View style={styles.inlineContainer}>
      <View style={styles.leftContainer}>{leftComponent}</View>
      <View style={styles.iconGroup}>{actions}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  inlineContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 10,
  },
  leftContainer: {
    width: "70%",
  },
  iconGroup: {
    flexDirection: "row",
    gap: 10,
  },
});
