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
  inputText: "#111111", // Light background for the card
  disabled: "#D3D3D3", // Light gray for disabled elements
};

export const darkTheme = {
  background: "#1F1F1F",
  inputBackground: "#F1F1F1",
  text: "#F5F5F5",
  accent: "#FF6F61", // Subtle coral accent
  hoverAccent: "#D84D3D", // Darker coral for hover effect
  primary: "#1D72B8", // Consistent primary color
  secondary: "#F3F3F3",
  cardBackground: "#333",
  inputText: "#111111", // Light background for the card
  disabled: "#555555", // Darker gray for disabled elements in dark mode
};

export type ThemeType = typeof lightTheme;
