import React, { useState } from "react";
import {
  Card,
  Divider,
  Icon,
  IconElement,
  Input,
  Layout,
  Text,
  ThemeType,
  TopNavigation,
  TopNavigationAction,
  useTheme,
} from "@ui-kitten/components";
import {
  ImageProps,
  StyleSheet,
  Alert,
  View,
  Linking,
  Platform,
  StatusBar,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { updateTourNameById } from "@/services/data/tourService";
import { setTourRoute } from "@/services/data/routeService";
import * as DocumentPicker from "expo-document-picker";
import * as FileSystem from "expo-file-system";
import * as Gjv from "geojson-validation";
import customStyles from "@/constants/styles";
import { ModalWindow } from "@/components/ModalWindow/ModalWindow";

const BackIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon {...props} name="chevron-left" style={[props?.style, { height: 24 }]} />
);
const OkayIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon {...props} name="check" style={[props?.style, { height: 24 }]} />
);

const EditIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon {...props} name="edit" style={[props?.style, { height: 24 }]} />
);

const DeleteIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon {...props} name="trash" style={[props?.style, { height: 24 }]} />
);

const DownloadIcon = (props?: Partial<ImageProps>): IconElement => (
  <Icon {...props} name="download" style={[props?.style, { height: 24 }]} />
);

type TourenParams = {
  tourId: string;
  tourTitle: string;
};

export default function Settings() {
  const params = useLocalSearchParams() as TourenParams;
  const { tourId, tourTitle } = params;
  const [tourname, setTourname] = useState(tourTitle);
  const [titleBeingEdited, setTitleBeingEdited] = useState(false);
  const [selectedFile, setSelectedFile] =
    useState<DocumentPicker.DocumentPickerResult>();
  const [showPopup, setShowPopup] = useState(false);
  const theme = useTheme();
  const styles = makeStyles(theme);

  const handleDeleteGuideroute = () => {
    //Add delete logic here
  };
  const popupModalContent = (
    <Text>
      Möchten Sie die <Text style={styles.accentText}>Standard-Guideline</Text>{" "}
      wirklich löschen?
    </Text>
  );

  const updateTourname = (newTourName: string) => {
    updateTourNameById(tourId, newTourName).then(() => {
      setTourname(newTourName);
      setTitleBeingEdited(false);
    });
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
  const handleLinkPress = () => {
    Linking.openURL(
      "https://maps.openrouteservice.org/#/place/@11.832275390625002,48.622016428468406,7",
    ).catch((err) => console.error("Failed to open URL:", err));
  };
  return (
    <Layout style={styles.container} level="2">
      {/*<View style={styles.headerWrapper}>*/}
      {/*  <TopNavigation*/}
      {/*    style={styles.header}*/}
      {/*    title={() => <Text category={"h4"}>Einstellungen</Text>}*/}
      {/*    accessoryLeft={() => (*/}
      {/*      <TopNavigationAction*/}
      {/*        icon={BackIcon}*/}
      {/*        hitSlop={15}*/}
      {/*        onPress={() => router.back()}*/}
      {/*      />*/}
      {/*    )}*/}
      {/*    alignment={"center"}*/}
      {/*  />*/}
      {/*</View>*/}

      <Layout style={styles.centeringContainer} level="2">
        <Card
          style={{
            ...customStyles.basicCard,
            ...customStyles.basicShadow,
            ...styles.card,
          }}
          disabled={true}
        >
          <Layout style={styles.settingContainer}>
            <Text category={"s2"} style={styles.settingHeader}>
              Tourname
            </Text>
            <Divider style={styles.divider} />
            {titleBeingEdited ? (
              <View style={styles.inlineContainer}>
                <Input
                  style={styles.input}
                  value={tourname}
                  onChangeText={setTourname}
                  onSubmitEditing={(event) =>
                    updateTourname(event.nativeEvent.text)
                  }
                />
                <TopNavigationAction
                  icon={OkayIcon}
                  onPress={() => {
                    updateTourname(tourname);
                  }}
                />
              </View>
            ) : (
              <View style={styles.inlineContainer}>
                <Text category={"h6"}>{tourname}</Text>
                <TopNavigationAction
                  icon={EditIcon}
                  onPress={() => setTitleBeingEdited(true)}
                />
              </View>
            )}
          </Layout>

          {/* Route Guideline Section */}
          <View style={styles.settingContainer}>
            <Text category={"s2"} style={styles.settingHeader}>
              Geplante Route
            </Text>
            <Divider style={styles.divider} />
            <View style={styles.inlineContainer}>
              <Text category={"h6"}>MyRoute.json</Text>
              <View style={styles.iconGroup}>
                <TopNavigationAction
                  icon={DeleteIcon}
                  onPress={() => setShowPopup(true)}
                />
                <TopNavigationAction icon={DownloadIcon} onPress={importTour} />
              </View>
            </View>
            <View>
              <Text style={styles.description}>
                Die geplante Route wird als graue Linie auf der Karte
                dargestellt und kann während dem Fahren zur Navigation benutzt
                werden. Falls du eine eigene Route erstellen möchtest, gehe wie
                folgt vor:
              </Text>
              <Text style={styles.description}>
                {"\u2022"} Besuche{" "}
                <Text
                  style={[
                    styles.accentText,
                    { textDecorationLine: "underline" },
                  ]}
                  onPress={handleLinkPress}
                >
                  openrouteservice.org
                </Text>
                .
              </Text>
              <Text style={styles.description}>
                {"\u2022"} Setze Punkte auf der Karte, um deine Route zu planen.
                Beachte, dass das Planen der Route länger dauern kann, wenn die
                Punkte weiter auseinander liegen.
              </Text>
              <Text style={styles.description}>
                {"\u2022"} Exportiere die Route als Geo-JSON Datei auf dein
                Gerät.
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
          </View>
        </Card>
      </Layout>
      {showPopup && (
        <ModalWindow
          modalContent={popupModalContent}
          buttonCancelText={"BESTÄTIGEN"}
          buttonOkText={"ABBRECHEN"}
          setShowModal={setShowPopup}
          showModal={showPopup}
          onOkPressFunction={handleDeleteGuideroute}
        />
      )}
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
    divider: {
      backgroundColor: theme["color-basic-400"],
      height: 1,
      alignSelf: "stretch",
      marginVertical: 3,
    },
    settingHeader: {
      color: theme["color-basic-500"],
    },
    card: {
      marginTop: 10,
      alignSelf: "flex-start",
      paddingHorizontal: 15,
      marginHorizontal: 10,
    },
    inlineContainer: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginVertical: 10,
    },
    iconGroup: {
      flexDirection: "row",
      gap: 10,
    },
    successMessage: {
      marginTop: 10,
      color: theme["color-primary-600"],
    },
    input: {
      marginTop: 5,
      alignSelf: "stretch",
      width: "80%",
    },
    description: {
      marginTop: 5,
      color: theme["color-basic-500"],
    },
    settingContainer: {
      marginBottom: 15,
    },
    accentText: {
      color: theme["color-primary-600"],
    },
    header: {
      marginTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
    },
  });
