import React from "react";
import { Alert } from "react-native";
import { render, fireEvent, waitFor, act } from "@/test-utils/test-utils";
import CreateManualStage from "../createManualStage";

// Mock Router and Navigation
const mockedNavigate = jest.fn();
const mockedGoBack = jest.fn();

jest.mock("@rnmapbox/maps", () => ({
  MapView: ({ children }: { children?: React.ReactNode }) => (
    <div>{children}</div>
  ),
  Marker: () => <div>Mocked Marker</div>,
  Camera: () => <div>Mocked Camera</div>,
  locationManager: {
    start: jest.fn(),
    stop: jest.fn(),
  },
}));
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
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2024-01-01T13:00:00Z")); // Fixed UTC time
  });

  afterEach(() => {
    jest.useRealTimers(); // Restore timers
  });
  test("matches snapshot", async () => {
    const view = render(<CreateManualStage />);
    expect(view).toMatchSnapshot();
  });

  test("displays coordinates input when compass button is pressed", async () => {
    const view = render(<CreateManualStage />);

    const compassButton = view.getByTestId("compass");
    await act(async () => {
      fireEvent.press(compassButton);
    });

    await waitFor(() => {
      expect(view.getByText("Start")).toBeTruthy();
      expect(view.getByText("Ende")).toBeTruthy();
      expect(view.getByText("ERSTELLEN")).toBeTruthy();
      expect(view.getByText("ABBRECHEN")).toBeTruthy();
    });
  });

  test("calls back function when cancel button is pressed", async () => {
    const view = render(<CreateManualStage />);
    const cancelButton = view.getByText("ABBRECHEN");

    await act(async () => {
      fireEvent.press(cancelButton);
    });

    expect(mockedGoBack).toHaveBeenCalledTimes(1);
  });

  test("shows alert when dates are invalid", async () => {
    const { getByText } = render(<CreateManualStage />);
    const createButton = getByText("ERSTELLEN");

    await act(async () => {
      fireEvent.press(createButton);
    });

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Ungültige Eingabe",
        "Der Startzeitpunkt muss vor dem Endzeitpunkt liegen.",
      );
    });
  });
});
