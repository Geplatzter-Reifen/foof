import React from "react";
import { render, fireEvent } from "@/test-utils/test-utils";
import CoordinateInput from "@/components/Stage/CoordinateInput";

describe("CoordinateInput", () => {
  const mockOnLatitudeChange = jest.fn();
  const mockOnLongitudeChange = jest.fn();
  const mockOnDateTimeChange = jest.fn();

  const date = new Date(2024, 0, 1, 14, 0, 0);

  const initialProps = {
    onLatitudeChange: mockOnLatitudeChange,
    onLongitudeChange: mockOnLongitudeChange,
    onDateTimeChange: mockOnDateTimeChange,
    initialLatitude: 52.52,
    initialLongitude: 13.405,
    initialDate: date,
  };

  it("renders correctly with initial values", () => {
    const { getByDisplayValue, getByText } = render(
      <CoordinateInput {...initialProps} />,
    );

    expect(getByText("Latitude")).toBeTruthy();
    expect(getByDisplayValue("52.52")).toBeTruthy();
    expect(getByText("Longitude")).toBeTruthy();
    expect(getByDisplayValue("13.405")).toBeTruthy();
    expect(getByText(new Date(2024, 0, 1).toLocaleDateString())).toBeTruthy();
    expect(getByText(date.toLocaleTimeString())).toBeTruthy();
  });

  it("calls onLatitudeChange when latitude input changes", () => {
    const { getByDisplayValue } = render(<CoordinateInput {...initialProps} />);
    const latitudeInput = getByDisplayValue("52.52");

    fireEvent.changeText(latitudeInput, "48.8566");

    expect(mockOnLatitudeChange).toHaveBeenCalledWith(48.8566);
  });

  it("calls onLongitudeChange when longitude input changes", () => {
    const { getByDisplayValue } = render(<CoordinateInput {...initialProps} />);
    const longitudeInput = getByDisplayValue("13.405");

    fireEvent.changeText(longitudeInput, "2.3522");

    expect(mockOnLongitudeChange).toHaveBeenCalledWith(2.3522);
  });

  it("calls onDateTimeChange when date or time changes", () => {
    const { getByTestId, getByText } = render(
      <CoordinateInput {...initialProps} />,
    );

    let newDate = new Date(2024, 0, 2);
    const dateButton = getByText(date.toLocaleDateString());
    // Simulate date change
    fireEvent.press(dateButton);
    let datePicker = getByTestId("dateTimePicker");
    fireEvent(datePicker, "onChange", {
      nativeEvent: { timestamp: newDate.getTime() },
    });

    expect(mockOnDateTimeChange).toHaveBeenCalledWith(newDate);

    newDate = new Date(2024, 0, 1, 15, 0, 0);
    const timeButton = getByText(date.toLocaleTimeString());
    // Simulate time change
    fireEvent.press(timeButton);
    datePicker = getByTestId("dateTimePicker");
    fireEvent(datePicker, "onChange", {
      nativeEvent: { timestamp: newDate.getTime() },
    });

    expect(mockOnDateTimeChange).toHaveBeenCalledWith(newDate);
  });
});
