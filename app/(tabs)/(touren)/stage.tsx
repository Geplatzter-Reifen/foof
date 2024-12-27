import {
  Input,
  Layout,
  Text,
  Icon,
  useTheme,
  ThemeType,
} from "@ui-kitten/components";
import { useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  deleteStage,
  getStageByStageId,
  setStageTitle,
} from "@/services/data/stageService";
import { Stage } from "@/database/model/model";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import StageStatCard from "@/components/Stage/StageStatCard";
import ConfirmDialog from "@/components/Dialog/ConfirmDialog";

export default function HomeScreen() {
  const { stageId } = useLocalSearchParams<{ stageId: string }>();
  const [stage, setStage] = useState<Stage>();
  // changing the title of the page
  const navigation = useNavigation();
  //switches title from plain text to the input field
  const [titleBeingChanged, setTitleBeingChanged] = useState(false);
  const [stageTitleVal, setStageTitleVal] = useState("Etappe"); ///the name of the title
  const theme = useTheme();
  const styles = makeStyles(theme);

  useEffect(() => {
    (async () => {
      const dbstage = await getStageByStageId(stageId);
      if (stageId) {
        setStage(dbstage);
        setStageTitleVal(stage?.title ?? "Etappe");
      } else {
        throw new Error("Stage does not exist");
      }
    })();
  }, [stage, stageId]);

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

  //switching between done and edit, saving new title to DB
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

  const DeleteButton = () => {
    const [isDialogVisible, setIsDialogVisible] = useState(false);

    const handleConfirm = () => {
      deleteStage(stageId);
      setIsDialogVisible(false);
      navigation.goBack();
    };

    return (
      <View style={styles.deleteButton}>
        <TouchableOpacity onPress={() => setIsDialogVisible(true)}>
          <Icon name="trash-can" style={styles.deleteIcon} />
        </TouchableOpacity>

        <ConfirmDialog
          visible={isDialogVisible}
          title="Etappe löschen"
          message={`Möchtest du die Etappe \"${stage?.title}\" wirklich löschen?`}
          confirmString="Löschen"
          onConfirm={handleConfirm}
          onCancel={() => setIsDialogVisible(false)}
        />
      </View>
    );
  };

  // Update header input ot text based on if title or edit state changes
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
  ]);

  return (
    <Layout level="2" style={styles.layout}>
      {stage && <StageStatCard stage={stage} />}
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
      color: theme["color-basic-500"],
    },
    cardsContainer: {
      flex: 7, // Takes up the majority of the remaining space
      flexDirection: "column", // Arrange cards in a column
    },
    layout: {
      flex: 1,
      paddingVertical: 10,
      paddingHorizontal: 10,
    },
    card: { flex: 1 },
    button: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      margin: 5,
      alignSelf: "center",
    },
    headerInput: {
      justifyContent: "space-around",
      alignItems: "center",
    },
  });
};
