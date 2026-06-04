import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Box, IconButton, Tooltip } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { Toaster } from 'react-hot-toast';

import { AuthProvider, useAuth } from './context/AuthContext';
import { Sidebar } from './components/Sidebar';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DashboardPage from './pages/DashboardPage';
import ShopPage from './pages/ShopPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import CouponsPage from './pages/CouponsPage';
import OrderNotificationPage from './pages/OrderNotificationPage';

// ─── Route Guards ─────────────────────────────────────────────────────────────
function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode; adminOnly?: boolean }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (adminOnly && user?.role !== 'ADMIN') return <Navigate to="/shop" replace />;
  return <>{children}</>;
}

// ─── Main authenticated layout ────────────────────────────────────────────────
function AppLayout() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const sidebarWidth = collapsed ? 72 : 260;

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', background: '#060b14' }}>
      <Sidebar
        collapsed={collapsed}
        onToggle={() => setCollapsed(c => !c)}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
      />

      {/* Main content area */}
      <Box
        sx={{
          flex: 1,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          ml: { xs: 0, md: `${sidebarWidth}px` },
          transition: 'margin-left 280ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Mobile top bar */}
        <Box
          sx={{
            display: { xs: 'flex', md: 'none' },
            alignItems: 'center',
            height: 56,
            px: 2,
            gap: 1.5,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            background: 'rgba(10,14,26,0.95)',
            backdropFilter: 'blur(20px)',
            position: 'sticky',
            top: 0,
            zIndex: 100,
            flexShrink: 0,
          }}
        >
          <Tooltip title="Open menu">
            <IconButton
              size="small"
              onClick={() => setMobileOpen(true)}
              sx={{ color: '#94a3b8', '&:hover': { color: '#f1f5f9' } }}
            >
              <MenuIcon />
            </IconButton>
          </Tooltip>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flex: 1,
            }}
          >
            <Box
              sx={{
                width: 26,
                height: 26,
                borderRadius: '7px',
                background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 900,
                color: '#fff',
              }}
            >
              R
            </Box>
            <Box sx={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9' }}>RetailOS</Box>
          </Box>
        </Box>

        {/* Page content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 2, md: 3 },
            maxWidth: '100%',
            overflowX: 'hidden',
          }}
        >
          <Routes>
            {/* Admin-only */}
            <Route path="/" element={<ProtectedRoute adminOnly><DashboardPage /></ProtectedRoute>} />
            <Route path="/products" element={<ProtectedRoute adminOnly><ProductsPage /></ProtectedRoute>} />
            <Route path="/coupons" element={<ProtectedRoute adminOnly><CouponsPage /></ProtectedRoute>} />
            <Route path="/orders" element={<ProtectedRoute adminOnly><OrdersPage /></ProtectedRoute>} />

            {/* Shared */}
            <Route path="/order-notification" element={<ProtectedRoute><OrderNotificationPage /></ProtectedRoute>} />

            {/* User */}
            <Route path="/shop" element={<ProtectedRoute><ShopPage /></ProtectedRoute>} />
            <Route path="/my-orders" element={<ProtectedRoute><ShopPage /></ProtectedRoute>} />

            {/* Fallback per role */}
            <Route path="*" element={
              user?.role === 'ADMIN' ? <Navigate to="/" replace /> : <Navigate to="/shop" replace />
            } />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

// ─── Root router ──────────────────────────────────────────────────────────────
function AppRoutes() {
  const { isAuthenticated, user } = useAuth();
  return (
    <Routes>
      <Route
        path="/login"
        element={isAuthenticated
          ? <Navigate to={user?.role === 'ADMIN' ? '/' : '/shop'} replace />
          : <LoginPage />}
      />
      <Route
        path="/signup"
        element={isAuthenticated
          ? <Navigate to={user?.role === 'ADMIN' ? '/' : '/shop'} replace />
          : <SignUpPage />}
      />
      <Route path="/*" element={
        isAuthenticated ? <AppLayout /> : <Navigate to="/login" replace />
      } />
    </Routes>
  );
}

// ─── App root ─────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />

        {/* react-hot-toast portal */}
        <Toaster
          position="bottom-right"
          gutter={10}
          containerStyle={{ bottom: 24, right: 24 }}
          toastOptions={{
            duration: 3500,
            style: {
              background: '#1a2235',
              color: '#f1f5f9',
              border: '1px solid rgba(255,255,255,0.09)',
              borderRadius: '12px',
              fontSize: '13.5px',
              fontWeight: 500,
              fontFamily: '"Inter", system-ui, sans-serif',
              padding: '12px 16px',
              boxShadow: '0 16px 40px rgba(0,0,0,0.55)',
              maxWidth: '380px',
            },
            success: {
              iconTheme: { primary: '#10b981', secondary: '#111827' },
              style: {
                background: '#1a2235',
                color: '#f1f5f9',
                border: '1px solid rgba(255,255,255,0.09)',
                borderLeft: '3px solid #10b981',
                borderRadius: '12px',
                fontSize: '13.5px',
                fontWeight: 500,
                fontFamily: '"Inter", system-ui, sans-serif',
                padding: '12px 16px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.55)',
              },
            },
            error: {
              duration: 5000,
              iconTheme: { primary: '#ef4444', secondary: '#111827' },
              style: {
                background: '#1a2235',
                color: '#f1f5f9',
                border: '1px solid rgba(255,255,255,0.09)',
                borderLeft: '3px solid #ef4444',
                borderRadius: '12px',
                fontSize: '13.5px',
                fontWeight: 500,
                fontFamily: '"Inter", system-ui, sans-serif',
                padding: '12px 16px',
                boxShadow: '0 16px 40px rgba(0,0,0,0.55)',
              },
            },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  );
}
