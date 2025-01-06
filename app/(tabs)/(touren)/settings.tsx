import React from "react";
import { Card, Layout, ThemeType, useTheme } from "@ui-kitten/components";
import { StyleSheet } from "react-native";

import RouteGuidelineSettingsSection from "@/components/RouteGuidelineSettingsSection/RouteGuidelineSettingsSection";
import TourNameSettingsSection from "@/components/TourNameSettingsSection/TourNameSettingsSection";
import customStyles from "@/constants/styles";

export default function Settings() {
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
          <TourNameSettingsSection />
          <RouteGuidelineSettingsSection />
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
  });
