import CardComponent from "@/components/Stage/CardComponent";

import React from "react";
import { render, screen } from "@testing-library/react-native";
import { Text } from "@ui-kitten/components";

// Mock `useTheme` from UI Kitten
jest.mock("@ui-kitten/components", () => {
  const actual = jest.requireActual("@ui-kitten/components");
  return {
    ...actual,
    useTheme: () => ({
      "color-basic-500": "#ccc", // Mocked theme color
    }),
  };
});

describe("CardComponent", () => {
  it("renders the title correctly", () => {
    const title = "Test Title";
    render(<CardComponent title={title} form={<Text>Form Content</Text>} />);
    // Check that the title is rendered
    expect(screen.getByText(title)).toBeTruthy();
  });

  it("renders the form content correctly", () => {
    const formContent = "Form Content";
    render(
      <CardComponent title="Test Title" form={<Text>{formContent}</Text>} />,
    );
    // Check that the form content is rendered
    expect(screen.getByText(formContent)).toBeTruthy();
  });

  it("applies the correct styles to the header", () => {
    const title = "Styled Title";
    const { getByText } = render(
      <CardComponent title={title} form={<Text>Form Content</Text>} />,
    );

    // Check that the header styles are applied (e.g., borderBottomColor)
    const headerElement = getByText(title);
    expect(headerElement.props.style).toContainEqual({
      borderBottomColor: "#ccc",
    });
  });
});
