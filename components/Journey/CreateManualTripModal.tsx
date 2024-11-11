import React, { useState } from "react";
import { Button, Card, Input, Modal } from "@ui-kitten/components";
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
  //const [modalVisible, setModalVisible] = useState(false);
  const [tripName, setTripName] = useState("");
  const [startCoords, setStartCoords] = useState("");
  const [endCoords, setEndCoords] = useState("");

  return (
    <Modal visible={isVisible} backdropStyle={styles.backdrop}>
      <Card disabled={true}>
        <Input
          placeholder="Streckenname"
          value={tripName}
          onChangeText={(tripText) => setTripName(tripText)}
        />
        <Input
          placeholder="Startkoordinaten"
          value={startCoords}
          onChangeText={(coordsText) => setStartCoords(coordsText)}
        />
        <Input
          placeholder="Endkoordinaten"
          value={endCoords}
          onChangeText={(coordsText) => setEndCoords(coordsText)}
        />
        <Button
          status="basic"
          onPress={() => {
            onClose();
            setTripName("");
            setStartCoords("");
            setEndCoords("");
          }}
        >
          Abbrechen
        </Button>
        <Button
          onPress={async () => {
            await createManualTrip(tripName, startCoords, endCoords, journeyId);
            onClose();
            setTripName("");
          }}
        >
          Speichern
        </Button>
      </Card>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.5)",
  },
});
