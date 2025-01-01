import React from "react";
import { StyleSheet, View } from "react-native";
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

/**
 * @component DeleteStageModal
 * @description A confirmation modal for deleting a stage, providing options to cancel or confirm.
 *
 * @prop {string} stageName - The name of the stage to be deleted, displayed in the modal text.
 * @prop {RecordId} stageID - The unique identifier of the stage.
 * @prop {boolean} showDeleteModal - Controls the visibility of the modal.
 * @prop {function} setShowDeleteModal - Function to toggle the modal's visibility.
 *
 */

export const DeleteStageModal = ({
  stageName,
  stageID,
  setShowDeleteModal,
  showDeleteModal,
}: DeleteStageModalProps): React.ReactElement => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const handleDelete = () => {
    deleteStage(stageID);
    setShowDeleteModal(false);
  };

  return (
    <Modal
      visible={showDeleteModal}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => setShowDeleteModal(false)}
    >
      <View style={styles.modalContent}>
        {/* Text Card */}
        <Card disabled={true} style={styles.card}>
          <Text category={"p1"} style={styles.moduleText}>
            Sind Sie sicher, dass Sie{" "}
            <Text style={styles.highlightedText}>{stageName}</Text> löschen
            möchten? Dieser Vorgang kann{" "}
            <Text style={styles.highlightedText}>nicht rückgängig</Text> gemacht
            werden!
          </Text>
        </Card>

        {/* Button Group */}
        <View style={styles.buttonGroup}>
          <Button
            onPress={() => setShowDeleteModal(false)}
            status={"basic"}
            style={styles.button}
          >
            ABBRECHEN
          </Button>
          <Button onPress={handleDelete} style={styles.button}>
            LÖSCHEN
          </Button>
        </View>
      </View>
    </Modal>
  );
};

const makeStyles = (theme: ThemeType): any => {
  return StyleSheet.create({
    backdrop: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalContent: {
      width: 320,
      backgroundColor: "transparent",
      alignItems: "center",
    },
    card: {
      width: "100%",
      paddingHorizontal: 5,
      paddingVertical: 5,
      alignItems: "center",
    },
    highlightedText: {
      color: theme["color-primary-600"],
    },
    moduleText: {
      textAlign: "center",
      fontSize: 16,
      fontWeight: "normal",
    },
    buttonGroup: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      width: "100%",
      marginTop: 5,
      marginHorizontal: 2.5,
    },
    button: {
      flex: 1,
      marginHorizontal: 2.5,
    },
  });
};
