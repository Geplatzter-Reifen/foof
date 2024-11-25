import React, { useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { Input, Layout, Button, useTheme } from "@ui-kitten/components";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

interface CoordinateInputProps {
  latitude: string;
  setLatitude: (coord: string) => void;
  longitude: string;
  setLongitude: (coord: string) => void;
  date: Date;
  setDate: (dateInput: Date) => void;
}

function CoordinateInput(props: CoordinateInputProps) {
  const theme = useTheme();
  const { latitude, setLatitude, longitude, setLongitude, date, setDate } =
    props;
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(false);
    setDate(currentDate);
  };

  const onTimeChange = (event: DateTimePickerEvent, selectedTime?: Date) => {
    const currentTime = selectedTime || date;
    setShowTimePicker(false);
    setDate(currentTime);
  };

  return (
    <>
      {/* Latitude and Longitude Inputs */}
      <Layout style={styles.row}>
        <Input
          style={styles.input}
          value={latitude}
          label="Latitude"
          onChangeText={(nextValue) => setLatitude(nextValue.trim())}
          maxLength={20}
        />
        <Input
          style={styles.input}
          value={longitude}
          label="Longitude"
          onChangeText={(nextValue) => setLongitude(nextValue.trim())}
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
            onChange={onDateChange}
            textColor={theme["color-primary-500"]} // Primary color for text
          />
        )}

        {showTimePicker && (
          <DateTimePicker
            value={date}
            mode="time"
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={onTimeChange}
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
