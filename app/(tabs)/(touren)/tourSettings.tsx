import {
  Card,
  Divider,
  Layout,
  Text,
  ThemeType,
  TopNavigation,
  useTheme,
} from "@ui-kitten/components";
import { StyleSheet } from "react-native";
import React from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import renderBackAction from "@/components/Navigation/renderBackAction";
import customStyles from "@/constants/styles";
import TourNameSettingsSection from "@/components/Settings/TourNameSettingsSection";
import RouteSettingsSection from "@/components/Settings/RouteSettingsSection";

export default function TourSettings() {
  const insets = useSafeAreaInsets();

  const theme = useTheme();
  const styles = makeStyles(theme);

  return (
    <Layout testID="layout" style={styles.container}>
      <TopNavigation
        title={() => <Text category={"h4"}>Touren</Text>}
        accessoryLeft={renderBackAction}
        alignment={"center"}
        style={{ marginTop: insets.top }}
      ></TopNavigation>
      <Divider />
      <Layout style={styles.container} testID="layout" level="2">
        <Layout style={styles.centeringContainer} testID="layout" level="2">
          <Card
            testID="card"
            style={{
              ...customStyles.basicCard,
              ...customStyles.basicShadow,
              ...styles.card,
            }}
            disabled={true}
          >
            <TourNameSettingsSection />
            <RouteSettingsSection />
          </Card>
        </Layout>
      </Layout>
    </Layout>
  );
}

const makeStyles = (theme: ThemeType) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    headerWrapper: {
      backgroundColor: theme["color-basic-100"], // Set explicit background color
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 8, // For Android
      zIndex: 1, // Ensure it stays above other elements
      padding: 2,
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
