import React, { useState } from "react";
import { Button, Card, Input, Modal, Text } from "@ui-kitten/components";
import { createManualStage } from "@/services/tracking";
import { StyleSheet } from "react-native";

interface CreateManualStageModalProps {
  isVisible: boolean;
  onClose: () => void;
  tourId: string;
}

export const CreateManualStageModal: React.FC<CreateManualStageModalProps> = ({
  isVisible,
  onClose,
  tourId,
}) => {
  const [stageName, setStageName] = useState("");
  const [startCoords, setStartCoords] = useState("");
  const [endCoords, setEndCoords] = useState("");
  const [errorText, setErrorText] = useState("");

  const reset = () => {
    onClose();
    setStageName("");
    setStartCoords("");
    setEndCoords("");
    setErrorText("");
  };

  const onSave = async () => {
    try {
      await createManualStage(stageName, startCoords, endCoords, tourId);
      reset();
    } catch (err) {
      if (err instanceof Error) {
        setErrorText(err.message);
      }
    }
  };

  return (
    <Modal visible={isVisible} backdropStyle={styles.backdrop}>
      <Card disabled={true} style={styles.dialog}>
        <Input
          placeholder="Tourname"
          value={stageName}
          onChangeText={(stageText) => setStageName(stageText)}
          style={styles.input}
        />
        <Input
          placeholder="Startkoordinaten"
          value={startCoords}
          onChangeText={(coordsText) => setStartCoords(coordsText)}
          style={styles.input}
        />
        <Input
          placeholder="Endkoordinaten"
          value={endCoords}
          onChangeText={(coordsText) => setEndCoords(coordsText)}
          style={styles.input}
        />
        {errorText && <Text>{errorText}</Text>}
        <Button onPress={onSave}>Speichern</Button>
        <Button status="basic" onPress={reset} style={styles.input}>
          Abbrechen
        </Button>
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    width: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  dialog: {
    padding: 0,
    width: 360,
  },
  input: {
    marginBottom: 5,
  },
});
