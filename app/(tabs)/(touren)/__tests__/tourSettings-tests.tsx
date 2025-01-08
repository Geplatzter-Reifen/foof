import React from "react";
import { render, cleanup } from "@testing-library/react-native";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import TourSettings from "./../tourSettings"; // Adjust the path as needed

// Mock dependencies
jest.mock("react-native-safe-area-context", () => ({
  useSafeAreaInsets: jest.fn(() => ({
    top: 10,
    bottom: 0,
    left: 0,
    right: 0,
  })),
}));

jest.mock("@ui-kitten/components", () => {
  const originalModule = jest.requireActual("@ui-kitten/components");
  return {
    ...originalModule,
    Icon: jest.fn().mockImplementation(({ name }) => `MockedIcon(${name})`),
  };
});

jest.mock("@/components/TopNavigation/renderBackAction", () => jest.fn());
jest.mock(
  "@/components/Settings/TourNameSettingsSection",
  () => "TourNameSettingsSection",
);
jest.mock(
  "@/components/Settings/RouteSettingsSection",
  () => "RouteSettingsSection",
);
jest.mock("@/constants/styles", () => ({
  basicCard: { borderRadius: 8 },
  basicShadow: { shadowColor: "#000" },
}));

afterEach(() => {
  jest.clearAllMocks();
  cleanup();
});

describe("TourSettings", () => {
  it("renders correctly", () => {
    const { toJSON } = render(
      <>
        {/* Provide MaterialIconsPack */}
        <ApplicationProvider {...eva} theme={eva.light}>
          <TourSettings />
        </ApplicationProvider>
      </>,
    );
    expect(toJSON()).toMatchSnapshot();
  });
  it("renders the first Layout at depth 1", () => {
    const { getAllByTestId } = render(
      <ApplicationProvider {...eva} theme={eva.light}>
        <TourSettings />
      </ApplicationProvider>,
    );

    // Query all Layout components by testID
    const layouts = getAllByTestId("layout"); //testID="layout"
    expect(layouts).toHaveLength(3); // Ensure there are three Layouts
  });

  it("renders a Card with rounded corners", () => {
    const { getByTestId } = render(
      <ApplicationProvider {...eva} theme={eva.light}>
        <TourSettings />
      </ApplicationProvider>,
    );

    const card = getByTestId("card"); // Add testID="card"
    expect(card.props.style).toEqual(
      expect.objectContaining({
        borderRadius: 8, // Ensure the card has rounded corners
        marginTop: 10,
        alignSelf: "flex-start",
        paddingHorizontal: 15,
        marginHorizontal: 10,
      }),
    );
  });
});
