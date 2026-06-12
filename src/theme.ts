import { alpha, createTheme } from "@mui/material/styles";

export const themeColors = {
  primary: "#2563eb",
  white: "#ffffff",
  transparent: "transparent",
  weatherEnd: "#0e7490",
  background: {
    darkest: "#101828",
    dark: "#1d2939",
    light: "#344054",
    accent: "#60a5fa",
  },
} as const;

export const themeAlpha = {
  accentGlow: alpha(themeColors.background.accent, 0.35),
  primarySoft: alpha(themeColors.primary, 0.1),
  paperBorder: alpha(themeColors.white, 0.2),
  weatherStart: alpha(themeColors.primary, 0.96),
  weatherEnd: alpha(themeColors.weatherEnd, 0.96),
  whiteDivider: alpha(themeColors.white, 0.3),
  whiteSurface: alpha(themeColors.white, 0.16),
} as const;

export const appTheme = createTheme({
  colorSchemes: {
    light: {
      palette: {
        primary: {
          main: themeColors.primary,
        },
        background: {
          default: themeColors.background.darkest,
          paper: themeColors.white,
        },
      },
    },
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 700,
    },
    button: {
      fontWeight: 700,
      textTransform: "none",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          minHeight: 48,
          borderRadius: 12,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
    MuiTextField: {
      defaultProps: {
        fullWidth: true,
        variant: "outlined",
      },
    },
  },
});
