import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import "./index.css";
import App from "./App.tsx";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#191919",
      light: "#2e2e2e",
      dark: "#0a0a0a",
      contrastText: "#ffffff",
    },
    secondary: {
      main: "#5e5e5e",
      light: "#7e7e7e",
      dark: "#3a3a3a",
      contrastText: "#ffffff",
    },
    success: { main: "#15803d", contrastText: "#fff" },
    warning: { main: "#b45309", contrastText: "#fff" },
    error: { main: "#b91c1c", contrastText: "#fff" },
    info: { main: "#1d4ed8", contrastText: "#fff" },
    background: { default: "#faf9f6", paper: "#ffffff" },
    text: { primary: "#191919", secondary: "#5e5e5e", disabled: "#8e8e8e" },
    divider: "#e6e4dd",
  },
  typography: {
    fontFamily: '"CohereText", "Anthropic Sans", "Plus Jakarta Sans", "Instrument Sans", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif',
    h1: { fontFamily: '"CohereText", "Anthropic Sans", "Plus Jakarta Sans", "Instrument Sans", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif', fontWeight: 600, letterSpacing: "-0.01em" },
    h2: { fontFamily: '"CohereText", "Anthropic Sans", "Plus Jakarta Sans", "Instrument Sans", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif', fontWeight: 600, letterSpacing: "-0.01em" },
    h3: { fontFamily: '"CohereText", "Anthropic Sans", "Plus Jakarta Sans", "Instrument Sans", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif', fontWeight: 500, letterSpacing: "-0.01em" },
    h4: { fontFamily: '"CohereText", "Anthropic Sans", "Plus Jakarta Sans", "Instrument Sans", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif', fontWeight: 500, letterSpacing: "-0.01em" },
    h5: { fontFamily: '"CohereText", "Anthropic Sans", "Plus Jakarta Sans", "Instrument Sans", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif', fontWeight: 500, letterSpacing: "-0.01em" },
    h6: { fontFamily: '"CohereText", "Anthropic Sans", "Plus Jakarta Sans", "Instrument Sans", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif', fontWeight: 500, letterSpacing: "-0.01em" },
    button: { fontFamily: '"CohereText", "Anthropic Sans", "Plus Jakarta Sans", "Instrument Sans", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif', fontWeight: 600, textTransform: "none", letterSpacing: "-0.01em" },
    body1: { letterSpacing: "-0.01em" },
    body2: { letterSpacing: "-0.01em" },
  },
  shape: { borderRadius: 10 },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F6F5EF",
          backgroundImage: `
            radial-gradient(at 0% 0%, rgba(206, 172, 114, 0.16) 0px, transparent 40%),
            radial-gradient(at 100% 0%, rgba(212, 190, 153, 0.16) 0px, transparent 40%),
            radial-gradient(at 50% 100%, rgba(220, 215, 201, 0.22) 0px, transparent 50%),
            radial-gradient(at 20% 70%, rgba(240, 237, 230, 0.2) 0px, transparent 40%),
            radial-gradient(at 80% 40%, rgba(21, 128, 61, 0.02) 0px, transparent 30%)
          `,
          backgroundAttachment: "fixed",
          backgroundRepeat: "no-repeat",
          minHeight: "100vh",
        }
      }
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: "99px",
          padding: "10px 24px",
          fontWeight: 600,
          letterSpacing: "-0.01em",
          transition: "all 200ms cubic-bezier(0.16, 1, 0.3, 1)",
          textTransform: "none",
          border: "1px solid transparent",
          "&:hover": {
            transform: "translateY(-1px)",
            boxShadow: "0 4px 12px rgba(25, 25, 25, 0.05)",
          },
          "&:active": {
            transform: "scale(0.96) translateY(0)",
          },
        },
        outlined: {
          borderColor: "#e6e4dd",
          color: "#5e5e5e",
          "&:hover": {
            borderColor: "#191919",
            backgroundColor: "rgba(25, 25, 25, 0.02)",
            color: "#191919",
          }
        },
        contained: {
          backgroundColor: "#191919",
          color: "#ffffff",
          "&:hover": {
            backgroundColor: "#2e2e2e",
          }
        }
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px) saturate(180%)",
          boxShadow:
            "0 8px 32px -4px rgba(25, 25, 25, 0.04), 0 2px 12px -2px rgba(25, 25, 25, 0.02)",
          border: "1px solid rgba(230, 228, 221, 0.6)",
          borderRadius: "12px",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        root: {
          "& .MuiBackdrop-root": {
            backgroundColor: "rgba(25, 25, 25, 0.35)",
            backdropFilter: "blur(8px)",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          backdropFilter: "blur(12px) saturate(180%)",
          boxShadow:
            "0 8px 32px -4px rgba(25, 25, 25, 0.04), 0 2px 12px -2px rgba(25, 25, 25, 0.02)",
          border: "1px solid rgba(230, 228, 221, 0.6)",
          borderRadius: "12px",
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: "#ffffff",
          borderRadius: "8px",
          transition: "all 150ms cubic-bezier(0.16, 1, 0.3, 1)",
          "& fieldset": { borderColor: "#e6e4dd" },
          "&:hover fieldset": { borderColor: "#cbd5e1" },
          "&.Mui-focused fieldset": { 
            borderColor: "#191919",
            borderWidth: "1.5px"
          },
          "&.Mui-focused": {
            boxShadow: "0 0 0 3px rgba(25, 25, 25, 0.04)"
          }
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottom: "1px solid #e6e4dd",
          padding: "14px 20px",
          fontSize: "14px",
          color: "#191919"
        },
        head: {
          backgroundColor: "#f3f1eb",
          color: "#5e5e5e",
          fontWeight: 600,
          fontSize: "13px",
          letterSpacing: "0.02em"
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        root: {
          width: 42,
          height: 26,
          padding: 0,
          display: 'inline-flex',
          '& .MuiSwitch-switchBase': {
            padding: 0,
            margin: 2,
            transitionDuration: '300ms',
            '&.Mui-checked': {
              transform: 'translateX(16px)',
              color: '#fff',
              '& + .MuiSwitch-track': {
                backgroundColor: '#34c759', // Apple success green
                opacity: 1,
                border: 0,
              },
              '&.Mui-disabled + .MuiSwitch-track': {
                opacity: 0.5,
              },
            },
            '&.Mui-focusVisible .MuiSwitch-thumb': {
              color: '#34c759',
              border: '6px solid #fff',
            },
            '&.Mui-disabled .MuiSwitch-thumb': {
              color: '#f4f3ef',
            },
            '&.Mui-disabled + .MuiSwitch-track': {
              opacity: 0.7,
            },
          },
          '& .MuiSwitch-thumb': {
            boxSizing: 'border-box',
            width: 22,
            height: 22,
            boxShadow: '0 2px 4px 0 rgba(0, 35, 11, 0.15)',
          },
          '& .MuiSwitch-track': {
            borderRadius: 13,
            backgroundColor: '#e6e4dd',
            opacity: 1,
            transition: 'background-color 500ms',
          },
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
