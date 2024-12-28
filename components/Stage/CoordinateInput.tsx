import { StyleSheet } from "react-native";
import { Input, Layout } from "@ui-kitten/components";
import DateTimeButton from "@/components/Modal/DateTimeButton";

type CoordinateInputProps = {
  onLatitudeChange: (latitude: string) => void;
  onLongitudeChange: (longitude: string) => void;
  onDateChange: (date: Date) => void;
};

function CoordinateInput(props: CoordinateInputProps) {
  const { onLatitudeChange, onLongitudeChange, onDateChange } = props;

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
        <DateTimeButton
          date={new Date()}
          mode={"date"}
          onDateChange={onDateChange}
        />
        {/* Button to open time picker */}
        <DateTimeButton
          date={new Date()}
          mode={"time"}
          onDateChange={onDateChange}
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
