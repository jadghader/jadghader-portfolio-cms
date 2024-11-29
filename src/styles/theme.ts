// src/styles/theme.ts
export const lightTheme = {
  background: "#FFFFFF",
  inputBackground: "#F1F1F1",
  text: "#333333",
  accent: "#4A90E2", // Softer blue accent
  hoverAccent: "#357ABD", // Darker blue for hover effect
  primary: "#1D72B8", // Modern primary color
  secondary: "#F3F3F3",
  cardBackground: "#F7F7F7",
  inputText: "#111111",
  disabled: "#D3D3D3", // Light gray for disabled elements
  borderColor: "#E0E0E0", // For consistent borders
  shadow: "rgba(0, 0, 0, 0.1)", // Subtle shadow for light mode
};

export const darkTheme = {
  background: "#1F1F1F",
  inputBackground: "#2C2C2C",
  text: "#F5F5F5",
  accent: "#FF6F61", // Subtle coral accent
  hoverAccent: "#D84D3D", // Darker coral for hover effect
  primary: "#1D72B8", // Consistent primary color
  secondary: "#2B2B2B",
  cardBackground: "#333333",
  inputText: "#FFFFFF",
  disabled: "#555555", // Darker gray for disabled elements in dark mode
  borderColor: "#444444", // Subtle border for dark mode
  shadow: "rgba(0, 0, 0, 0.5)", // Softer shadow for dark mode
};

export type ThemeType = typeof lightTheme;
