import { light, dark } from "@eva-design/eva";

const colorTheme = {
  "color-primary-100": "#FFEDD0",
  "color-primary-200": "#FFD5A1",
  "color-primary-300": "#FFB872",
  "color-primary-400": "#FF9C4E",
  "color-primary-500": "#FF6E14",
  "color-primary-600": "#DB500E",
  "color-primary-700": "#B7370A",
  "color-primary-800": "#932306",
  "color-primary-900": "#7A1403",

  "color-secondary-100": "#DFFAD7",
  "color-secondary-200": "#BAF5B1",
  "color-secondary-300": "#87E183",
  "color-secondary-400": "#5EC363",
  "color-secondary-500": "#309c40",
  "color-secondary-600": "#23863B",
  "color-secondary-700": "#187035",
  "color-secondary-800": "#0F5A2F",
  "color-secondary-900": "#094A2B",

  "color-success-100": "#E5FEE1",
  "color-success-200": "#C5FDC4",
  "color-success-300": "#A6FAAC",
  "color-success-400": "#8EF59F",
  "color-success-500": "#69EF8D",
  "color-success-600": "#4CCD7B",
  "color-success-700": "#34AC6C",
  "color-success-800": "#218A5C",
  "color-success-900": "#147252",

  "color-warning-100": "#FFF9D9",
  "color-warning-200": "#FFF1B4",
  "color-warning-300": "#FFE78E",
  "color-warning-400": "#FFDD72",
  "color-warning-500": "#FFCD44",
  "color-warning-600": "#DBA931",
  "color-warning-700": "#B78722",
  "color-warning-800": "#936715",
  "color-warning-900": "#7A510D",

  "color-danger-100": "#FFEBDD",
  "color-danger-200": "#FFD2BB",
  "color-danger-300": "#FFB499",
  "color-danger-400": "#FF9780",
  "color-danger-500": "#FF6756",
  "color-danger-600": "#DB413E",
  "color-danger-700": "#B72B33",
  "color-danger-800": "#931B2C",
  "color-danger-900": "#7A1028",
};

export const lightTheme = { ...light, ...colorTheme };
export const darkTheme = { ...dark, ...colorTheme };
