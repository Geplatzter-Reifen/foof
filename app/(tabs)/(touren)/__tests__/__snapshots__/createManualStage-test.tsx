// import React from "react";
// import { render, screen, fireEvent } from "@/test-utils/test-utils";
// import CreateManualStage from "../../createManualStage";
// import { createManualStage as createManualStageFn } from "@/services/tracking";
// // Mock external dependencies
// jest.mock("@/services/tracking", () => ({
//   createManualStage: jest.fn(),
// }));
//
// const mockedPush = jest.fn();
// const mockedBack = jest.fn();
//
// jest.mock("expo-router", () => ({
//   useRouter: () => ({
//     push: mockedPush,
//     back: mockedBack,
//   }),
//   useLocalSearchParams: () => ({ tourId: "123" }),
// }));
// const mockedNavigate = jest.fn();
// const mockedGoBack = jest.fn();
// jest.mock("expo-router", () => ({
//   useLocalSearchParams: () => ({ tourId: "123" }),
//   useRouter: () => ({ back: jest.fn() }),
//   useNavigation: () => ({
//     navigate: mockedNavigate,
//     goBack: mockedGoBack,
//     setOptions: jest.fn(), // If your component uses setOptions
//   }),
// }));
//
// jest.mock("@ui-kitten/components", () => ({
//   ...jest.requireActual("@ui-kitten/components"),
//   Layout: ({ children }: any) => <div>{children}</div>,
//   Button: ({ children, ...props }: any) => (
//     <button {...props}>{children}</button>
//   ),
//   Input: ({ value, onChangeText, placeholder }: any) => (
//     <input
//       placeholder={placeholder}
//       value={value}
//       onChange={(e) => onChangeText(e.target.value)}
//     />
//   ),
//   Text: ({ children }: any) => <text>{children}</text>,
// }));
//
// describe("CreateManualStage Testing", () => {
//   beforeEach(() => {
//     jest.clearAllMocks();
//   });
//
//   test("renders correctly with all components", () => {
//     render(<CreateManualStage />);
//     screen.debug();
//
//     // expect(screen.getByPlaceholderText("Enter stage title")).toBeTruthy();
//     expect(screen.getByText(/Start/i)).toBeTruthy();
//     expect(screen.getByText(/Ende/i)).toBeTruthy();
//     expect(screen.getByText(/ABBRECHEN/i)).toBeTruthy();
//     expect(screen.getByText(/ERSTELLEN/i)).toBeTruthy();
//   });
//
//   test("change the title button should change", () => {
//     render(<CreateManualStage />);
//     // Step 1: Find the button using accessibilityLabel
//     const toggleButton = screen.getByLabelText("Toggle title edit mode");
//     // Step 2: Verify initial icon is 'edit'
//     expect(screen.getByTestId("edit-icon")).toBeTruthy();
//     fireEvent.press(toggleButton);
//     expect(screen.getByPlaceholderText("Enter stage title")).toBeTruthy();
//     // Step 3: Simulate button press
//     // Step 4: Verify the state changed and the icon is now 'check'
//     expect(screen.getByTestId("check-icon")).toBeTruthy();
//
//     // Step 5: Press again to toggle back to 'edit'
//     fireEvent.press(toggleButton);
//     expect(screen.getByTestId("edit-icon")).toBeTruthy();
//     expect(screen.getByPlaceholderText("Enter stage title")).toBeTruthy();
//   });
//
//   test("shows error alert when title is empty", () => {
//     global.alert = jest.fn();
//     render(<CreateManualStage />);
//     const titleInput = screen.getByPlaceholderText("Enter stage title");
//     fireEvent.changeText(titleInput, "");
//     const submitButton = screen.getByText(/ERSTELLEN/i);
//     fireEvent.press(submitButton);
//     expect(global.alert).toHaveBeenCalledWith(
//       "Error",
//       "Stage title cannot be empty.",
//     );
//   });
//
//   test("calls createManualStageFn on valid submission", async () => {
//     render(<CreateManualStage />);
//
//     // Mock input fields
//     fireEvent.changeText(screen.getByPlaceholderText("Enter stage title"), {
//       target: { value: "Valid Stage Title" },
//     });
//     fireEvent.changeText(screen.getAllByRole("textbox")[1], {
//       target: { value: "50.1109" },
//     });
//     fireEvent.changeText(screen.getAllByRole("textbox")[2], {
//       target: { value: "8.6821" },
//     });
//
//     const submitButton = screen.getByText(/ERSTELLEN/i);
//     fireEvent.press(submitButton);
//
//     expect(createManualStageFn).toHaveBeenCalledWith(
//       "Valid Stage Title",
//       "50.1109, ", // Start latitude
//       ", ", // End latitude (not set in this case)
//       expect.any(Date), // Start date
//       expect.any(Date), // End date
//       "123", // tourId
//     );
//   });
//
//   test("cancel button navigates back", () => {
//     const useRouter = require("expo-router").useRouter;
//     const mockRouterBack = useRouter().back;
//
//     render(<CreateManualStage />);
//
//     const cancelButton = screen.getByText(/ABBRECHEN/i);
//     fireEvent.press(cancelButton);
//
//     expect(mockRouterBack).toHaveBeenCalled();
//   });
// });

