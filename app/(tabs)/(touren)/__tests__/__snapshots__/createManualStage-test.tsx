import React from "react";
import { Alert } from "react-native";
import { render, fireEvent, waitFor, act } from "@/test-utils/test-utils";
import CreateManualStage from "../../createManualStage";

// Mock RNMapbox Maps
jest.mock("@rnmapbox/maps", () => ({
  MapView: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Marker: () => <div>Mocked Marker</div>,
  Camera: () => <div>Mocked Camera</div>,
  SymbolLayer: () => <div>Mocked SymbolLayer</div>,
}));

// Mock Router and Navigation
const mockedNavigate = jest.fn();
const mockedGoBack = jest.fn();

jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({ tourId: "123" }),
  useRouter: () => ({
    back: mockedGoBack,
    navigate: mockedNavigate,
    push: jest.fn(),
  }),
  useNavigation: () => ({
    navigate: mockedNavigate,
    goBack: mockedGoBack,
    setOptions: jest.fn(),
  }),
}));

// Mock Alert
jest.spyOn(Alert, "alert");

describe("CreateManualStage Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("matches snapshot", () => {
    const { toJSON } = render(<CreateManualStage />);
    expect(toJSON()).toMatchSnapshot();
  });

  test("displays coordinates input when compass button is pressed", async () => {
    const view = render(<CreateManualStage />);

    // Simulate pressing the "coords" (compass) button
    const compassButton = view.getByTestId("compass");
    await act(async () => {
      fireEvent.press(compassButton); // Event that triggers state update
    });
    // Wait for the coordinate inputs to appear
    await waitFor(() => {
      expect(view.getByTestId("start-input")).toBeTruthy();
      expect(view.getByTestId("end-input")).toBeTruthy();
    });
  });

  test("calls back function when cancel button is pressed", async () => {
    const view = render(<CreateManualStage />);
    // Simulate pressing the cancel button
    const cancelButton = view.getByTestId("cancel-button");
    await act(async () => {
      fireEvent.press(cancelButton); // Event that triggers state update
    });
    // Verify back function is called
    expect(mockedGoBack).toHaveBeenCalledTimes(1);
  });

  test("shows alert when dates are invalid", async () => {
    const { getByTestId } = render(<CreateManualStage />);

    // Simulate pressing the create button
    const createButton = getByTestId("ok-button");
    await act(async () => {
      fireEvent.press(createButton); // Event that triggers state update
    });

    // Wait for the alert to be called
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Ungültige Eingabe",
        "Der Startzeitpunkt muss vor dem Endzeitpunkt liegen.",
      );
    });
  });
});
