import { StyleSheet } from "react-native";
import { Button, Layout, Text, Modal, Card } from "@ui-kitten/components";
import DateTimeButton from "@/components/Modal/DateTimeButton";
import { useState } from "react";
import customStyles from "@/constants/styles";

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
      visible={modalVisible}
      backdropStyle={styles.backdrop}
      onBackdropPress={onClose}
      style={styles.modal}
    >
      <Card
        disabled={true}
        style={{
          ...customStyles.basicCard,
          ...customStyles.basicShadow,
        }}
      >
        <Text category="h5" style={styles.header}>
          Startzeit
        </Text>
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
        <Text category="h5" style={styles.header}>
          Endzeit
        </Text>
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
          <Button onPress={onClose} style={styles.button}>
            Abbrechen
          </Button>
          <Button onPress={onSave} style={styles.button}>
            Speichern
          </Button>
        </Layout>
      </Card>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    width: "90%",
  },
  header: {
    textAlign: "center",
  },
  row: {
    flexDirection: "row", // Arrange inputs horizontally
    justifyContent: "space-between", // Space them out
    alignItems: "center", // Center items vertically
    marginBottom: 5, // Add spacing between rows
  },
  button: {
    flex: 1, // Make inputs share space equally
    marginHorizontal: 4, // Add space between inputs
    marginTop: 5,
  },
  backdrop: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});

export default DateTimeModal;
