import {
  ImageProps,
  Platform,
  StatusBar,
  StyleSheet,
  View,
} from "react-native";
import * as DocumentPicker from "expo-document-picker";
import {
  Divider,
  Icon,
  IconElement,
  Text,
  ThemeType,
  TopNavigationAction,
  useTheme,
} from "@ui-kitten/components";

const RouteGuidelineSection = ({
  importTour,
  handleLinkPress,
  selectedFile,
  onDeletePress,
}: {
  importTour: () => void;
  handleLinkPress: () => void;
  selectedFile?: DocumentPicker.DocumentPickerResult;
  onDeletePress: () => void;
}) => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const DeleteIcon = (props?: Partial<ImageProps>): IconElement => (
    <Icon {...props} name="trash" style={[props?.style, { height: 24 }]} />
  );

  const DownloadIcon = (props?: Partial<ImageProps>): IconElement => (
    <Icon {...props} name="download" style={[props?.style, { height: 24 }]} />
  );
  return (
    <View style={styles.settingContainer}>
      <Text category={"s2"} style={styles.settingHeader}>
        Geplante Route
      </Text>
      <Divider style={styles.divider} />
      <View style={styles.inlineContainer}>
        <Text category={"h6"}>MyRoute.json</Text>
        <View style={styles.iconGroup}>
          <TopNavigationAction icon={DeleteIcon} onPress={onDeletePress} />
          <TopNavigationAction icon={DownloadIcon} onPress={importTour} />
        </View>
      </View>
      <View>
        <Text style={styles.description}>
          Die geplante Route wird als graue Linie auf der Karte dargestellt und
          kann während dem Fahren zur Navigation benutzt werden. Falls du eine
          eigene Route erstellen möchtest, gehe wie folgt vor:
        </Text>
        <Text style={styles.description}>
          {"\u2022"} Besuche{" "}
          <Text
            style={[styles.accentText, { textDecorationLine: "underline" }]}
            onPress={handleLinkPress}
          >
            openrouteservice.org
          </Text>
          .
        </Text>
        <Text style={styles.description}>
          {"\u2022"} Setze Punkte auf der Karte, um deine Route zu planen.
          Beachte, dass das Planen der Route länger dauern kann, wenn die Punkte
          weiter auseinander liegen.
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
    </View>
  );
};

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
