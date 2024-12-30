import React from "react";
import { render, fireEvent } from "@/test-utils/test-utils";
import DateTimeButton from "@/components/Modal/DateTimeButton";

describe("DateTimeButton Component", () => {
  const mockOnDateChange = jest.fn();

  const date = new Date(2024, 0, 1, 12, 0, 0);

  const defaultProps = {
    date: date,
    mode: "date" as "date" | "time",
    onDateChange: mockOnDateChange,
  };

  it("renders correctly with initial date", () => {
    const { getByText } = render(<DateTimeButton {...defaultProps} />);
    expect(getByText(date.toLocaleDateString())).toBeTruthy();
  });

  it("renders correctly with initial time", () => {
    const props = { ...defaultProps, mode: "time" as "date" | "time" };
    const { getByText } = render(<DateTimeButton {...props} />);
    expect(getByText(date.toLocaleTimeString())).toBeTruthy();
  });

  it("opens date picker on button press", () => {
    const { getByText, getByTestId } = render(
      <DateTimeButton {...defaultProps} />,
    );
    fireEvent.press(getByText(date.toLocaleDateString()));
    expect(getByTestId("dateTimePicker")).toBeTruthy();
  });

  it("calls onDateChange with new date", () => {
    const newDate = new Date(2024, 0, 2);
    const { getByText, getByTestId } = render(
      <DateTimeButton {...defaultProps} />,
    );
    fireEvent.press(getByText(date.toLocaleDateString()));
    fireEvent(getByTestId("dateTimePicker"), "onChange", {
      nativeEvent: { timestamp: newDate.getTime() },
    });
    expect(mockOnDateChange).toHaveBeenCalledWith(newDate);
  });

  it("calls onDateChange with new time", () => {
    const newDate = new Date(2024, 0, 1, 13, 0, 0);
    const props = { ...defaultProps, mode: "time" as "date" | "time" };
    const { getByText, getByTestId } = render(<DateTimeButton {...props} />);
    fireEvent.press(getByText(date.toLocaleTimeString()));
    fireEvent(getByTestId("dateTimePicker"), "onChange", {
      nativeEvent: { timestamp: newDate.getTime() },
    });
    expect(mockOnDateChange).toHaveBeenCalledWith(newDate);
  });
});
