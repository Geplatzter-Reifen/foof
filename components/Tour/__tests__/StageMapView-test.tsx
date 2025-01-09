import React, { ReactElement } from "react";
import { Alert } from "react-native";
import { render } from "@/test-utils/test-utils";
import StageMapView from "../StagesMapView";
import { waitFor } from "@testing-library/react-native";
import { createTour } from "@/services/data/tourService";

// Mock RNMapbox Maps
jest.mock("@rnmapbox/maps", () => ({
  MapView: (children: ReactElement) => <div>{children}</div>,
  Marker: () => <div>Mocked Marker</div>,
  Camera: () => <div>Mocked Camera</div>,
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
    const tour = await createTour("Test Tour");
    const view = await waitFor(() => render(<StageMapView tourId={tour.id} />));
    expect(view).toMatchSnapshot();
  });
});