import React from "react";
import {
  render,
  fireEvent,
  screen,
  within,
} from "@testing-library/react-native";
import { Alert } from "react-native";
import CreateManualStage from "../../createManualStage";
import { MockTour } from "@/__mocks__/tour";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { ApplicationProvider } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { foofDarkTheme, foofLightTheme } from "@/constants/custom-theme";

// Mock the dynamic USE_DARK_THEME variable
const USE_DARK_THEME = true; // or false based on your test scenario

const theme = USE_DARK_THEME
  ? { ...eva.dark, ...foofDarkTheme }
  : { ...eva.light, ...foofLightTheme };
// Mock createManualStageFn
jest.mock("@/services/tracking", () => ({
  createManualStage: jest.fn(),
}));

const mockedPush = jest.fn();
const mockedBack = jest.fn();

jest.mock("expo-router", () => ({
  useRouter: () => ({
    push: mockedPush,
    back: mockedBack,
  }),
  useLocalSearchParams: () => ({ tourId: "123" }),
}));
const mockedNavigate = jest.fn();
const mockedGoBack = jest.fn();
jest.mock("expo-router", () => ({
  useLocalSearchParams: () => ({ tourId: "123" }),
  useRouter: () => ({ back: jest.fn() }),
  useNavigation: () => ({
    navigate: mockedNavigate,
    goBack: mockedGoBack,
    setOptions: jest.fn(), // If your component uses setOptions
  }),
}));

jest.mock("@ui-kitten/components", () => {
  const originalModule = jest.requireActual("@ui-kitten/components");
  return {
    ...originalModule, // Spread original exports to keep all default functionality
    Layout: ({ children }: any) => <div>{children}</div>,
    Button: ({ children, accessibilityLabel, ...props }: any) => (
      <div aria-label={accessibilityLabel} {...props}>
        {children}
      </div>
    ),
    Input: ({ value, onChangeText, placeholder }: any) => (
      <input
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChangeText(e.target.value)}
      />
    ),
    Text: ({ children }: any) => <span>{children}</span>,
    useTheme: () => ({
      "color-basic-500": "#ccc", // Mock theme values
    }),
  };
});

const mockCreateManualStage = jest.fn();
jest.mock("@/services/tracking", () => ({
  createManualStage: mockCreateManualStage,
}));
const tourMock = MockTour;
// Mock FontAwesomeIcon
jest.mock("@fortawesome/react-native-fontawesome", () => ({
  FontAwesomeIcon: ({
    icon,
    size,
  }: {
    icon: IconDefinition | string;
    size: number;
  }) => {
    return (
      <div>
        MockedIcon(icon: {typeof icon === "string" ? icon : icon.iconName},
        size: {size})
      </div>
    );
  },
}));
// Mock Alert.alert
jest.spyOn(Alert, "alert");

