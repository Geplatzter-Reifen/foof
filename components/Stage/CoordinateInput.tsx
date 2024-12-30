import { StyleSheet } from "react-native";
import { Input, Layout } from "@ui-kitten/components";
import DateTimeButton from "@/components/Modal/DateTimeButton";

type CoordinateInputProps = {
  onLatitudeChange: (latitude: number) => void;
  onLongitudeChange: (longitude: number) => void;
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

  let latitude: string | undefined = undefined;
  if (initialLatitude !== undefined) {
    latitude = initialLatitude.toString();
  }

  let longitude: string | undefined = undefined;
  if (initialLongitude !== undefined) {
    longitude = initialLongitude.toString();
  }

  return (
    <>
      {/* Latitude and Longitude Inputs */}
      <Layout style={styles.row}>
        <Input
          value={latitude}
          style={styles.input}
          label="Latitude"
          onChangeText={(nextValue) =>
            onLatitudeChange(Number(nextValue.trim()))
          }
          maxLength={20}
        />
        <Input
          value={longitude}
          style={styles.input}
          label="Longitude"
          onChangeText={(nextValue) =>
            onLongitudeChange(Number(nextValue.trim()))
          }
          maxLength={20}
        />
      </Layout>

      {/* Datepicker Row */}
      <Layout style={styles.row}>
        {/* Button to open date picker */}
        <DateTimeButton
          date={initialDate || new Date()}
          mode={"date"}
          onDateChange={onDateTimeChange}
        />
        {/* Button to open time picker */}
        <DateTimeButton
          date={initialDate || new Date()}
          mode={"time"}
          onDateChange={onDateTimeChange}
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
