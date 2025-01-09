import React from "react";
import { render, fireEvent, waitFor } from "@/test-utils/test-utils";
import RouteSettingsSection from "../RouteSettingsSection";
import { Alert } from "react-native";

jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(() => ({
    tourId: "mock-tourId",
    tourTitle: "Mock Title",
  })),
}));

jest.mock("@/services/data/routeService", () => ({
  deleteRoute: jest.fn(),
  getTourRoute: jest.fn().mockResolvedValue("mock-route-data"),
  setTourRoute: jest.fn(),
}));

jest.mock("expo-document-picker", () => ({
  getDocumentAsync: jest.fn(),
}));

jest.mock("expo-file-system", () => ({
  readAsStringAsync: jest.fn(),
}));

jest.mock("geojson-validation", () => ({
  valid: jest.fn(),
}));

jest.spyOn(Alert, "alert").mockImplementation(() => {});

afterEach(() => {
  jest.clearAllMocks();
  jest.useRealTimers();
});

describe("RouteSettingsSection", () => {
  it("matches the snapshot on initial render", () => {
    const { toJSON } = render(<RouteSettingsSection />);

    expect(toJSON()).toMatchSnapshot(); // Save the snapshot for initial render
  });

  it("handles deleting a route by showing modal", async () => {
    const { getByTestId, findByText } = render(<RouteSettingsSection />);

    await waitFor(() => {
      expect(getByTestId("delete-button")).toBeTruthy();
    });
    fireEvent.press(getByTestId("delete-button"));
    expect(findByText("Route löschen")).toBeTruthy();
  });

  it("shows an error for invalid GeoJSON files", async () => {
    const mockFile = {
      canceled: false,
      assets: [{ name: "invalid.geojson", uri: "file://invalid.geojson" }],
    };

    require("expo-document-picker").getDocumentAsync.mockResolvedValue(
      mockFile,
    );
    require("expo-file-system").readAsStringAsync.mockResolvedValue(
      JSON.stringify({ type: "InvalidType" }),
    );
    require("geojson-validation").valid.mockReturnValue(false);

    const { getByTestId } = render(<RouteSettingsSection />);

    fireEvent.press(getByTestId("import-button"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Fehler",
        "Die Datei ist kein gültiges GeoJSON",
      );
    });
  });
});
