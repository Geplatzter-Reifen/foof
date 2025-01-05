import React from "react";
import { render, fireEvent } from "@/test-utils/test-utils";
import DateTimeButton from "@/components/Modal/DateTimeButton";
import { formatDate, DateFormat } from "@/utils/dateUtils";

describe("DateTimeButton Component", () => {
  const mockOnDateChange = jest.fn();

  const date = new Date(2024, 0, 1, 12, 0, 0);

  const defaultProps = {
    date: date,
    mode: "date" as "date" | "time",
    onDateChange: mockOnDateChange,
  };

  it("matches the snapshot", () => {
    const { toJSON } = render(<DateTimeButton {...defaultProps} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders correctly with initial date", () => {
    const { getByText } = render(<DateTimeButton {...defaultProps} />);
    expect(getByText(formatDate(date, DateFormat.DATE))).toBeTruthy();
  });

  it("renders correctly with initial time", () => {
    const props = { ...defaultProps, mode: "time" as "date" | "time" };
    const { getByText } = render(<DateTimeButton {...props} />);
    expect(getByText(formatDate(date, DateFormat.TIME))).toBeTruthy();
  });

  it("opens date picker on button press", () => {
    const { getByText, getByTestId } = render(
      <DateTimeButton {...defaultProps} />,
    );
    fireEvent.press(getByText(formatDate(date, DateFormat.DATE)));
    expect(getByTestId("dateTimePicker")).toBeTruthy();
  });

  it("calls onDateChange with new date", () => {
    const newDate = new Date(2024, 0, 2);
    const { getByText, getByTestId } = render(
      <DateTimeButton {...defaultProps} />,
    );
    fireEvent.press(getByText(formatDate(date, DateFormat.DATE)));
    fireEvent(getByTestId("dateTimePicker"), "onChange", {
      nativeEvent: { timestamp: newDate.getTime() },
    });
    expect(mockOnDateChange).toHaveBeenCalledWith(newDate);
  });

  it("calls onDateChange with new time", () => {
    const newDate = new Date(2024, 0, 1, 13, 0, 0);
    const props = { ...defaultProps, mode: "time" as "date" | "time" };
    const { getByText, getByTestId } = render(<DateTimeButton {...props} />);
    fireEvent.press(getByText(formatDate(date, DateFormat.TIME)));
    fireEvent(getByTestId("dateTimePicker"), "onChange", {
      nativeEvent: { timestamp: newDate.getTime() },
    });
    expect(mockOnDateChange).toHaveBeenCalledWith(newDate);
  });
});
