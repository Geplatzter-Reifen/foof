import React, { useState } from "react";
import {
  Icon,
  IconElement,
  Text,
  ThemeType,
  TopNavigationAction,
  useTheme,
} from "@ui-kitten/components";
import { ImageProps, StyleSheet, Alert, View, Linking } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { setTourRoute } from "@/services/data/routeService";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Gjv from "geojson-validation";
import SingleSettingLayout from "@/components/Settings/SingleSettingLayout";
import InlineRow from "@/components/Settings/InlineRow";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";

/**
 * RouteGuidelineSettingsSection
 *
 * This component provides a settings section for managing a planned route.
 * Users can view, delete, and import routes while receiving guidance on
 * creating and uploading their own route files.
 *
 * @returns {React.ReactElement}
 *
 *
 */

const DeleteIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon {...props} name="trash-can" style={[props?.style, { height: 24 }]} />
);

const DownloadIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon {...props} name="download" style={[props?.style, { height: 24 }]} />
);

type TourenParams = {
  tourId: string;
  tourTitle: string;
};

export default function RouteGuidelineSettingsSection() {
  const params = useLocalSearchParams() as TourenParams;
  const { tourId } = params;
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerResult>();
  const [showDialog, setShowDialog] = useState(false);
  const theme = useTheme();
  const styles = makeStyles(theme);

  const handleDeleteRoute = () => {
    //TODO: Add delete logic here
  };

  const importTour = async () => {
    const file = await DocumentPicker.getDocumentAsync({
      type: "application/json",
    });
    if (!file.canceled) {
      const content = await FileSystem.readAsStringAsync(file.assets[0].uri);
      if (Gjv.valid(JSON.parse(content))) {
        setSelectedFile(file);
        await setTourRoute(tourId, content);
      } else {
        Alert.alert("Fehler", "Die Datei ist kein gültiges GeoJSON");
      }
    }
  };
  return (
    <SingleSettingLayout settingName={"Geplante Route"}>
      <>
        <InlineRow
          leftComponent={<Text category={"h6"}>MyRoute.json</Text>}
          actions={
            <>
              <TopNavigationAction
                icon={DeleteIcon}
                onPress={() => setShowDialog(true)}
              />
              <TopNavigationAction icon={DownloadIcon} onPress={importTour} />
            </>
          }
        />
        <View>
          <Text style={styles.description}>
            Die geplante Route wird als graue Linie auf der Karte dargestellt
            und kann während dem Fahren zur Navigation benutzt werden. Falls du
            eine eigene Route erstellen möchtest, gehe wie folgt vor:
          </Text>
          <Text style={styles.description}>
            {"\u2022"} Besuche{" "}
            <Text
              style={[styles.accentText, { textDecorationLine: "underline" }]}
              onPress={() => {
                Linking.openURL(
                  "https://maps.openrouteservice.org/#/place/@11.832275390625002,48.622016428468406,7",
                ).catch((err) => console.error("Failed to open URL:", err));
              }}
            >
              {"OpenRouteService"}
            </Text>
            .
          </Text>
          <Text style={styles.description}>
            {"\u2022"} Setze Punkte auf der Karte, um deine Route zu planen.
            Beachte, dass das Planen der Route länger dauern kann, wenn die
            Punkte weiter auseinander liegen.
          </Text>
          <Text style={styles.description}>
            {"\u2022"} Exportiere die Route als Geo-JSON Datei auf dein Gerät.
          </Text>
          <Text style={styles.description}>
            {"\u2022"} Importiere die Datei hier, um sie zu verwenden.
          </Text>
        </View>
        {selectedFile?.assets?.at(0)?.name && (
          <Text style={styles.successMessage}>
            {selectedFile?.assets?.at(0)!.name} {"\n"} wurde erfolgreich
            importiert!
          </Text>
        )}
        <ConfirmDialog
          title="Route löschen"
          message="Möchtest du deine importierte Route wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden."
          confirmString="Löschen"
          cancelString="Abbrechen"
          visible={showDialog}
          onConfirm={handleDeleteRoute}
          onCancel={() => {
            setShowDialog(false);
          }}
        />
      </>
    </SingleSettingLayout>
  );
}

const makeStyles = (theme: ThemeType) =>
  StyleSheet.create({
    successMessage: {
      marginTop: 10,
      color: theme["color-primary-600"],
    },
    description: {
      marginTop: 5,
      color: theme["color-basic-500"],
    },
    accentText: {
      color: theme["color-primary-600"],
    },
  });
