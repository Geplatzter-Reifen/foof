import {
  Input,
  Layout,
  Text,
  Icon,
  useTheme,
  ThemeType,
} from "@ui-kitten/components";
import { useLocalSearchParams, useNavigation, router } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  deleteStage,
  getStageByStageId,
  setStageTitle,
} from "@/services/data/stageService";
import { getAllLocationsByStageId } from "@/services/data/locationService";
import { Location, Stage } from "@/database/model/model";
import { Alert, StyleSheet, TouchableOpacity, View } from "react-native";
import StageStatCard from "@/components/Stage/StageStatCard";
import StageMapView from "@/components/Stage/StageMapView";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";
import { tourIsFinished } from "@/services/StageConnection/stageConnection";
import { getActiveTour } from "@/services/data/tourService";

export default function StageScreen() {
  // Etappen-ID aus dem Pfad holen
  const { stageId } = useLocalSearchParams<{ stageId: string }>();
  // Lokale Variablen für die Etappe, Etappenlocations und Etappentitel
  const [stage, setStage] = useState<Stage>();
  const [stageLocations, setStageLocations] = useState<Location[]>([]);
  const [stageTitleVal, setStageTitleVal] = useState("Etappe");
  // Wird der Titel gerade bearbeitet?
  const [titleBeingChanged, setTitleBeingChanged] = useState(false);
  // Um den Header anzupassen, wenn der Etappentitel bearbeitet wird
  const navigation = useNavigation();
  // Wird der Löschen-Dialog angezeigt?
  const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);

  const theme = useTheme();
  const styles = makeStyles(theme);

  // Vorbereitung: Etappe, Etappentitel und Locations setzen
  useEffect(() => {
    (async () => {
      const dbStage = await getStageByStageId(stageId);
      if (dbStage) {
        setStage(dbStage);
        setStageTitleVal(stage?.title ?? "Etappe");
      } else {
        router.back();
        Alert.alert("Stage does not exist");
      }
      const dbLocations = await getAllLocationsByStageId(stageId);
      if (dbLocations) {
        setStageLocations(dbLocations);
      }
    })();
  }, [stage, stageId]);

  // Button zum Löschen der Etappe & zurücknavigieren
  const DeleteButton = useCallback(() => {
    const handleConfirm = async () => {
      deleteStage(stageId).then(() => {
        getActiveTour().then(async (tour) => {
          if (tour != null) {
            tourIsFinished(tour).then((result) => {
              if (result) {
                Alert.alert("Tour beendet", "Herzlichen Glückwunsch!");
              }
            });
          }
        });
      });

      setIsDeleteDialogVisible(false);
      navigation.goBack();
    };

    return (
      <View style={styles.deleteButton}>
        <TouchableOpacity
          onPress={() => {
            setIsDeleteDialogVisible(true);
          }}
        >
          <Icon name="trash-can" style={styles.deleteIcon} />
        </TouchableOpacity>

        {/*Öffnet einen Dialog zum Bestätigen*/}
        <ConfirmDialog
          visible={isDeleteDialogVisible}
          title="Etappe löschen"
          message={`Möchtest du die Etappe \"${stage?.title}\" wirklich löschen?`}
          confirmString="Löschen"
          onConfirm={handleConfirm}
          onCancel={() => {
            setIsDeleteDialogVisible(false);
          }}
        />
      </View>
    );
  }, [
    isDeleteDialogVisible,
    navigation,
    stage?.title,
    stageId,
    styles.deleteButton,
    styles.deleteIcon,
  ]);

  // Input-Feld, in dem der Etappentitel eingegeben wird
  const titleInput = useMemo(
    () => (
      <Layout style={styles.headerInput}>
        <Input
          value={stageTitleVal}
          onChangeText={(nextValue) => setStageTitleVal(nextValue)}
          maxLength={20}
        />
      </Layout>
    ),
    [styles.headerInput, stageTitleVal],
  );

  // Edit/Confirm-Button, der den Bearbeitungsmodus (de)aktiviert und den neuen Titel in die DB Schreibt
  const changeTitleButton = useMemo(
    () => (
      <TouchableOpacity
        onPress={async () => {
          setTitleBeingChanged((prevState) => !prevState);
          if (titleBeingChanged && stage) {
            await setStageTitle(stage.id, stageTitleVal);
          }
        }}
      >
        {titleBeingChanged ? (
          <Icon name="check" style={styles.iconStyle} />
        ) : (
          <Icon name="edit" style={styles.iconStyle} />
        )}
      </TouchableOpacity>
    ),
    [styles.iconStyle, stage, stageTitleVal, titleBeingChanged],
  );

  // Header: zwischen Etappentitel und Eingabefeld switchen
  useEffect(() => {
    navigation.setOptions({
      headerTitle: () =>
        titleBeingChanged ? (
          titleInput
        ) : (
          <Text category="h4">{stageTitleVal}</Text>
        ), // Switch between input and title
      headerRight: () => (
        <View style={{ flexDirection: "row" }}>
          {changeTitleButton}
          <DeleteButton />
        </View>
      ), // Set the view on the right
      headerTitleAlign: "center", // Keep the title centered
    });
  }, [
    navigation,
    titleInput,
    changeTitleButton,
    titleBeingChanged,
    stageTitleVal,
    DeleteButton,
  ]);

  return (
    <Layout level="2" style={styles.layout}>
      {/*Kachel mit den Statistiken der Etappe*/}
      {stage && stageLocations.length !== 0 && (
        <StageStatCard stage={stage} locations={stageLocations} />
      )}
      {/*Falls keine / nur eine Location vorhanden ist: Hinweistext*/}
      {stage && stageLocations.length < 2 && (
        <Text style={{ textAlign: "center" }}>
          Diese Etappe ist leer. Bitte lösche sie.
        </Text>
      )}
      {/*Karte, auf der die gefahrene Etappe angezeigt wird*/}
      {stageLocations.length > 1 && (
        <View style={styles.mapContainer}>
          {stage && <StageMapView stage={stage} locations={stageLocations} />}
        </View>
      )}
    </Layout>
  );
}

const makeStyles = (theme: ThemeType) => {
  return StyleSheet.create({
    iconStyle: {
      height: 25,
      width: "auto",
      color: theme["color-primary-500"],
    },
    deleteButton: {
      marginLeft: 13,
    },
    deleteIcon: {
      height: 25,
      width: "auto",
      color: theme["color-basic-400"],
    },
    layout: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    headerInput: {
      justifyContent: "space-around",
      alignItems: "center",
    },
    mapContainer: {
      flex: 1,
      borderRadius: 8,
      overflow: "hidden", // Wichtig für abgerundete Ecken
      marginBottom: 5,
    },
  });
};
