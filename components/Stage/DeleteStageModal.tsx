import React from "react";
import { StyleSheet } from "react-native";
import { Text, ThemeType, useTheme } from "@ui-kitten/components";
import { RecordId } from "@nozbe/watermelondb";
import { deleteStage } from "@/services/data/stageService";
import { ModalWindow } from "@/components/ModalWindow/ModalWindow";

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

  const modalText = (
    <Text category={"p1"} style={styles.moduleText}>
      Sind Sie sicher, dass Sie{" "}
      <Text style={styles.highlightedText}>{stageName}</Text> löschen möchten?
      Dieser Vorgang kann{" "}
      <Text style={styles.highlightedText}>nicht rückgängig</Text> gemacht
      werden!
    </Text>
  );

  return (
    <ModalWindow
      modalContent={modalText}
      buttonCancelText={"BESTÄTIGEN"}
      buttonOkText={"ABBRECHEN"}
      setShowModal={setShowDeleteModal}
      showModal={showDeleteModal}
      onOkPressFunction={handleDelete}
    />
  );
};

const makeStyles = (theme: ThemeType): any => {
  return StyleSheet.create({
    highlightedText: {
      color: theme["color-primary-600"],
    },
    moduleText: {
      textAlign: "center",
      fontSize: 16,
      fontWeight: "normal",
    },
  });
};
