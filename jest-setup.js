jest.mock(
  "@nozbe/watermelondb/adapters/sqlite/makeDispatcher/index.native.js",
  () => {
    return jest.requireActual(
      "@nozbe/watermelondb/adapters/sqlite/makeDispatcher/index.js",
    );
  },
);
jest.mock("react-native-share", () => ({
  default: jest.fn(),
}));
