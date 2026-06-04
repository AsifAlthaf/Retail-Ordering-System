import { useEffect, useRef, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Avatar, Badge, Box, Divider, IconButton, Stack, Tooltip, Typography } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PersonIcon from '@mui/icons-material/Person';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

interface NavItem {
  label: string;
  to: string;
  icon: React.ReactNode;
  adminOnly?: boolean;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard',  to: '/',         icon: <DashboardIcon fontSize="small" />,    adminOnly: true  },
  { label: 'Products',   to: '/products', icon: <InventoryIcon fontSize="small" />,    adminOnly: true  },
  { label: 'Coupons',    to: '/coupons',  icon: <LocalOfferIcon fontSize="small" />,   adminOnly: true  },
  { label: 'Orders',     to: '/orders',   icon: <ListAltIcon fontSize="small" />,      adminOnly: true  },
  { label: 'Shop',       to: '/shop',     icon: <StorefrontIcon fontSize="small" />,   adminOnly: false },
  { label: 'My Orders',  to: '/my-orders',icon: <ShoppingCartIcon fontSize="small" />, adminOnly: false },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

export function Sidebar({ collapsed, onToggle, mobileOpen, onMobileClose }: SidebarProps) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const overlayRef = useRef<HTMLDivElement>(null);

  const filteredNav = NAV_ITEMS.filter(item =>
    user?.role === 'ADMIN' ? true : !item.adminOnly
  );

  const handleLogout = () => {
    logout();
    toast.info('Signed out successfully.');
    navigate('/login');
  };

  const w = collapsed ? 72 : 260;

