import React from "react";
import { Modal, Card, Text, Button } from "@ui-kitten/components";
import { StyleSheet, View } from "react-native";

interface ConfirmDialogProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  confirmString?: string;
  cancelString?: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  visible,
  onConfirm,
  onCancel,
  title = "Bestätigung",
  message = "Möchtest du wirklich fortfahren?",
  confirmString = "Bestätigen",
  cancelString = "Abbrechen",
}) => {
  return (
    <Modal
      visible={visible}
      backdropStyle={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onBackdropPress={onCancel}
    >
      <Card disabled style={{ marginHorizontal: 25 }}>
        <Text category="h6" style={{ marginBottom: 10 }}>
          {title}
        </Text>
        <Text style={{ marginBottom: 20 }}>{message}</Text>
        <View style={styles.buttonContainer}>
          <Button onPress={onConfirm} style={styles.button} status="danger">
            {confirmString}
          </Button>
          <Button onPress={onCancel} style={styles.button} status="basic">
            {cancelString}
          </Button>
        </View>
      </Card>
    </Modal>
  );
};

export default ConfirmDialog;

const styles = StyleSheet.create({
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  button: {
    flex: 1,
  },
});
