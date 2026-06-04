import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import './index.css';
import App from './App.tsx';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary:    { main: '#6366f1', light: '#818cf8', dark: '#4f46e5', contrastText: '#fff' },
    secondary:  { main: '#8b5cf6', light: '#a78bfa', dark: '#7c3aed', contrastText: '#fff' },
    success:    { main: '#10b981', light: '#34d399', dark: '#059669', contrastText: '#fff' },
    warning:    { main: '#f59e0b', light: '#fbbf24', dark: '#d97706', contrastText: '#000' },
    error:      { main: '#ef4444', light: '#f87171', dark: '#dc2626', contrastText: '#fff' },
    info:       { main: '#3b82f6', light: '#60a5fa', dark: '#2563eb', contrastText: '#fff' },
    background: { default: '#060b14', paper: '#111827' },
    text:       { primary: '#f1f5f9', secondary: '#94a3b8', disabled: '#475569' },
    divider:    'rgba(255,255,255,0.07)',
    action: {
      hover:    'rgba(255,255,255,0.05)',
      selected: 'rgba(99,102,241,0.12)',
      disabled: 'rgba(255,255,255,0.2)',
      focus:    'rgba(99,102,241,0.15)',
    },
  },
  typography: {
    fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
    h1: { fontWeight: 900, letterSpacing: '-0.025em' },
    h2: { fontWeight: 900, letterSpacing: '-0.025em' },
    h3: { fontWeight: 800, letterSpacing: '-0.02em' },
    h4: { fontWeight: 800, letterSpacing: '-0.02em' },
    h5: { fontWeight: 700, letterSpacing: '-0.015em' },
    h6: { fontWeight: 700, letterSpacing: '-0.01em' },
    subtitle1: { fontWeight: 600 },
    subtitle2: { fontWeight: 600 },
    body1: { lineHeight: 1.65 },
    body2: { lineHeight: 1.6 },
    button: { fontWeight: 600, letterSpacing: '0.01em', textTransform: 'none' },
    overline: { fontWeight: 700, letterSpacing: '0.12em', fontSize: '10.5px' },
    caption: { fontSize: '11.5px', color: '#94a3b8' },
  },
  shape: { borderRadius: 10 },
  shadows: [
    'none',
    '0 1px 3px rgba(0,0,0,0.4)',
    '0 2px 6px rgba(0,0,0,0.4)',
    '0 4px 12px rgba(0,0,0,0.5)',
    '0 6px 16px rgba(0,0,0,0.5)',
    '0 8px 20px rgba(0,0,0,0.5)',
    '0 10px 24px rgba(0,0,0,0.5)',
    '0 12px 28px rgba(0,0,0,0.55)',
    '0 14px 32px rgba(0,0,0,0.55)',
    '0 16px 36px rgba(0,0,0,0.6)',
    '0 18px 40px rgba(0,0,0,0.6)',
    '0 20px 44px rgba(0,0,0,0.6)',
    '0 22px 48px rgba(0,0,0,0.6)',
    '0 24px 52px rgba(0,0,0,0.65)',
    '0 26px 56px rgba(0,0,0,0.65)',
    '0 28px 60px rgba(0,0,0,0.65)',
    '0 30px 64px rgba(0,0,0,0.7)',
    '0 32px 68px rgba(0,0,0,0.7)',
    '0 34px 72px rgba(0,0,0,0.7)',
    '0 36px 76px rgba(0,0,0,0.7)',
    '0 38px 80px rgba(0,0,0,0.7)',
    '0 40px 84px rgba(0,0,0,0.7)',
    '0 42px 88px rgba(0,0,0,0.72)',
    '0 44px 92px rgba(0,0,0,0.72)',
    '0 46px 96px rgba(0,0,0,0.72)',
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: '#060b14',
          backgroundImage: 'radial-gradient(ellipse at 10% 0%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(ellipse at 90% 100%, rgba(139,92,246,0.06) 0%, transparent 50%)',
          backgroundAttachment: 'fixed',
        },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          fontWeight: 600,
          fontSize: '13.5px',
          textTransform: 'none',
          transition: 'all 200ms cubic-bezier(0.4,0,0.2,1)',
          '&:active': { transform: 'scale(0.97)' },
        },
        contained: {
          background: 'linear-gradient(135deg, #6366f1 0%, #7c3aed 100%)',
          boxShadow: '0 0 0 0 rgba(99,102,241,0)',
          '&:hover': {
            background: 'linear-gradient(135deg, #4f52d4 0%, #6d28d9 100%)',
            boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderColor: 'rgba(255,255,255,0.12)',
          '&:hover': {
            borderColor: '#6366f1',
            background: 'rgba(99,102,241,0.08)',
          },
        },
        containedError: {
          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)' },
        },
        containedSuccess: {
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          '&:hover': { background: 'linear-gradient(135deg, #059669 0%, #047857 100%)' },
        },
        sizeSmall: { fontSize: '12px', padding: '5px 12px' },
        sizeLarge: { fontSize: '15px', padding: '12px 28px' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: '#111827',
          border: '1px solid rgba(255,255,255,0.07)',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          background: '#111827',
          backgroundImage: 'none',
          border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 14,
          transition: 'transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease',
          '&:hover': { borderColor: 'rgba(99,102,241,0.3)' },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: '11.5px',
          borderRadius: 6,
        },
        colorSuccess: { background: 'rgba(16,185,129,0.15)', color: '#34d399', border: '1px solid rgba(16,185,129,0.25)' },
        colorWarning: { background: 'rgba(245,158,11,0.15)', color: '#fbbf24', border: '1px solid rgba(245,158,11,0.25)' },
        colorError:   { background: 'rgba(239,68,68,0.15)',  color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' },
        colorInfo:    { background: 'rgba(59,130,246,0.15)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.25)' },
        colorPrimary: { background: 'rgba(99,102,241,0.15)', color: '#818cf8', border: '1px solid rgba(99,102,241,0.25)' },
      },
    },
    MuiTextField: {
      defaultProps: { variant: 'outlined' },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.03)',
          borderRadius: 8,
          fontSize: '13.5px',
          transition: 'all 200ms ease',
          '& fieldset': { borderColor: 'rgba(255,255,255,0.1)', transition: 'border-color 200ms ease' },
          '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.22)' },
          '&.Mui-focused': { background: 'rgba(99,102,241,0.04)' },
          '&.Mui-focused fieldset': { borderColor: '#6366f1', borderWidth: '1.5px' },
        },
        input: { '&::placeholder': { color: '#475569', opacity: 1 } },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: '13.5px',
          color: '#64748b',
          '&.Mui-focused': { color: '#6366f1' },
        },
      },
    },
    MuiTableHead: {
      styleOverrides: {
        root: {
          '& .MuiTableCell-root': {
            background: 'rgba(255,255,255,0.04)',
            color: '#94a3b8',
            fontWeight: 600,
            fontSize: '11.5px',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          },
        },
      },
    },
    MuiTableBody: {
      styleOverrides: {
        root: {
          '& .MuiTableRow-root': {
            transition: 'background 150ms ease',
            '& .MuiTableCell-root': {
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              fontSize: '13.5px',
            },
            '&:hover': { background: 'rgba(255,255,255,0.03) !important' },
          },
        },
      },
    },
    MuiTableContainer: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.07)',
          background: '#111827',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          background: '#111827',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 16,
          boxShadow: '0 30px 80px rgba(0,0,0,0.7)',
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '16px',
          fontWeight: 700,
          padding: '20px 24px 12px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: { padding: '20px 24px' },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '12px 24px 20px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          gap: 8,
        },
      },
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          background: '#1e293b',
          color: '#f1f5f9',
          fontSize: '12px',
          fontWeight: 500,
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 6,
          padding: '5px 10px',
        },
        arrow: { color: '#1e293b' },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          background: '#1a2235',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 10,
          boxShadow: '0 16px 40px rgba(0,0,0,0.6)',
          minWidth: 160,
        },
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          fontSize: '13.5px',
          fontWeight: 500,
          borderRadius: 6,
          margin: '2px 6px',
          transition: 'all 150ms ease',
          '&:hover': { background: 'rgba(99,102,241,0.12)', color: '#818cf8' },
          '&.Mui-selected': { background: 'rgba(99,102,241,0.15)', color: '#818cf8' },
        },
      },
    },
    MuiSwitch: {
      styleOverrides: {
        switchBase: {
          '&.Mui-checked': { color: '#10b981' },
          '&.Mui-checked + .MuiSwitch-track': { background: '#10b981' },
        },
        track: { background: 'rgba(255,255,255,0.15)' },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: { borderRadius: 99, background: 'rgba(255,255,255,0.08)', height: 6 },
        bar:  { borderRadius: 99 },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: { borderRadius: 10, fontSize: '13px', fontWeight: 500 },
        standardError:   { background: 'rgba(239,68,68,0.12)',   border: '1px solid rgba(239,68,68,0.25)' },
        standardSuccess: { background: 'rgba(16,185,129,0.12)',  border: '1px solid rgba(16,185,129,0.25)' },
        standardWarning: { background: 'rgba(245,158,11,0.12)',  border: '1px solid rgba(245,158,11,0.25)' },
        standardInfo:    { background: 'rgba(59,130,246,0.12)',  border: '1px solid rgba(59,130,246,0.25)' },
      },
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: 'rgba(255,255,255,0.07)' } },
    },
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontSize: '13px',
          fontWeight: 700,
          border: '2px solid rgba(99,102,241,0.3)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: 'all 150ms ease',
          '&:hover': { background: 'rgba(255,255,255,0.07)' },
        },
      },
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.06)',
          '&::after': {
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.06), transparent)',
          },
        },
      },
    },
    MuiBadge: {
      styleOverrides: {
        badge: {
          fontWeight: 700,
          fontSize: '10px',
          minWidth: 18,
          height: 18,
          padding: '0 5px',
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        icon: { color: '#64748b' },
      },
    },
    MuiFormHelperText: {
      styleOverrides: {
        root: { fontSize: '11.5px', marginTop: 4 },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: { padding: '12px 16px' },
      },
    },
  },
});

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
);