// Wrap CreateManualStage with ApplicationProvider
const renderWithApplicationProvider = (ui: React.ReactNode) => {
  return render(
    <ApplicationProvider {...eva} theme={theme}>
      {ui}
    </ApplicationProvider>,
  );
};
describe("CreateManualStage Component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test("the component is being created", () => {
    const view = renderWithApplicationProvider(<CreateManualStage />);
    expect(view).toMatchSnapshot();
  });

  test("renders button cancel correctly", () => {
    const view = renderWithApplicationProvider(<CreateManualStage />);
    // Check for essential buttons
    const cancelButton = screen.getByLabelText("Cancel button");
    expect(cancelButton).toBeTruthy();
    //todo solve the problem with abbrechen text inside of the button
  });
  test("renders button save correctly", () => {
    const view = renderWithApplicationProvider(<CreateManualStage />);
    // Check for essential buttons
    const saveButton = screen.getByLabelText("Submit button");
    expect(saveButton).toBeTruthy();
    //todo solve the problem with ERSTELLEN text inside of the button
  });
  test("renders buttons correctly", () => {
    renderWithApplicationProvider(<CreateManualStage />);

    // Check if all buttons are rendered with correct labels
    const compassButton = screen.getByLabelText("Compass button");
    const mapPinButton = screen.getByLabelText("Map Pin button");
    const cityButton = screen.getByLabelText("City button");

    expect(compassButton).toBeTruthy();
    expect(mapPinButton).toBeTruthy();
    expect(cityButton).toBeTruthy();
  });
  test("calls onSelect when a button is clicked", () => {
    const mockOnSelect = jest.fn();
    renderWithApplicationProvider(
      <ButtonGroupComponent onSelect={mockOnSelect} />,
    );

    const compassButton = screen.getByLabelText("Compass button");
    fireEvent.press(compassButton);

    // Ensure the onSelect function is called
    expect(mockOnSelect).toHaveBeenCalledWith(0); // Assuming compass button is index 0
  });

  test("updates selectedIndex when a button is clicked", () => {
    renderWithApplicationProvider(<CreateManualStage />);

    const mapPinButton = screen.getByLabelText("Map Pin button");
    fireEvent.press(mapPinButton);

    // Assert that the selected button visually reflects the change
    const selectedButton = screen.getByRole("button", { selected: true });
    expect(selectedButton).toHaveAccessibleName("Map Pin button");
  });

  test("renders icons correctly within buttons", () => {
    renderWithApplicationProvider(<CreateManualStage />);

    const compassIcon = screen.getByText(/MockedIcon\(icon: compass/i);
    const mapPinIcon = screen.getByText(/MockedIcon\(icon: map-pin/i);
    const cityIcon = screen.getByText(/MockedIcon\(icon: city/i);

    expect(compassIcon).toBeTruthy();
    expect(mapPinIcon).toBeTruthy();
    expect(cityIcon).toBeTruthy();
  });

  // test("calls router.back when cancel button is pressed", () => {
  //   render(<CreateManualStage />);
  //   const cancelButton = screen.getByText(/ABBRECHEN/i);
  //
  //   fireEvent.press(cancelButton);
  //   expect(mockRouterBack).toHaveBeenCalled();
  // });
  //
  // test("submits form with valid input", async () => {
  //   render(<CreateManualStage />);
  //
  //   // Fill out the form
  //   fireEvent.changeText(
  //     screen.getByPlaceholderText(/Enter stage title/i),
  //     "New Stage",
  //   );
  //   fireEvent.changeText(screen.getAllByRole("textbox")[0], "12.3456"); // Start Latitude
  //   fireEvent.changeText(screen.getAllByRole("textbox")[1], "78.9012"); // Start Longitude
  //   fireEvent.changeText(screen.getAllByRole("textbox")[2], "98.7654"); // End Latitude
  //   fireEvent.changeText(screen.getAllByRole("textbox")[3], "43.2109"); // End Longitude
  //
  //   const submitButton = screen.getByText(/ERSTELLEN/i);
  //   fireEvent.press(submitButton);
  //
  //   // Ensure createManualStageFn is called with the correct arguments
  //   expect(mockCreateManualStage).toHaveBeenCalledWith(
  //     "New Stage",
  //     "12.3456, 78.9012",
  //     "98.7654, 43.2109",
  //     expect.any(Date),
  //     expect.any(Date),
  //     "123", // tourId
  //   );
  // });
  //
  // test("shows error alert for missing stage title", () => {
  //   render(<CreateManualStage />);
  //   const submitButton = screen.getByText(/ERSTELLEN/i);
  //
  //   fireEvent.press(submitButton);
  //
  //   // Check for alert
  //   expect(Alert.alert).toHaveBeenCalledWith(
  //     "Error",
  //     "Stage title cannot be empty.",
  //   );
  //   expect(mockCreateManualStage).not.toHaveBeenCalled();
  // });
  //
  // test("shows error alert for missing coordinates", () => {
  //   render(<CreateManualStage />);
  //
  //   // Fill the title only
  //   fireEvent.changeText(
  //     screen.getByPlaceholderText(/Enter stage title/i),
  //     "New Stage",
  //   );
  //
  //   const submitButton = screen.getByText(/ERSTELLEN/i);
  //   fireEvent.press(submitButton);
  //
  //   // Check for alert
  //   expect(Alert.alert).toHaveBeenCalledWith(
  //     "Error",
  //     "Coordinates cannot be empty.",
  //   );
  //   expect(mockCreateManualStage).not.toHaveBeenCalled();
  // });
});
