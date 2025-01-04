import { StyleSheet } from "react-native";
import { Input, Layout } from "@ui-kitten/components";
import DateTimeButton from "@/components/Modal/DateTimeButton";
import { useState } from "react";
import { toStr } from "@/utils/utils";

type CoordinateInputProps = {
  onLatitudeChange: (latitude: number | undefined) => void;
  onLongitudeChange: (longitude: number | undefined) => void;
  onDateTimeChange: (date: Date) => void;
  initialLatitude?: number;
  initialLongitude?: number;
  initialDate?: Date;
};

function CoordinateInput(props: CoordinateInputProps) {
  const {
    onLatitudeChange,
    onLongitudeChange,
    onDateTimeChange,
    initialLatitude,
    initialLongitude,
    initialDate,
  } = props;

  const [date, setDate] = useState(initialDate || new Date());
  const [latitude, setLatitude] = useState<string | undefined>(
    toStr(initialLatitude),
  );
  const [longitude, setLongitude] = useState<string | undefined>(
    toStr(initialLongitude),
  );

  const handleDateChange = (nextDate: Date) => {
    setDate(nextDate);
    onDateTimeChange(nextDate);
  };

  return (
    <>
      {/* Latitude and Longitude Inputs */}
      <Layout style={styles.row}>
        <Input
          value={latitude}
          editable={true}
          style={styles.input}
          label="Latitude"
          onChangeText={(nextValue) => {
            if (!isNaN(Number(nextValue))) {
              setLatitude(nextValue.trim());
              if (nextValue.trim() !== "") {
                onLatitudeChange(Number(nextValue.trim()));
              } else {
                onLatitudeChange(undefined);
              }
            }
          }}
          maxLength={20}
          keyboardType={"numeric"}
        />
        <Input
          value={longitude}
          style={styles.input}
          label="Longitude"
          onChangeText={(nextValue) => {
            if (!isNaN(Number(nextValue))) {
              setLongitude(nextValue.trim());
              if (nextValue.trim() !== "") {
                onLongitudeChange(Number(nextValue.trim()));
              } else {
                onLongitudeChange(undefined);
              }
            }
          }}
          maxLength={20}
          keyboardType={"numeric"}
        />
      </Layout>

      {/* Datepicker Row */}
      <Layout style={styles.row}>
        {/* Button to open date picker */}
        <DateTimeButton
          date={date}
          mode={"date"}
          onDateChange={handleDateChange}
        />
        {/* Button to open time picker */}
        <DateTimeButton
          date={date}
          mode={"time"}
          onDateChange={handleDateChange}
        />
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
});

export default CoordinateInput;
