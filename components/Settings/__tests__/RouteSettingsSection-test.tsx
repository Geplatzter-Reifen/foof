import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
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

jest.mock("@ui-kitten/components", () => {
  const originalModule = jest.requireActual("@ui-kitten/components");
  return {
    ...originalModule,
    Icon: jest.fn(({ name }) => `MockedIcon(${name})`), // Mock Icon rendering
  };
});

describe("RouteSettingsSection", () => {
  it("matches the snapshot on initial render", () => {
    const { toJSON } = render(
      <ApplicationProvider {...eva} theme={eva.light}>
        <RouteSettingsSection />
      </ApplicationProvider>,
    );

    expect(toJSON()).toMatchSnapshot(); // Save the snapshot for initial render
  });

  it("handles deleting a route by showing modal", async () => {
    const { getByTestId, findByText } = render(
      <ApplicationProvider {...eva} theme={eva.light}>
        <RouteSettingsSection />
      </ApplicationProvider>,
    );

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

    const { getByTestId } = render(
      <ApplicationProvider {...eva} theme={eva.light}>
        <RouteSettingsSection />
      </ApplicationProvider>,
    );

    fireEvent.press(getByTestId("import-button"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Fehler",
        "Die Datei ist kein gültiges GeoJSON",
      );
    });
  });
});
