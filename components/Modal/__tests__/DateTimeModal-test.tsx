import React from "react";
import { render, fireEvent } from "@/test-utils/test-utils";
import DateTimeModal from "@/components/Modal/DateTimeModal";

describe("DateTimeModal Component", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const mockOnStartDateChange = jest.fn();
  const mockOnEndDateChange = jest.fn();
  const defaultProps = {
    modalVisible: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    onStartDateChange: mockOnStartDateChange,
    onEndDateChange: mockOnEndDateChange,
    initialStartDate: new Date(2024, 0, 1, 12, 0, 0),
    initialEndDate: new Date(2024, 0, 2, 13, 0, 0),
  };

  it("renders correctly", () => {
    const { getByText } = render(<DateTimeModal {...defaultProps} />);
    // Startzeit
    expect(getByText("Startzeit")).toBeTruthy();
    expect(getByText(new Date(2024, 0, 1).toLocaleDateString())).toBeTruthy();
    expect(
      getByText(new Date(2024, 0, 1, 12, 0, 0).toLocaleTimeString()),
    ).toBeTruthy();
    // Endzeit
    expect(getByText("Endzeit")).toBeTruthy();
    expect(getByText(new Date(2024, 0, 2).toLocaleDateString())).toBeTruthy();
    expect(
      getByText(new Date(2024, 0, 2, 13, 0, 0).toLocaleTimeString()),
    ).toBeTruthy();
  });

  it("calls onClose when Abbrechen button is pressed", () => {
    const { getByText } = render(<DateTimeModal {...defaultProps} />);
    fireEvent.press(getByText("Abbrechen"));
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("calls onSave when Speichern button is pressed", () => {
    const { getByText } = render(<DateTimeModal {...defaultProps} />);
    fireEvent.press(getByText("Speichern"));
    expect(mockOnSave).toHaveBeenCalled();
  });

  it("calls onStartDateChange with new date", () => {
    const { getByText, getByTestId } = render(
      <DateTimeModal {...defaultProps} />,
    );
    fireEvent.press(getByText(new Date(2024, 0, 1).toLocaleDateString()));
    fireEvent(getByTestId("dateTimePicker"), "onChange", {
      nativeEvent: { timestamp: new Date(2024, 0, 2).getTime() },
    });
    expect(mockOnStartDateChange).toHaveBeenCalledWith(new Date(2024, 0, 2));
  });

  it("calls onEndDateChange with new time", () => {
    const { getByText, getByTestId } = render(
      <DateTimeModal {...defaultProps} />,
    );
    fireEvent.press(
      getByText(new Date(2024, 0, 2, 13, 0, 0).toLocaleTimeString()),
    );
    fireEvent(getByTestId("dateTimePicker"), "onChange", {
      nativeEvent: { timestamp: new Date(2024, 0, 1, 14, 0, 0).getTime() },
    });
    expect(mockOnEndDateChange).toHaveBeenCalledWith(
      new Date(2024, 0, 1, 14, 0, 0),
    );
  });
});
