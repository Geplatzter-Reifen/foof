import {
  Button,
  Card,
  Divider,
  Input,
  Layout,
  Text,
  ThemeType,
  TopNavigation,
  useTheme,
} from "@ui-kitten/components";
import { StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { updateTourNameById } from "@/services/data/tourService";
import { setTourRoute } from "@/services/data/routeService";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Gjv from "geojson-validation";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import renderBackAction from "@/components/TopNavigation/renderBackAction";
import customStyles from "@/constants/styles";
import TourNameSettingsSection from "@/components/Settings/TourNameSettingsSection";
import RouteGuidelineSettingsSection from "@/components/Settings/RouteGuidelineSettingsSection";

type TourenParams = {
  tourId: string;
  tourTitle: string;
};

export default function TourSettings() {
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams() as TourenParams;
  const { tourId, tourTitle } = params;
  const [tourname, setTourname] = useState(tourTitle);
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerResult>();

  const theme = useTheme();
  const styles = makeStyles(theme);

  const updateTourname = (newTourName: string) => {
    updateTourNameById(tourId, newTourName).then(() => {
      setTourname(newTourName);
    });
  };

  const importRouteForTour = async () => {
    const file = await DocumentPicker.getDocumentAsync({
      type: "application/json",
    });
    if (!file.canceled) {
      const content = await FileSystem.readAsStringAsync(file.assets[0].uri);
      try {
        if (Gjv.valid(JSON.parse(content))) {
          setSelectedFile(file);
          await setTourRoute(tourId, content);
        } else {
          Alert.alert("Fehler", "Die Datei ist kein gültiges GeoJSON");
        }
      } catch {
        Alert.alert("Fehler", "Die Datei ist kein gültiges GeoJSON");
      }
    }
  };

  return (
    <Layout style={styles.container}>
      <TopNavigation
        title={() => <Text category={"h4"}>Touren</Text>}
        accessoryLeft={renderBackAction}
        alignment={"center"}
        style={{ marginTop: insets.top }}
      ></TopNavigation>
      <Divider />
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
