import React, { useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { Input, Layout, Button, useTheme } from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

type CoordinateInputProps = {
  onLatitudeChange: (latitude: string) => void;
  onLongitudeChange: (longitude: string) => void;
  onDateChange: (date: Date) => void;
};

function CoordinateInput(props: CoordinateInputProps) {
  const theme = useTheme();
  const { onLatitudeChange, onLongitudeChange, onDateChange } = props;

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [date, setDate] = useState(new Date());

  const handleDateChange = (
    event: DateTimePickerEvent,
    selectedDate?: Date,
  ) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    onDateChange(currentDate);
    setDate(currentDate);
  };

  const handleTimeChange = (
    event: DateTimePickerEvent,
    selectedTime?: Date,
  ) => {
    const currentTime = selectedTime || date;
    setShowTimePicker(false);
    onDateChange(currentTime);
    setDate(currentTime);
  };

  return (
    <>
      {/* Latitude and Longitude Inputs */}
      <Layout style={styles.row}>
        <Input
          style={styles.input}
          label="Latitude"
          onChangeText={(nextValue) => onLatitudeChange(nextValue.trim())}
          maxLength={20}
        />
        <Input
          style={styles.input}
          label="Longitude"
          onChangeText={(nextValue) => onLongitudeChange(nextValue.trim())}
          maxLength={20}
        />
      </Layout>

      {/* Datepicker Row */}
      <Layout style={styles.row}>
        {/* Button to open date picker */}
        <Button
          appearance="outline"
          style={styles.input}
          onPress={() => setShowDatePicker(true)}
          accessoryRight={
            <FontAwesomeIcon
              style={styles.icon}
              size={20}
              color={theme["color-primary-500"]}
              icon="calendar"
            />
          }
        >
          {date.toLocaleDateString()}
        </Button>

        {/* Button to open time picker */}
        <Button
          appearance="outline"
          style={styles.input}
          onPress={() => setShowTimePicker(true)}
          accessoryRight={
            <FontAwesomeIcon
              style={styles.icon}
              size={20}
              color={theme["color-primary-500"]}
              icon="clock"
            />
          }
        >
          {date.toLocaleTimeString()}
        </Button>

        {showDatePicker && (
          <DateTimePicker
            value={date}
            mode="date"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleDateChange}
            textColor={theme["color-primary-500"]} // Primary color for text
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
            textColor={theme["color-primary-500"]} // Primary color for text
          />
        )}
      </Layout>
    </>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row", // Arrange inputs horizontally
    justifyContent: "space-between", // Space them out
    alignItems: "center", // Center items vertically
    marginBottom: 5, // Add spacing between rows
  },
  input: {
    flex: 1, // Make inputs share space equally
    marginHorizontal: 8, // Add space between inputs
    marginVertical: 3,
    backgroundColor: "transparent",
  },
  icon: {
    alignSelf: "flex-end",
  },
});

export default CoordinateInput;
