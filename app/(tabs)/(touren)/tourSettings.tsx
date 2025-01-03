import {
  Button,
  Divider,
  Icon,
  IconElement,
  Input,
  Layout,
  Text,
  TopNavigation,
  TopNavigationAction,
} from "@ui-kitten/components";
import { ImageProps, StyleSheet, Alert } from "react-native";
import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { updateTourNameById } from "@/services/data/tourService";
import { setTourRoute } from "@/services/data/routeService";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Gjv from "geojson-validation";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const BackIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon {...props} name="chevron-left" style={[props?.style, { height: 24 }]} />
);

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

  const updateTourname = (newTourName: string) => {
    updateTourNameById(tourId, newTourName).then(() => {
      setTourname(newTourName);
    });
  };

  const renderBackAction = (): React.ReactElement => (
    <TopNavigationAction
      icon={BackIcon}
      hitSlop={15}
      onPress={() => router.back()}
    />
  );

  const importRouteForTour = async () => {
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
    <Layout style={styles.container}>
      <TopNavigation
        title={() => <Text category={"h4"}>Touren</Text>}
        accessoryLeft={renderBackAction}
        alignment={"center"}
        style={{ marginTop: insets.top }}
      ></TopNavigation>
      <Divider />
      <Layout style={styles.body}>
        <Text category={"h4"}>Tourname ändern</Text>
        <Text>Aktueller Tourname: {tourname}</Text>
        <Input
          placeholder={"Neuer Tourname"}
          onSubmitEditing={(event) => updateTourname(event.nativeEvent.text)}
        ></Input>
        <Text>Die Route kann nur als GeoJSON importiert werden.</Text>
        <Button onPress={importRouteForTour}>Route importieren</Button>
        {selectedFile?.assets?.at(0)?.name && (
          <Text>
            {selectedFile?.assets?.at(0)!.name} {"\n"} wurde erfolgreich
            importiert!
          </Text>
        )}
      </Layout>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  body: {
    margin: 15,
    alignItems: "center",
  },
});
