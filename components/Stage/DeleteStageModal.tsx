import React from "react";
import { StyleSheet } from "react-native";
import {
  Button,
  Card,
  Modal,
  Text,
  ThemeType,
  useTheme,
} from "@ui-kitten/components";
import { RecordId } from "@nozbe/watermelondb";
import { deleteStage } from "@/services/data/stageService";

type DeleteStageModalProps = {
  stageName: string;
  stageID: RecordId;
  setShowDeleteModal: (value: React.SetStateAction<boolean>) => void;
  showDeleteModal: boolean;
};
export const DeleteStageModal = ({
  stageName,
  stageID,
  setShowDeleteModal,
  showDeleteModal,
}: DeleteStageModalProps): React.ReactElement => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  return (
    <Modal
      visible={showDeleteModal}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => setShowDeleteModal(false)}
    >
      <Card disabled={true}>
        <Text>
          Sind Sie sicher, dass Sie {stageName} löschen möchten? Dieser Vorgang
          kann nicht rückgängig gemacht werden.
        </Text>
        <Button onPress={() => setShowDeleteModal(false)}>ABBRECHEN</Button>
        <Button onPress={() => deleteStage(stageID)}>ERSTELLEN</Button>
      </Card>
    </Modal>
  );
};

const makeStyles = (theme: ThemeType): any => {
  return StyleSheet.create({
    container: {
      minHeight: 192,
    },
    backdrop: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    highlightedText: {
      backgroundColor: theme["background-basic-color-2"],
    },
  });
};
