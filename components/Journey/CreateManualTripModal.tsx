import React, { useState } from "react";
import { Button, Card, Input, Modal, Text } from "@ui-kitten/components";
import { createManualTrip } from "@/services/tracking";
import { StyleSheet } from "react-native";

interface CreateManualTripModalProps {
  isVisible: boolean;
  onClose: () => void;
  journeyId: string;
}

export const CreateManualTripModal: React.FC<CreateManualTripModalProps> = ({
  isVisible,
  onClose,
  journeyId,
}) => {
  const [tripName, setTripName] = useState("");
  // const [startCoords, setStartCoords] = useState("");
  // const [endCoords, setEndCoords] = useState("");
  const [errorText, setErrorText] = useState("");

  const reset = () => {
    onClose();
    setTripName("");
    // setStartCoords("");
    // setEndCoords("");
    setErrorText("");
  };

  const onSave = async () => {
    // try {
    //   await createManualTrip(tripName, startCoords, endCoords, journeyId);
    //   reset();
    // } catch (err) {
    //   if (err instanceof Error) {
    //     setErrorText(err.message);
    //   }
    // }
  };

  return (
    <Modal visible={isVisible} backdropStyle={styles.backdrop}>
      <Card disabled={true} style={styles.dialog}>
        <Input
          placeholder="Streckenname"
          value={tripName}
          onChangeText={(tripText) => setTripName(tripText)}
          style={styles.input}
        />
        {/*<Input*/}
        {/*  placeholder="Startkoordinaten"*/}
        {/*  value={startCoords}*/}
        {/*  onChangeText={(coordsText) => setStartCoords(coordsText)}*/}
        {/*  style={styles.input}*/}
        {/*/>*/}
        {/*<Input*/}
        {/*  placeholder="Endkoordinaten"*/}
        {/*  value={endCoords}*/}
        {/*  onChangeText={(coordsText) => setEndCoords(coordsText)}*/}
        {/*  style={styles.input}*/}
        {/*/>*/}
        {errorText && <Text>{errorText}</Text>}
        <Button status="basic" onPress={reset} style={styles.input}>
          Abbrechen
        </Button>
        <Button onPress={onSave}>Speichern</Button>
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
