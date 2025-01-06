import React from "react";
import {
  Modal,
  Card,
  Text,
  Button,
  ThemeType,
  useTheme,
} from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";

type ConfirmDialogProps = {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmString?: string;
  cancelString?: string;
};

/**
 * @component ConfirmDialog
 * @description A flexible and styled confirmation modal, combining customizable props and well-structured layout.
 *
 * @prop {boolean} visible - Controls the visibility of the modal.
 * @prop {function} onConfirm - Function triggered when the confirm button is pressed.
 * @prop {function} onCancel - Function triggered when the cancel button is pressed.
 * @prop {string} title - Title displayed at the top of the modal.
 * @prop {string} message - Message displayed in the modal body.
 * @prop {string} confirmString - Text for the confirm button.
 * @prop {string} cancelString - Text for the cancel button.
 */

const ConfirmDialog = ({
  visible,
  onConfirm,
  onCancel,
  title = "Bestätigung",
  message = "Möchtest du wirklich fortfahren?",
  confirmString = "Bestätigen",
  cancelString = "Abbrechen",
}: ConfirmDialogProps): React.ReactElement => {
  const theme = useTheme();
  const styles = makeStyles(theme);
  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal
      visible={visible}
      backdropStyle={styles.backdrop}
      onBackdropPress={handleCancel}
      animationType="fade"
    >
      <Card disabled style={styles.card}>
        {title && (
          <Text category="h6" style={styles.title}>
            {title}
          </Text>
        )}
        {message && <Text style={styles.message}>{message}</Text>}
        <View style={styles.buttonGroup}>
          <Button onPress={handleCancel} status="basic" style={styles.button}>
            {cancelString}
          </Button>
          <Button
            onPress={handleConfirm}
            status="danger"
            style={[styles.button, styles.confirmButton]}
          >
            {confirmString}
          </Button>
        </View>
      </Card>
    </Modal>
  );
};

export default ConfirmDialog;
const makeStyles = (theme: ThemeType) => {
  return StyleSheet.create({
    backdrop: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    card: {
      marginHorizontal: 25,
      alignItems: "center",
      paddingVertical: 15,
    },
    title: {
      marginBottom: 10,
      textAlign: "center",
    },
    message: {
      marginBottom: 20,
      textAlign: "center",
    },
    buttonGroup: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      gap: 10,
    },
    button: {
      flex: 1,
    },
    confirmButton: {
      backgroundColor: theme["color-primary-500"],
    },
  });
};
