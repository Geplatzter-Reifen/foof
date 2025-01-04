import React, { useState } from "react";
import { Platform, StyleSheet } from "react-native";
import { Button, useTheme } from "@ui-kitten/components";
import DateTimePicker, {
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";
import { FontAwesomeIcon } from "@fortawesome/react-native-fontawesome";
import { DateFormat, formatDate } from "@/utils/dateUtil";

type DateTimeButtonProps = {
  date: Date;
  mode: "date" | "time";
  onDateChange: (date: Date) => void;
};

const DateTimeButton = ({ date, mode, onDateChange }: DateTimeButtonProps) => {
  const [showPicker, setShowPicker] = useState(false);
  const theme = useTheme();

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || date;
    setShowPicker(false);
    onDateChange(currentDate);
  };

  return (
    <>
      <Button
        appearance="outline"
        style={styles.input}
        onPress={() => setShowPicker(true)}
        accessoryRight={
          <FontAwesomeIcon
            size={20}
            color={theme["color-primary-500"]}
            icon={mode === "date" ? "calendar" : "clock"}
          />
        }
      >
        {mode === "date"
          ? formatDate(date, DateFormat.DATE)
          : formatDate(date, DateFormat.TIME)}
      </Button>

      {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={date}
          mode={mode}
          display={Platform.OS === "ios" ? "spinner" : "default"}
          onChange={handleChange}
          textColor={theme["color-primary-500"]}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1, // Make inputs share space equally
    marginHorizontal: 8, // Add space between inputs
    marginVertical: 3,
    backgroundColor: "transparent",
  },
});

export default DateTimeButton;
