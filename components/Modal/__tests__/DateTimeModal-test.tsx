import { render, fireEvent } from "@/test-utils/test-utils";
import DateTimeModal from "@/components/Modal/DateTimeModal";
import { formatDate, DateFormat } from "@/utils/dateUtils";

describe("DateTimeModal Component", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const mockOnStartDateChange = jest.fn();
  const mockOnEndDateChange = jest.fn();

  const startDate = new Date(2024, 0, 1, 12, 0, 0);
  const endDate = new Date(2024, 0, 2, 13, 0, 0);

  const defaultProps = {
    modalVisible: true,
    onClose: mockOnClose,
    onSave: mockOnSave,
    onStartDateChange: mockOnStartDateChange,
    onEndDateChange: mockOnEndDateChange,
    initialStartDate: startDate,
    initialEndDate: endDate,
  };

  it("matches the snapshot", () => {
    const { toJSON } = render(<DateTimeModal {...defaultProps} />);
    expect(toJSON()).toMatchSnapshot();
  });

  it("renders correctly", () => {
    const { getByText } = render(<DateTimeModal {...defaultProps} />);
    // Startzeit
    expect(getByText("Startzeit")).toBeTruthy();
    expect(getByText(formatDate(startDate, DateFormat.DATE))).toBeTruthy();
    expect(getByText(formatDate(startDate, DateFormat.TIME))).toBeTruthy();
    // Endzeit
    expect(getByText("Endzeit")).toBeTruthy();
    expect(getByText(formatDate(endDate, DateFormat.DATE))).toBeTruthy();
    expect(getByText(formatDate(endDate, DateFormat.TIME))).toBeTruthy();
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
    const newStartDate = new Date(2024, 0, 2);
    const { getByText, getByTestId } = render(
      <DateTimeModal {...defaultProps} />,
    );
    fireEvent.press(getByText(formatDate(startDate, DateFormat.DATE)));
    fireEvent(getByTestId("dateTimePicker"), "onChange", {
      nativeEvent: { timestamp: newStartDate.getTime() },
    });
    expect(mockOnStartDateChange).toHaveBeenCalledWith(newStartDate);
  });

  it("calls onEndDateChange with new time", () => {
    const newEndDate = new Date(2024, 0, 1, 14, 0, 0);
    const { getByText, getByTestId } = render(
      <DateTimeModal {...defaultProps} />,
    );
    fireEvent.press(getByText(formatDate(endDate, DateFormat.TIME)));
    fireEvent(getByTestId("dateTimePicker"), "onChange", {
      nativeEvent: { timestamp: newEndDate.getTime() },
    });
    expect(mockOnEndDateChange).toHaveBeenCalledWith(newEndDate);
  });
});
