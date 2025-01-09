import React from "react";
import { Alert } from "react-native";
import { render, fireEvent, waitFor, act } from "@/test-utils/test-utils";
import StageMapView from "../StagesMapView";

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

describe("StageMapView Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("matches snapshot", async () => {
    const view = render(<StageMapView />);
    expect(view).toMatchSnapshot();
  });
});
