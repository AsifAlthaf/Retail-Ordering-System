import { useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Box,
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
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/AuthContext';
import { getOrders } from '../api/orders';
import { getCoupons } from '../api/coupons';
import type { CouponResponse, OrderResponse } from '../types';

function currency(value: number) {
  return `INR ${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

export default function UserDashboardPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [coupons, setCoupons] = useState<CouponResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getOrders(), getCoupons()])
      .then(([orderList, couponList]) => {
        setOrders(orderList);
        setCoupons(couponList);
      })
      .finally(() => setLoading(false));
  }, []);

  const deliveredTotal = useMemo(
    () => orders.filter((o) => o.status === 'DELIVERED').reduce((sum, o) => sum + Number(o.totalAmount ?? 0), 0),
    [orders]
  );

  const activeCoupons = coupons.filter((c) => c.active).length;
  const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;

  if (loading) {
    return (
      <Box sx={{ minHeight: '50vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1280, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 3.2 },
          borderRadius: 4,
          color: 'white',
          background: 'linear-gradient(120deg, #111827 0%, #1d4ed8 100%)',
          mb: 3,
        }}
      >
        <Typography variant="overline" sx={{ letterSpacing: 2, opacity: 0.8 }}>CUSTOMER OVERVIEW</Typography>
        <Typography variant="h4" sx={{ fontWeight: 900, mt: 0.5 }}>Welcome, {user?.name ?? 'User'}</Typography>
        <Typography sx={{ mt: 1, opacity: 0.92 }}>
          Track your orders and apply available offers from one place.
        </Typography>
      </Paper>

      <Alert severity="info" sx={{ mb: 2.5 }}>
        You are logged in as a user account. Coupon announcements and order status emails will be sent automatically.
      </Alert>

      <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, minmax(0, 1fr))' }, gap: 2.5, mb: 3 }}>
        <Card>
          <CardContent>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Orders</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>{orders.length}</Typography>
                <Typography variant="caption" color="text.secondary">{pendingOrders} pending</Typography>
              </Box>
              <ShoppingCartIcon color="primary" />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Total Spent</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>{currency(deliveredTotal)}</Typography>
                <Typography variant="caption" color="text.secondary">Delivered orders</Typography>
              </Box>
              <AccountCircleIcon color="success" />
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Active Coupons</Typography>
                <Typography variant="h4" sx={{ fontWeight: 900 }}>{activeCoupons}</Typography>
                <Typography variant="caption" color="text.secondary">Use them at checkout</Typography>
              </Box>
              <LocalOfferIcon color="secondary" />
            </Stack>
          </CardContent>
        </Card>
      </Box>

      <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.5 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 800 }}>Recent Orders</Typography>
        <Divider sx={{ my: 1.5 }} />
        {orders.length === 0 ? (
          <Typography variant="body2" color="text.secondary">No orders yet.</Typography>
        ) : (
          <Stack spacing={1}>
            {orders.slice(0, 8).map((order) => (
              <Box key={order.id} sx={{ p: 1.2, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
                <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>Order #{order.id}</Typography>
                  <Chip label={order.status} size="small" variant="outlined" />
                </Stack>
                <Typography variant="caption" color="text.secondary">{new Date(order.placedAt).toLocaleString('en-IN')}</Typography>
              </Box>
            ))}
          </Stack>
        )}
      </Paper>
    </Box>
  );
}
