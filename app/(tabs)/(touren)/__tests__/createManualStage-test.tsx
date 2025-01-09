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
    jest.clearAllMocks();
    const fakeDate = new Date("2024-01-01T12:00:00Z"); // Your desired fake date
    jest.useFakeTimers(); // Enable Jest's fake timers
    jest.setSystemTime(fakeDate); // Set the fake system time
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
      expect(view.getByTestId("start-input")).toBeTruthy();
      expect(view.getByTestId("end-input")).toBeTruthy();
    });
  });

  test("calls back function when cancel button is pressed", async () => {
    const view = render(<CreateManualStage />);
    const cancelButton = view.getByTestId("cancel-button");

    await act(async () => {
      fireEvent.press(cancelButton);
    });

    expect(mockedGoBack).toHaveBeenCalledTimes(1);
  });

  test("shows alert when dates are invalid", async () => {
    const { getByTestId } = render(<CreateManualStage />);
    const createButton = getByTestId("ok-button");

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
