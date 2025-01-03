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

type DeleteStageModalProps = {
  modalContent: React.ReactElement;
  buttonCancelText: string;
  buttonOkText: string;
  setShowModal: (value: React.SetStateAction<boolean>) => void;
  showModal: boolean;
  onOkPressFunction: () => void;
};

/**
 * @component ModalWindow
 * @description A general confirmation modal, providing options to cancel or proceed with some actions by pressing Ok button.
 *
 * @prop {React.ReactElement} modalContent - All content that should be displayed in white modal block
 * @prop {string} buttonCancelText - The text of the button that cancels/hides modal
 * @prop {string} buttonOkText  - The text of the submit button
 * @prop {function} setShowModal - Function to toggle the modal's visibility.
 * @prop {boolean} showModal - Controls the visibility of the modal.
 * @prop {function} onOkPressFunction - Function that is triggered by user by pressing Ok button
 */

export const ModalWindow = ({
  modalContent,
  buttonCancelText,
  buttonOkText,
  setShowModal,
  showModal,
  onOkPressFunction,
}: DeleteStageModalProps): React.ReactElement => {
  const theme = useTheme();
  const styles = makeStyles(theme);

  const handleDelete = () => {
    onOkPressFunction();
    setShowModal(false);
  };

  return (
    <Modal
      visible={showModal}
      backdropStyle={styles.backdrop}
      onBackdropPress={() => setShowModal(false)}
    >
      <View style={styles.modalContent}>
        {/* Text Card */}
        <Card disabled={true} style={styles.card}>
          <Text style={styles.moduleText}>{modalContent}</Text>
        </Card>

        {/* Button Group */}
        <View style={styles.buttonGroup}>
          <Button
            onPress={() => setShowModal(false)}
            status={"basic"}
            style={styles.button}
          >
            {buttonOkText}
          </Button>
          <Button onPress={handleDelete} style={styles.button}>
            {buttonCancelText}
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
