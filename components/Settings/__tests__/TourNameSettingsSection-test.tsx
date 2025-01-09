import React from "react";
import { fireEvent, render, waitFor } from "@testing-library/react-native";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import TourNameSettingsSection from "@/components/Settings/TourNameSettingsSection";

// Mock SingleSettingLayout
jest.mock("@/components/Settings/SingleSettingLayout", () => {
  const React = require("react");
  const { View, Text } = require("react-native");
  return ({
    settingName,
    children,
  }: {
    settingName: React.ReactNode;
    children: React.ReactNode;
  }) => (
    <View>
      <Text>{settingName}</Text>
      {children}
    </View>
  );
});

// Mock InlineRow
jest.mock("@/components/Settings/InlineRow", () => {
  const React = require("react");
  const { View } = require("react-native");

  return ({
    leftComponent,
    buttons,
  }: {
    leftComponent: React.ReactElement;
    buttons: React.ReactElement | React.ReactElement[];
  }) => (
    <View>
      <View>{leftComponent}</View>
      <View>{buttons}</View>
    </View>
  );
});

// Mock useLocalSearchParams
jest.mock("expo-router", () => ({
  useLocalSearchParams: jest.fn(() => ({
    tourId: "mock-tourId",
    tourTitle: "Mock Title",
  })),
}));

// Mock updateTourNameById
jest.mock("@/services/data/tourService", () => ({
  updateTourNameById: jest.fn().mockImplementation(
    () => new Promise((resolve) => setTimeout(() => resolve(true), 500)), // Simulate delay
  ),
}));

jest.mock("@ui-kitten/components", () => {
  const originalModule = jest.requireActual("@ui-kitten/components");
  return {
    ...originalModule,
    Icon: jest.fn(({ name }) => `MockedIcon(${name})`), // Mock Icon rendering
  };
});

// Reset mocks after each test
afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});

describe("TourNameSettingsSection", () => {
  it("matches the snapshot on initial render", () => {
    const { toJSON } = render(
      <ApplicationProvider {...eva} theme={eva.light}>
        <TourNameSettingsSection />
      </ApplicationProvider>,
    );

    expect(toJSON()).toMatchSnapshot(); // Save the snapshot for initial render
  });

  it("displays the initial tour name", async () => {
    const { findByText } = render(
      <ApplicationProvider {...eva} theme={eva.light}>
        <TourNameSettingsSection />
      </ApplicationProvider>,
    );

    expect(await findByText("Mock Title")).toBeTruthy();
  });

  it("allows editing the tour name", async () => {
    const { getByTestId, queryByTestId, getByText } = render(
      <ApplicationProvider {...eva} theme={eva.light}>
        <TourNameSettingsSection />
      </ApplicationProvider>,
    );

    // Verify the edit button is visible
    const editButton = getByTestId("edit-button");
    expect(editButton).toBeTruthy();

    // Click the edit button
    fireEvent.press(editButton);

    // Verify input and OK button appear
    const input = await waitFor(() => getByTestId("@tour-name-input/input"));
    const okButton = getByTestId("ok-button");
    expect(input).toBeTruthy();
    expect(okButton).toBeTruthy();

    // Simulate entering a new tour name
    fireEvent.changeText(input, "New Tour Name");

    // Click the OK button
    fireEvent.press(okButton);

    // Wait for the input to disappear and the new name to appear
    await waitFor(() => {
      expect(queryByTestId("@tour-name-input/input")).toBeNull();
      expect(getByText("New Tour Name")).toBeTruthy();
    });
  });
});
