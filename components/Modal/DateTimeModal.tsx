import { Modal, StyleSheet, View } from "react-native";
import { Button, Layout, Text } from "@ui-kitten/components";
import DateTimeButton from "@/components/Modal/DateTimeButton";
import { useState } from "react";

type DateTimeModalProps = {
  modalVisible: boolean;
  onClose: () => void;
  onSave: () => void;
  onStartDateChange: (startDate: Date) => void;
  onEndDateChange: (endDate: Date) => void;
  initialStartDate?: Date;
  initialEndDate?: Date;
};

function DateTimeModal(props: DateTimeModalProps) {
  const {
    modalVisible,
    onClose,
    onSave,
    onStartDateChange,
    onEndDateChange,
    initialStartDate,
    initialEndDate,
  } = props;

  const [startDate, setStartDate] = useState(initialStartDate || new Date());
  const [endDate, setEndDate] = useState(initialEndDate || new Date());

  const handleStartDateChange = (date: Date) => {
    onStartDateChange(date);
    setStartDate(date);
  };

  const handleEndDateChange = (date: Date) => {
    onEndDateChange(date);
    setEndDate(date);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      statusBarTranslucent={true}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text category="h5">Startzeit</Text>
          <Layout style={styles.row}>
            <DateTimeButton
              date={startDate}
              mode={"date"}
              onDateChange={handleStartDateChange}
            />
            <DateTimeButton
              date={startDate}
              mode={"time"}
              onDateChange={handleStartDateChange}
            />
          </Layout>
          <Text category="h5">Endzeit</Text>
          <Layout style={styles.row}>
            <DateTimeButton
              date={endDate}
              mode={"date"}
              onDateChange={handleEndDateChange}
            />
            <DateTimeButton
              date={endDate}
              mode={"time"}
              onDateChange={handleEndDateChange}
            />
          </Layout>
          <Layout style={styles.row}>
            <Button style={styles.button} onPress={onClose}>
              Abbrechen
            </Button>
            <Button style={styles.button} onPress={onSave}>
              Speichern
            </Button>
          </Layout>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  row: {
    flexDirection: "row", // Arrange inputs horizontally
    justifyContent: "space-between", // Space them out
    alignItems: "center", // Center items vertically
    marginBottom: 5, // Add spacing between rows
  },
  button: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    margin: 5,
    alignSelf: "center",
  },
});

export default DateTimeModal;
