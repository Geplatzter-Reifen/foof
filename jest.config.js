module.exports = {
  setupFiles: ["<rootDir>/jest-setup.ts"],
  setupFilesAfterEnv: ["<rootDir>/after-env-jest-setup.ts"],
  preset: "jest-expo",
  transformIgnorePatterns: [
    "node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@sentry/react-native|native-base|react-native-svg|@ui-kitten/.*|@fortawesome/react-native-fontawesome/.*|rn-faded-scrollview/.*)",
  ],
  collectCoverage: true,
  collectCoverageFrom: [
    "**/*.{ts,tsx,js,jsx}",
    "!**/coverage/**",
    "!**/node_modules/**",
    "!**/babel.config.js",
    "!**/expo-env.d.ts",
    "!**/.expo/**",
    "!.eslintrc.js",
    "!jest.config.js",
    "!**/android/**",
    "!**/ios/**",
  ],
};
