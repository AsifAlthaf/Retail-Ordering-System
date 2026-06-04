import { Box, Typography } from '@mui/material';
import type { OrderStatus } from '../types';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string; border: string; dot: string }> = {
  PENDING:   { label: 'Pending',   color: '#fbbf24', bg: 'rgba(245,158,11,0.12)',  border: 'rgba(245,158,11,0.25)',  dot: '#f59e0b' },
  CONFIRMED: { label: 'Confirmed', color: '#60a5fa', bg: 'rgba(59,130,246,0.12)',  border: 'rgba(59,130,246,0.25)',  dot: '#3b82f6' },
  SHIPPED:   { label: 'Shipped',   color: '#a78bfa', bg: 'rgba(139,92,246,0.12)',  border: 'rgba(139,92,246,0.25)',  dot: '#8b5cf6' },
  DELIVERED: { label: 'Delivered', color: '#34d399', bg: 'rgba(16,185,129,0.12)',  border: 'rgba(16,185,129,0.25)',  dot: '#10b981' },
  CANCELLED: { label: 'Cancelled', color: '#f87171', bg: 'rgba(239,68,68,0.12)',   border: 'rgba(239,68,68,0.25)',   dot: '#ef4444' },
};

interface StatusBadgeProps {
  status: OrderStatus;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export default function StatusBadge({ status, size = 'md', onClick }: StatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.PENDING;
  const isSmall = size === 'sm';

  return (
    <Box
      onClick={onClick}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 0.625,
        px: isSmall ? 1 : 1.25,
        py: isSmall ? 0.375 : 0.5,
        borderRadius: 99,
        background: cfg.bg,
        border: `1px solid ${cfg.border}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 150ms ease',
        userSelect: 'none',
        '&:hover': onClick ? { filter: 'brightness(1.15)' } : {},
      }}
    >
      <Box
        sx={{
          width: isSmall ? 5 : 6,
          height: isSmall ? 5 : 6,
          borderRadius: '50%',
          background: cfg.dot,
          flexShrink: 0,
          animation: status === 'PENDING' ? 'blink 2s ease-in-out infinite' : 'none',
          '@keyframes blink': {
            '0%, 100%': { opacity: 1 },
            '50%': { opacity: 0.35 },
          },
        }}
      />
      <Typography
        sx={{
          fontSize: isSmall ? 10.5 : 11.5,
          fontWeight: 700,
          color: cfg.color,
          lineHeight: 1,
          letterSpacing: '0.02em',
        }}
      >
        {cfg.label}
      </Typography>
    </Box>
  );
}
