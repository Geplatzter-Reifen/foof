import React from "react";
import {
  Card,
  Icon,
  IconElement,
  Layout,
  ThemeType,
  TopNavigation,
  TopNavigationAction,
  useTheme,
  Text,
} from "@ui-kitten/components";
import {
  ImageProps,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";

import RouteGuidelineSettingsSection from "@/components/RouteGuidelineSettingsSection/RouteGuidelineSettingsSection";
import TourNameSettingsSection from "@/components/TourNameSettingsSection/TourNameSettingsSection";
import customStyles from "@/constants/styles";
import { router } from "expo-router";

export default function Settings() {
  const BackIcon = (props?: Partial<ImageProps>): IconElement => (
    <Icon
      {...props}
      name="chevron-left"
      style={[props?.style, { height: 24 }]}
    />
  );
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <>
      <View style={styles.headerWrapper}>
        <TopNavigation
          style={styles.header}
          title={() => <Text category={"h4"}>Einstellungen</Text>}
          accessoryLeft={() => (
            <TopNavigationAction
              icon={BackIcon}
              hitSlop={15}
              onPress={() => router.back()}
            />
          )}
          alignment={"center"}
        />
      </View>
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
    </>
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
    header: {
      marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
  });