  // Close mobile sidebar on outside click
  useEffect(() => {
    if (!mobileOpen) return;
    const handler = (e: MouseEvent) => {
      if (overlayRef.current && overlayRef.current === e.target) onMobileClose();
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [mobileOpen, onMobileClose]);

  const sidebarContent = (
    <Box
      sx={{
        width: w,
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'rgba(10, 14, 26, 0.95)',
        backdropFilter: 'blur(20px)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
        transition: 'width 280ms cubic-bezier(0.4,0,0.2,1)',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 1,
      }}
    >
      {/* Logo + Collapse Toggle */}
      <Box
        sx={{
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          px: collapsed ? 1 : 2,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          flexShrink: 0,
        }}
      >
        {!collapsed && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Box
              sx={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 14,
                fontWeight: 900,
                color: '#fff',
                flexShrink: 0,
                boxShadow: '0 0 16px rgba(99,102,241,0.5)',
              }}
            >
              R
            </Box>
            <Box>
              <Typography sx={{ fontSize: 14, fontWeight: 800, color: '#f1f5f9', lineHeight: 1.1 }}>
                RetailOS
              </Typography>
              <Typography sx={{ fontSize: 10, color: '#475569', fontWeight: 500 }}>
                Operations Hub
              </Typography>
            </Box>
          </Box>
        )}
        {collapsed && (
          <Box
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 14,
              fontWeight: 900,
              color: '#fff',
              boxShadow: '0 0 16px rgba(99,102,241,0.5)',
            }}
          >
            R
          </Box>
        )}
        <Tooltip title={collapsed ? 'Expand' : 'Collapse'} placement="right">
          <IconButton
            onClick={onToggle}
            size="small"
            sx={{
              color: '#475569',
              '&:hover': { color: '#94a3b8', background: 'rgba(255,255,255,0.05)' },
              display: { xs: 'none', md: 'flex' },
              ml: collapsed ? 'auto' : 0,
              flexShrink: 0,
            }}
          >
            {collapsed ? <MenuIcon sx={{ fontSize: 18 }} /> : <ChevronLeftIcon sx={{ fontSize: 18 }} />}
          </IconButton>
        </Tooltip>
      </Box>

      {/* Role Badge */}
      {!collapsed && user && (
        <Box sx={{ px: 2, py: 1.5, borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.5,
              py: 0.5,
              borderRadius: 99,
              background: user.role === 'ADMIN' ? 'rgba(99,102,241,0.15)' : 'rgba(16,185,129,0.15)',
              border: `1px solid ${user.role === 'ADMIN' ? 'rgba(99,102,241,0.3)' : 'rgba(16,185,129,0.3)'}`,
            }}
          >
            {user.role === 'ADMIN'
              ? <AdminPanelSettingsIcon sx={{ fontSize: 11, color: '#818cf8' }} />
              : <PersonIcon sx={{ fontSize: 11, color: '#34d399' }} />}
            <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: user.role === 'ADMIN' ? '#818cf8' : '#34d399' }}>
              {user.role}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Nav Items */}
      <Box sx={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', py: 1.5, px: collapsed ? 1 : 1.5 }}>
        <Stack spacing={0.25}>
          {filteredNav.map((item) => (
            <Tooltip
              key={item.to}
              title={collapsed ? item.label : ''}
              placement="right"
              arrow
            >
              <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
                onClick={() => onMobileClose()}
                style={{
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  padding: collapsed ? '10px' : '10px 14px',
                }}
              >
                <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center' }}>
                  {item.badge != null && item.badge > 0 ? (
                    <Badge badgeContent={item.badge} color="error">
                      {item.icon}
                    </Badge>
                  ) : item.icon}
                </Box>
                {!collapsed && (
                  <span style={{ fontSize: '13.5px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.label}
                  </span>
                )}
              </NavLink>
            </Tooltip>
          ))}
        </Stack>
      </Box>

      <Divider sx={{ borderColor: 'rgba(255,255,255,0.06)' }} />

      {/* User Profile */}
      <Box sx={{ p: collapsed ? 1 : 1.5, flexShrink: 0 }}>
        {collapsed ? (
          <Stack spacing={0.75} alignItems="center">
            <Tooltip title={user?.name ?? ''} placement="right">
              <Avatar
                sx={{ width: 34, height: 34, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontSize: 13, fontWeight: 700 }}
              >
                {user?.name?.charAt(0) ?? '?'}
              </Avatar>
            </Tooltip>
            <Tooltip title="Sign out" placement="right">
              <IconButton
                size="small"
                onClick={handleLogout}
                sx={{ color: '#ef4444', '&:hover': { background: 'rgba(239,68,68,0.1)' } }}
              >
                <LogoutIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Stack>
        ) : (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.25,
              p: 1.25,
              borderRadius: '10px',
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.06)',
            }}
          >
            <Avatar
              sx={{ width: 34, height: 34, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', fontSize: 13, fontWeight: 700, flexShrink: 0 }}
            >
              {user?.name?.charAt(0) ?? '?'}
            </Avatar>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#f1f5f9', lineHeight: 1.2 }} noWrap>
                {user?.name}
              </Typography>
              <Typography sx={{ fontSize: 11, color: '#475569' }} noWrap>
                {user?.email}
              </Typography>
            </Box>
            <Tooltip title="Sign out">
              <IconButton
                size="small"
                onClick={handleLogout}
                sx={{ color: '#64748b', flexShrink: 0, '&:hover': { color: '#ef4444', background: 'rgba(239,68,68,0.1)' } }}
              >
                <LogoutIcon sx={{ fontSize: 16 }} />
              </IconButton>
            </Tooltip>
          </Box>
        )}
      </Box>
    </Box>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <Box sx={{ display: { xs: 'none', md: 'block' }, flexShrink: 0, width: w, transition: 'width 280ms cubic-bezier(0.4,0,0.2,1)' }}>
        <Box sx={{ position: 'fixed', top: 0, left: 0, height: '100vh', zIndex: 200 }}>
          {sidebarContent}
        </Box>
      </Box>

      {/* Mobile drawer */}
      {mobileOpen && (
        <Box
          ref={overlayRef}
          sx={{
            display: { xs: 'flex', md: 'none' },
            position: 'fixed',
            inset: 0,
            zIndex: 400,
            background: 'rgba(0,0,0,0.65)',
            backdropFilter: 'blur(4px)',
          }}
        >
          <Box sx={{ animation: 'slideInLeft 200ms ease both' }}>
            {sidebarContent}
          </Box>
        </Box>
      )}
    </>
  );
}
