import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box, Button, Chip, IconButton, Paper, Skeleton,
  Stack, Typography, Tooltip,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import RefreshIcon from '@mui/icons-material/Refresh';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Link } from 'react-router-dom';
import { getOrders } from '../api/orders';
import { getCoupons } from '../api/coupons';
import { getProducts } from '../api/products';
import type { CouponResponse, OrderResponse, Product } from '../types';
import StatusBadge from '../components/StatusBadge';
import notify from '../utils/notify';

function formatINR(value: number) { return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`; }

function StatCard({ title, value, icon, color }: { title: string; value: string; icon: React.ReactNode; color: string }) {
  return (
    <Paper sx={{ p: 2.5, borderRadius: '8px' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography sx={{ fontSize: 12, fontWeight: 600, color: 'text.secondary', textTransform: 'uppercase' }}>{title}</Typography>
          <Typography sx={{ fontSize: 28, fontWeight: 700, mt: 0.5 }}>{value}</Typography>
        </Box>
        <Box sx={{ color }}>{icon}</Box>
      </Box>
    </Paper>
  );
}

export default function DashboardPage() {
  const [orders, setOrders]     = useState<OrderResponse[]>([]);
  const [coupons, setCoupons]   = useState<CouponResponse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [o, c, p] = await Promise.all([getOrders(), getCoupons(), getProducts()]);
      setOrders(o); setCoupons(c); setProducts(p);
    } catch {
      notify.error('Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const totalRevenue = useMemo(() => orders.filter(o => o.status === 'DELIVERED').reduce((s, o) => s + Number(o.totalAmount ?? 0), 0), [orders]);

  const activeCoupons = useMemo(() => coupons.filter(c => c.active).length, [coupons]);

  const statusGroups = useMemo(() => {
    const counts: Record<string, number> = {};
    orders.forEach(o => { counts[o.status] = (counts[o.status] ?? 0) + 1; });
    return counts;
  }, [orders]);

  if (loading) {
    return (
      <Box>
        <Skeleton width={200} height={32} sx={{ mb: 3 }} />
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, mb: 3 }}>
          {[1,2,3,4].map(i => <Skeleton key={i} height={100} variant="rounded" />)}
        </Box>
      </Box>
    );
  }

  const recentOrders = [...orders].sort((a, b) => b.id - a.id).slice(0, 8);

  return (
    <Box sx={{ maxWidth: 1200 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">Operations Dashboard</Typography>
        <Tooltip title="Refresh">
          <IconButton size="small" onClick={() => load()} sx={{ color: 'text.secondary' }}>
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr 1fr', md: 'repeat(4, 1fr)' }, gap: 2, mb: 3 }}>
        <StatCard title="Total Orders" value={String(orders.length)} icon={<ShoppingCartIcon />} color="#0f172a" />
        <StatCard title="Revenue" value={formatINR(totalRevenue)} icon={<TrendingUpIcon />} color="#10b981" />
        <StatCard title="Products" value={String(products.length)} icon={<InventoryIcon />} color="#f59e0b" />
        <StatCard title="Active Coupons" value={String(activeCoupons)} icon={<LocalOfferIcon />} color="#3b82f6" />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' }, gap: 3 }}>
        <Paper sx={{ borderRadius: '8px' }}>
          <Box sx={{ px: 2.5, py: 2, borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography sx={{ fontWeight: 600 }}>Recent Orders</Typography>
            <Button component={Link} to="/orders" size="small" endIcon={<OpenInNewIcon fontSize="small" />}>View all</Button>
          </Box>
          {recentOrders.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>No orders yet</Box>
          ) : (
            <Box>
              {recentOrders.map((o, i) => (
                <Box key={o.id} sx={{ display: 'flex', alignItems: 'center', p: 2, borderBottom: i < recentOrders.length - 1 ? '1px solid #e2e8f0' : 'none' }}>
                  <Box sx={{ flex: 1 }}>
                    <Typography sx={{ fontWeight: 600, fontSize: 14 }}>Order #{o.id}</Typography>
                    <Typography sx={{ fontSize: 13, color: 'text.secondary' }}>User #{o.userId} · {new Date(o.placedAt).toLocaleDateString('en-IN')}</Typography>
                  </Box>
                  <Typography sx={{ fontWeight: 600, mr: 3 }}>{formatINR(Number(o.totalAmount))}</Typography>
                  <StatusBadge status={o.status} size="sm" />
                </Box>
              ))}
            </Box>
          )}
        </Paper>

        <Stack spacing={3}>
          <Paper sx={{ p: 2.5, borderRadius: '8px' }}>
            <Typography sx={{ fontWeight: 600, mb: 2 }}>Status Overview</Typography>
            <Stack spacing={1.5}>
              {[
                { status: 'PENDING', label: 'Pending', color: '#f59e0b' },
                { status: 'CONFIRMED', label: 'Confirmed', color: '#3b82f6' },
                { status: 'SHIPPED', label: 'Shipped', color: '#8b5cf6' },
                { status: 'DELIVERED', label: 'Delivered', color: '#10b981' },
                { status: 'CANCELLED', label: 'Cancelled', color: '#ef4444' },
              ].map(s => {
                const count = statusGroups[s.status] ?? 0;
                return (
                  <Box key={s.status} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{s.label}</Typography>
                    <Chip label={count} size="small" sx={{ bgcolor: `${s.color}15`, color: s.color, fontWeight: 600 }} />
                  </Box>
                );
              })}
            </Stack>
          </Paper>

          <Paper sx={{ p: 2.5, borderRadius: '8px' }}>
            <Typography sx={{ fontWeight: 600, mb: 2 }}>Quick Actions</Typography>
            <Stack spacing={1}>
              <Button component={Link} to="/orders" variant="outlined" fullWidth sx={{ justifyContent: 'flex-start' }}>Manage Orders</Button>
              <Button component={Link} to="/products" variant="outlined" fullWidth sx={{ justifyContent: 'flex-start' }}>Manage Products</Button>
              <Button component={Link} to="/coupons" variant="outlined" fullWidth sx={{ justifyContent: 'flex-start' }}>Manage Coupons</Button>
            </Stack>
          </Paper>
        </Stack>
      </Box>
    </Box>
  );
}
