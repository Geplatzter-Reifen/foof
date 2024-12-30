import React from "react";
import { render, fireEvent } from "@/test-utils/test-utils";
import DateTimeButton from "@/components/Modal/DateTimeButton";

describe("DateTimeButton Component", () => {
  const mockOnDateChange = jest.fn();
  const defaultProps = {
    date: new Date(2024, 0, 1, 12, 0, 0),
    mode: "date" as "date" | "time",
    onDateChange: mockOnDateChange,
  };

  it("renders correctly with initial date", () => {
    const { getByText } = render(<DateTimeButton {...defaultProps} />);
    expect(getByText(new Date(2024, 0, 1).toLocaleDateString())).toBeTruthy();
  });

  it("renders correctly with initial time", () => {
    const props = { ...defaultProps, mode: "time" as "date" | "time" };
    const { getByText } = render(<DateTimeButton {...props} />);
    expect(
      getByText(new Date(2024, 0, 1, 12, 0, 0).toLocaleTimeString()),
    ).toBeTruthy();
  });

  it("opens date picker on button press", () => {
    const { getByText, getByTestId } = render(
      <DateTimeButton {...defaultProps} />,
    );
    fireEvent.press(getByText(new Date(2024, 0, 1).toLocaleDateString()));
    expect(getByTestId("dateTimePicker")).toBeTruthy();
  });

  it("calls onDateChange with new date", () => {
    const { getByText, getByTestId } = render(
      <DateTimeButton {...defaultProps} />,
    );
    fireEvent.press(getByText(new Date(2024, 0, 1).toLocaleDateString()));
    fireEvent(getByTestId("dateTimePicker"), "onChange", {
      nativeEvent: { timestamp: new Date(2024, 0, 2).getTime() },
    });
    expect(mockOnDateChange).toHaveBeenCalledWith(new Date(2024, 0, 2));
  });

  it("calls onDateChange with new time", () => {
    const props = { ...defaultProps, mode: "time" as "date" | "time" };
    const { getByText, getByTestId } = render(<DateTimeButton {...props} />);
    fireEvent.press(
      getByText(new Date(2024, 0, 1, 12, 0, 0).toLocaleTimeString()),
    );
    fireEvent(getByTestId("dateTimePicker"), "onChange", {
      nativeEvent: { timestamp: new Date(2024, 0, 1, 13, 0, 0).getTime() },
    });
    expect(mockOnDateChange).toHaveBeenCalledWith(
      new Date(2024, 0, 1, 13, 0, 0),
    );
  });
});
