import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import { ApplicationProvider, Text } from "@ui-kitten/components";
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

//mok the ui kitten icon
jest.mock("@ui-kitten/components", () => {
  const originalModule = jest.requireActual("@ui-kitten/components");
  return {
    ...originalModule,
    Icon: jest.fn(({ name }) => <>{`Icon(${name})`}</>),
  };
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
    tourId: "mock-tour-id",
    tourTitle: "Mock Tour Title",
  })),
}));

// Mock updateTourNameById
jest.mock("@/services/data/tourService", () => ({
  updateTourNameById: jest.fn(() => Promise.resolve(true)),
}));

describe("TourNameSettingsSection", () => {
  it("displays the initial tour name", () => {
    const { getByText } = render(
      <ApplicationProvider {...eva} theme={eva.light}>
        <TourNameSettingsSection />
      </ApplicationProvider>,
    );

    expect(getByText("Mock Tour Title")).toBeTruthy();
  });

  it("shows input and allows editing when the edit button is pressed", async () => {
    const { getByTestId, getByText } = render(
      <ApplicationProvider {...eva} theme={eva.light}>
        <TourNameSettingsSection />
      </ApplicationProvider>,
    );

    // Press the edit button
    fireEvent.press(getByTestId("edit-button"));

    // Input should appear
    const input = getByTestId("@tour-name-input/input");
    expect(input).toBeTruthy();

    // Change the text
    fireEvent.changeText(input, "New Tour Name");

    // Press OK button
    fireEvent.press(getByTestId("ok-button"));

    // Wait for the new name to be saved and displayed
    await waitFor(() => {
      expect(getByText("New Tour Name")).toBeTruthy();
    });
  });

  it("does not show input initially", () => {
    const { queryByTestId } = render(
      <ApplicationProvider {...eva} theme={eva.light}>
        <TourNameSettingsSection />
      </ApplicationProvider>,
    );

    expect(queryByTestId("@tour-name-input/input")).toBeNull();
  });

  it("hides input and shows new name after editing", async () => {
    const { getByTestId, queryByTestId, getByText } = render(
      <ApplicationProvider {...eva} theme={eva.light}>
        <TourNameSettingsSection />
      </ApplicationProvider>,
    );

    // Press the edit button
    fireEvent.press(getByTestId("edit-button"));

    // Change the text
    fireEvent.changeText(
      getByTestId("@tour-name-input/input"),
      "Updated Tour Name",
    );

    // Press OK button
    fireEvent.press(getByTestId("ok-button"));

    // Wait for input to disappear and the new name to be displayed
    await waitFor(() => {
      expect(queryByTestId("@tour-name-input/input")).toBeNull();
      expect(getByText("Updated Tour Name")).toBeTruthy();
    });
  });
});
