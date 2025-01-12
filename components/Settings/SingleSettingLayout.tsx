import React, { ReactElement } from "react";
import {
  Divider,
  Layout,
  Text,
  ThemeType,
  useTheme,
} from "@ui-kitten/components";
import { StyleSheet } from "react-native";

/**
 * SingleSettingLayout
 *
 * A layout component designed to display a single setting. It includes a header
 * for the setting name, a divider-line for visual separation, and custom content for the setting.
 *
 * @param {SingleSettingLayoutProps} props - The props for the component.
 * @param {ReactElement} props.children single setting content - The content to be displayed for the setting.
 * @param {string} props.settingName - The name of the setting, displayed as a header.
 *
 * @returns {ReactElement}
 *
 */

interface SingleSettingLayoutProps {
  children: ReactElement;
  settingName: string;
}
export default function SingleSettingLayout({
  children,
  settingName,
}: SingleSettingLayoutProps) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <Layout style={styles.settingContainer}>
      <Text category={"s2"} style={styles.settingHeader}>
        {settingName}
      </Text>
      <Divider style={styles.divider} />
      {children}
    </Layout>
  );
}

const makeStyles = (theme: ThemeType) =>
  StyleSheet.create({
    divider: {
      backgroundColor: theme["color-basic-400"],
      height: 1,
      alignSelf: "stretch",
      marginVertical: 3,
    },
    settingHeader: {
      color: theme["color-basic-500"],
    },
    settingContainer: {
      marginBottom: 15,
    },
  });
