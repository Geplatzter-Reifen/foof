import React from "react";
import { Text, ThemeType, useTheme } from "@ui-kitten/components";
import { StyleSheet, Linking } from "react-native";

/**
 * CustomLink
 *
 * A reusable component that displays a styled, clickable link.
 *
 * @param {CustomLinkProps} props - The props for the component.
 * @param {string} props.linkURL - The URL that the link navigates to when clicked.
 * @param {string} props.linkName - The display text of the link.
 *
 * @returns {ReactElement}
 *
 */

interface CustomLinkProps {
  linkURL: string;
  linkName: string;
}
export default function CustomLink({ linkURL, linkName }: CustomLinkProps) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const handleLinkPress = () => {
    Linking.openURL(linkURL).catch((err) =>
      console.error("Failed to open URL:", err),
    );
  };

  return (
    <Text
      style={[styles.accentText, { textDecorationLine: "underline" }]}
      onPress={handleLinkPress}
    >
      {linkName}
    </Text>
  );
}

const makeStyles = (theme: ThemeType) =>
  StyleSheet.create({
    accentText: {
      color: theme["color-primary-600"],
    },
  });
