import { render, fireEvent } from "@/test-utils/test-utils";
import ConfirmDialog from "@/components/Modal/ConfirmDialog";

describe("ConfirmDialog", () => {
  it("is not visible when requested", () => {
    const view = render(
      <ConfirmDialog
        visible={false}
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(view).toMatchSnapshot();
  });

  it("renders default texts", () => {
    const view = render(
      <ConfirmDialog visible={true} onConfirm={() => {}} onCancel={() => {}} />,
    );
    expect(view).toMatchSnapshot();
    expect(view.getByText("Bestätigung")).toBeTruthy();
    expect(view.getByText("Möchtest du wirklich fortfahren?")).toBeTruthy();
    expect(view.getByText("Bestätigen")).toBeTruthy();
    expect(view.getByText("Abbrechen")).toBeTruthy();
  });

  it("renders correct custom texts", () => {
    const { getByText } = render(
      <ConfirmDialog
        visible={true}
        title="Custom Title"
        message="Custom Message"
        confirmString="Custom Confirm"
        cancelString="Custom Cancel"
        onConfirm={() => {}}
        onCancel={() => {}}
      />,
    );
    expect(getByText("Custom Title")).toBeTruthy();
    expect(getByText("Custom Message")).toBeTruthy();
    expect(getByText("Custom Confirm")).toBeTruthy();
    expect(getByText("Custom Cancel")).toBeTruthy();
  });

  it("calls onConfirm callback when the confirm button is pressed", () => {
    const mockOnConfirm = jest.fn();
    const mockOnCancel = jest.fn();

    const { getByText } = render(
      <ConfirmDialog
        visible={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    // Button finden und simulieren
    const confirmButton = getByText("Bestätigen");
    fireEvent.press(confirmButton);

    // Erwartung: onConfirm wurde aufgerufen
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
    expect(mockOnCancel).not.toHaveBeenCalled();
  });

  it("calls onCancel callback when the cancel button is pressed", () => {
    const mockOnConfirm = jest.fn();
    const mockOnCancel = jest.fn();

    const { getByText } = render(
      <ConfirmDialog
        visible={true}
        onConfirm={mockOnConfirm}
        onCancel={mockOnCancel}
      />,
    );

    // Button finden und simulieren
    const cancelButton = getByText("Abbrechen");
    fireEvent.press(cancelButton);

    // Erwartung: onConfirm wurde aufgerufen
    expect(mockOnCancel).toHaveBeenCalledTimes(1);
    expect(mockOnConfirm).not.toHaveBeenCalled();
  });
});
