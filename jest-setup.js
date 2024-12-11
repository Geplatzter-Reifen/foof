// Überschreibt die Datenbank mit einer SQLLite Datenbank die jedes Mal zurückgesetzt wird
jest.mock(
  "@nozbe/watermelondb/adapters/sqlite/makeDispatcher/index.native.js",
  () => {
    return jest.requireActual(
      "@nozbe/watermelondb/adapters/sqlite/makeDispatcher/index.js",
    );
  },
);
// Mockt die Share Funktion von react-native-share
jest.mock("react-native-share", () => ({
  default: jest.fn(),
}));
