import React from "react";
import { render, cleanup } from "@/test-utils/test-utils";
import TourSettings from "./../tourSettings"; // Adjust the path as needed

jest.mock("@/components/Navigation/renderBackAction", () => jest.fn());
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
    const { toJSON } = render(<TourSettings />);
    expect(toJSON()).toMatchSnapshot();
  });
  it("renders the first Layout at depth 1", () => {
    const { getAllByTestId } = render(<TourSettings />);

    // Query all Layout components by testID
    const layouts = getAllByTestId("layout"); //testID="layout"
    expect(layouts).toHaveLength(3); // Ensure there are three Layouts
  });

  it("renders a Card with rounded corners", () => {
    const { getByTestId } = render(<TourSettings />);

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
