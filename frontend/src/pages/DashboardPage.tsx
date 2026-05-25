import { useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  Typography,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import InventoryIcon from '@mui/icons-material/Inventory';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getOrders } from '../api/orders';
import { getCoupons } from '../api/coupons';
import { getProducts } from '../api/products';
import type { CouponResponse, OrderResponse, Product } from '../types';

function formatCurrency(value: number) {
  return `INR ${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  accent,
}: {
  title: string;
  value: string;
  subtitle: string;
  icon: ReactNode;
  accent: string;
}) {
  return (
    <Card sx={{ borderRadius: 3, border: '1px solid #dbe3ef', height: '100%' }}>
      <Box sx={{ height: 4, background: accent }} />
      <CardContent>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>
            <Typography variant="caption" color="text.secondary">{title}</Typography>
            <Typography variant="h4" sx={{ fontWeight: 900, lineHeight: 1.1 }}>{value}</Typography>
            <Typography variant="caption" color="text.secondary">{subtitle}</Typography>
          </Box>
          <Box sx={{ color: accent }}>{icon}</Box>
        </Stack>
      </CardContent>
    </Card>
  );
}

function ActionCard({ title, description, to, cta }: { title: string; description: string; to: string; cta: string }) {
  return (
    <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', p: 2.25 }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>{title}</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 2 }}>{description}</Typography>
      <Button component={Link} to={to} variant="contained">{cta}</Button>
    </Paper>
  );
}

export default function DashboardPage() {
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [coupons, setCoupons] = useState<CouponResponse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOrders(), getCoupons(), getProducts()])
      .then(([o, c, p]) => {
        setOrders(o);
        setCoupons(c);
        setProducts(p);
      })
      .catch(() => {
        toast.error('Unable to load dashboard metrics');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const totalRevenue = useMemo(
    () => orders.filter((o) => o.status === 'DELIVERED').reduce((sum, o) => sum + Number(o.totalAmount ?? 0), 0),
    [orders]
  );

  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;
  const activeCoupons = coupons.filter((c) => c.active).length;

  if (loading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1480, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3.5 },
          borderRadius: 4,
          color: 'white',
          background: 'linear-gradient(120deg, #0f172a 0%, #1e3a8a 55%, #0ea5e9 100%)',
          boxShadow: '0 18px 34px rgba(30, 64, 175, 0.24)',
          mb: 3,
        }}
      >
        <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.85 }}>ADMIN OVERVIEW</Typography>
        <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5 }}>Retail Operations Dashboard</Typography>
        <Typography sx={{ mt: 1.2, opacity: 0.92, maxWidth: 760 }}>
          Monitor order flow, product health, and coupon performance with faster admin actions.
        </Typography>
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', mt: 2 }}>
          <Chip label={`${pendingOrders} pending orders`} sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }} />
          <Chip label={`${activeCoupons} active coupons`} sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }} />
          <Chip label={`${products.length} products live`} sx={{ bgcolor: 'rgba(255,255,255,0.15)', color: 'white' }} />
        </Stack>
      </Paper>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(4, minmax(0, 1fr))' }, gap: 2.5, mb: 3 }}>
        <StatCard title="Total Orders" value={String(orders.length)} subtitle={`${pendingOrders} pending`} icon={<ShoppingCartIcon />} accent="#6366f1" />
        <StatCard title="Delivered Revenue" value={formatCurrency(totalRevenue)} subtitle="From delivered orders" icon={<TrendingUpIcon />} accent="#16a34a" />
        <StatCard title="Products" value={String(products.length)} subtitle="In catalogue" icon={<InventoryIcon />} accent="#f59e0b" />
        <StatCard title="Active Coupons" value={String(activeCoupons)} subtitle={`${coupons.length} total`} icon={<LocalOfferIcon />} accent="#ec4899" />
      </Box>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', lg: '1.4fr 1fr' }, gap: 2.5 }}>
        <Paper elevation={0} sx={{ borderRadius: 3, border: '1px solid', borderColor: 'divider', p: 2.5 }}>
          <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Recent Orders</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Latest {Math.min(orders.length, 6)} records</Typography>
          <Divider sx={{ mb: 1.5 }} />
          {orders.length === 0 ? (
            <Typography variant="body2" color="text.secondary">No orders available.</Typography>
          ) : (
            <Stack spacing={0.6}>
              {orders.slice(0, 6).map((order) => (
                <Box
                  key={order.id}
                  sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1.2,
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: 'divider',
                  }}
                >
                  <Box>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Order #{order.id}</Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(order.placedAt).toLocaleString('en-IN')}</Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(Number(order.totalAmount ?? 0))}</Typography>
                    <Chip label={order.status} size="small" variant="outlined" />
                  </Box>
                </Box>
              ))}
            </Stack>
          )}
        </Paper>

        <Stack spacing={2.5}>
          <ActionCard title="Manage Orders" description="Accept or reject pending orders and trigger customer status email notifications." to="/orders" cta="Open Orders" />
          <ActionCard title="Manage Products" description="Create and maintain product records with inventory control." to="/products" cta="Open Items" />
          <ActionCard title="Manage Coupons" description="Create coupons and notify users about new offers." to="/coupons" cta="Open Coupons" />
        </Stack>
      </Box>
    </Box>
  );
}
