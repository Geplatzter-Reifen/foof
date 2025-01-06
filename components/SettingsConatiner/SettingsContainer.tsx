import React, { ReactElement } from "react";
import { Card, Layout, ThemeType, useTheme } from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import customStyles from "@/constants/styles";
/**
 * SettingsContainer
 *
 * A reusable container component designed to wrap settings content in a white card on the gray background. It applies consistent styling.
 *
 * @param {SettingsContainerProps} props - The props for the component.
 * @param {ReactElement} props.children - The child components to be rendered inside the settings container.
 *
 * @returns {ReactElement}
 *
 */

interface SettingsContainerProps {
  children: ReactElement;
}
export default function SettingsContainer({
  children,
}: SettingsContainerProps) {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <Layout style={styles.container} level="2">
      <Layout style={styles.centeringContainer} level="2">
        <Card
          style={{
            ...customStyles.basicCard,
            ...customStyles.basicShadow,
            ...styles.card,
          }}
          disabled={true}
        >
          {children}
        </Card>
      </Layout>
    </Layout>
  );
}

const makeStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    centeringContainer: {
      flex: 1,
    },
    card: {
      marginTop: 10,
      alignSelf: "flex-start",
      paddingHorizontal: 15,
      marginHorizontal: 10,
    },
    settingContainer: {
      marginBottom: 15,
    },
  });
