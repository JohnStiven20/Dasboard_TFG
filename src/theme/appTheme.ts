import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0f172a",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#2563eb",
    },
    background: {
      default: "#f5f6f8",
      paper: "#ffffff",
    },
    text: {
      primary: "#0f172a",
      secondary: "#516073",
    },
    divider: "#d7deea",
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"Poppins", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h1: {
      fontWeight: 700,
      fontSize: "2.2rem",
      lineHeight: 1.08,
      letterSpacing: "-0.02em",
    },
    h2: {
      fontWeight: 700,
      fontSize: "1.8rem",
      lineHeight: 1.1,
      letterSpacing: "-0.015em",
    },
    h3: {
      fontWeight: 700,
      fontSize: "1.25rem",
      lineHeight: 1.2,
    },
    subtitle1: {
      fontWeight: 500,
      fontSize: "0.98rem",
      lineHeight: 1.45,
      color: "#516073",
    },
    body1: {
      fontSize: "0.95rem",
      lineHeight: 1.45,
    },
    body2: {
      fontSize: "0.88rem",
      lineHeight: 1.4,
    },
    button: {
      textTransform: "none",
      fontWeight: 700,
      letterSpacing: "0.01em",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#f5f6f8",
          color: "#0f172a",
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          minHeight: 38,
          borderRadius: 8,
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 12,
        },
      },
    },
    MuiInputBase: {
      styleOverrides: {
        input: {
          fontSize: "0.95rem",
        },
      },
    },
  },
});
