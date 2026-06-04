import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import "./index.css";
import App from "./App.tsx";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#0f172a",
      light: "#334155",
      dark: "#020617",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#475569",
      light: "#64748b",
      dark: "#334155",
      contrastText: "#ffffff",
    },
    success: { main: "#10b981", contrastText: "#fff" },
    warning: { main: "#f59e0b", contrastText: "#fff" },
    error: { main: "#ef4444", contrastText: "#fff" },
    info: { main: "#3b82f6", contrastText: "#fff" },
    background: { default: "#f8fafc", paper: "#ffffff" },
    text: { primary: "#0f172a", secondary: "#475569", disabled: "#94a3b8" },
    divider: "#e2e8f0",
  },
  typography: {
    fontFamily: '"Outfit", system-ui, sans-serif',
    h1: { fontWeight: 700, letterSpacing: "-0.02em" },
    h2: { fontWeight: 700, letterSpacing: "-0.02em" },
    h3: { fontWeight: 700, letterSpacing: "-0.02em" },
    h4: { fontWeight: 600, letterSpacing: "-0.01em" },
    h5: { fontWeight: 600, letterSpacing: "-0.01em" },
    h6: { fontWeight: 600, letterSpacing: "-0.01em" },
    button: { fontWeight: 600, textTransform: "none" },
  },
  shape: { borderRadius: 8 },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: "8px",
          padding: "8px 16px",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)",
          border: "1px solid #e2e8f0",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          "& fieldset": { borderColor: "#e2e8f0" },
          "&:hover fieldset": { borderColor: "#cbd5e1" },
          "&.Mui-focused fieldset": { borderColor: "#0f172a" },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #e2e8f0",
          padding: "12px 16px",
        },
        head: {
          backgroundColor: "#f8fafc",
          color: "#475569",
          fontWeight: 600,
        },
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
