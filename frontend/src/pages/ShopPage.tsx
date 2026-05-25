import { useEffect, useMemo, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Divider,
  Paper,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReplayIcon from '@mui/icons-material/Replay';
import SellIcon from '@mui/icons-material/Sell';
import { toast } from 'react-toastify';

import { useAuth } from '../context/AuthContext';
import { createOrder, getOrdersByUser } from '../api/orders';
import { getProducts } from '../api/products';
import { getInventory } from '../api/inventory';
import { getCoupons, getCouponByCode } from '../api/coupons';
import CouponSuccessPopup from '../components/CouponSuccessPopup';
import type { CouponResponse, OrderResponse, Product } from '../types';

interface CartLine {
  productId: number;
  quantity: number;
}

interface DeliveryForm {
  line1: string;
  landmark: string;
  city: string;
  state: string;
  postalCode: string;
}

const CART_STORAGE_PREFIX = 'retail_shop_cart_';
const DELIVERY_STORAGE_PREFIX = 'retail_delivery_';
const COUPON_SEEN_PREFIX = 'retail_seen_coupon_';

function formatCurrency(value: number) {
  return `INR ${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

function toErrorMessage(error: any, fallback: string) {
  return error?.response?.data?.message || error?.message || fallback;
}

function imageForProduct(productId: number) {
  return `https://picsum.photos/seed/retail-product-${productId}/840/560`;
}

function normalizeStatus(status: string) {
  return status.replace('_', ' ');
}

export default function ShopPage() {
  const { user } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [coupons, setCoupons] = useState<CouponResponse[]>([]);
  const [inventory, setInventory] = useState<Record<number, number | null>>({});

  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<CouponResponse | null>(null);
  const [discountAmount, setDiscountAmount] = useState(0);

  const [delivery, setDelivery] = useState<DeliveryForm>({
    line1: '',
    landmark: '',
    city: '',
    state: '',
    postalCode: '',
  });

  useEffect(() => {
    if (!user) return;

    setDelivery((current) => {
      const next = {
        line1: user.address?.trim() || current.line1,
        landmark: current.landmark,
        city: user.city?.trim() || current.city,
        state: user.state?.trim() || current.state,
        postalCode: user.postalCode?.trim() || current.postalCode,
      };

      return next.line1 === current.line1
        && next.city === current.city
        && next.state === current.state
        && next.postalCode === current.postalCode
        ? current
        : next;
    });
  }, [user]);

  const [popup, setPopup] = useState<{
    open: boolean;
    title: string;
    description: string;
    code: string;
    label: string;
    value: string;
  }>({
    open: false,
    title: '',
    description: '',
    code: '',
    label: '',
    value: '',
  });

  const productMap = useMemo(() => Object.fromEntries(products.map((p) => [p.id, p])), [products]);

  const filteredProducts = useMemo(
    () => products.filter((p) => p.name.toLowerCase().includes(search.toLowerCase())),
    [products, search]
  );

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);

  const subtotal = useMemo(
    () => cart.reduce((sum, line) => sum + (productMap[line.productId]?.price ?? 0) * line.quantity, 0),
    [cart, productMap]
  );

  const payable = Math.max(subtotal - discountAmount, 0);

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) ?? orders[0] ?? null,
    [orders, selectedOrderId]
  );

  const load = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const [productList, orderList, couponList] = await Promise.all([
        getProducts(),
        getOrdersByUser(user.id),
        getCoupons(),
      ]);

      setProducts(productList);
      setOrders(orderList.sort((a, b) => b.id - a.id));
      setCoupons(couponList);
      setSelectedOrderId((existing) => existing ?? orderList[0]?.id ?? null);

      const inventoryEntries = await Promise.all(
        productList.map(async (product) => {
          try {
            const value = await getInventory(product.id);
            return [product.id, value.quantity] as const;
          } catch {
            return [product.id, null] as const;
          }
        })
      );
      setInventory(Object.fromEntries(inventoryEntries));
    } catch (error) {
      toast.error(toErrorMessage(error, 'Failed to load shop data.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    try {
      const storedCart = sessionStorage.getItem(`${CART_STORAGE_PREFIX}${user.id}`);
      const storedDelivery = sessionStorage.getItem(`${DELIVERY_STORAGE_PREFIX}${user.id}`);
      setCart(storedCart ? (JSON.parse(storedCart) as CartLine[]) : []);
      if (storedDelivery) {
        setDelivery(JSON.parse(storedDelivery) as DeliveryForm);
      }
    } catch {
      setCart([]);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    sessionStorage.setItem(`${CART_STORAGE_PREFIX}${user.id}`, JSON.stringify(cart));
  }, [cart, user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    sessionStorage.setItem(`${DELIVERY_STORAGE_PREFIX}${user.id}`, JSON.stringify(delivery));
  }, [delivery, user?.id]);

  useEffect(() => {
    if (!user?.id || coupons.length === 0) return;

    const newest = [...coupons]
      .filter((coupon) => coupon.active)
      .sort((a, b) => b.id - a.id)[0];

    if (!newest) return;

    const seenKey = `${COUPON_SEEN_PREFIX}${user.id}`;
    const seenId = Number(sessionStorage.getItem(seenKey) ?? '0');
    if (newest.id <= seenId) return;

    sessionStorage.setItem(seenKey, String(newest.id));
    const offer = newest.type === 'PERCENTAGE'
      ? `${newest.value}% off`
      : `Flat INR ${newest.value} off`;

    setPopup({
      open: true,
      title: 'New Coupon Added',
      description: 'A new coupon is live. Use it in checkout before expiry.',
      code: newest.code,
      label: 'Offer',
      value: offer,
    });
  }, [coupons, user?.id]);

  const setDeliveryField = (key: keyof DeliveryForm, value: string) => {
    setDelivery((current) => ({ ...current, [key]: value }));
  };

  const addToCart = (productId: number) => {
    const product = productMap[productId];
    if (!product) return;

    const stock = inventory[productId];
    if (stock != null && stock <= 0) {
      toast.warning(`${product.name} is out of stock.`);
      return;
    }

    setCart((current) => {
      const existing = current.find((line) => line.productId === productId);
      if (existing) {
        return current.map((line) =>
          line.productId === productId ? { ...line, quantity: line.quantity + 1 } : line
        );
      }
      return [...current, { productId, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: number, nextQuantity: number) => {
    if (nextQuantity <= 0) {
      setCart((current) => current.filter((item) => item.productId !== productId));
      return;
    }

    setCart((current) =>
      current.map((item) => (item.productId === productId ? { ...item, quantity: nextQuantity } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponInput('');
  };

  const validateStock = (lines: CartLine[]) => {
    const unavailable = lines.find((line) => {
      const stock = inventory[line.productId];
      return stock != null && stock < line.quantity;
    });

    if (unavailable) {
      const productName = productMap[unavailable.productId]?.name ?? `Product #${unavailable.productId}`;
      toast.error(`${productName} has insufficient stock.`);
      return false;
    }

    return true;
  };

  const buildDeliveryAddress = () => {
    const requiredFields = [delivery.line1, delivery.city, delivery.state, delivery.postalCode].map((v) => v.trim());
    if (requiredFields.some((v) => !v)) {
      return null;
    }

    if (!/^\d{6}$/.test(delivery.postalCode.trim())) {
      return null;
    }

    return [delivery.line1.trim(), delivery.landmark.trim(), `${delivery.city.trim()}, ${delivery.state.trim()} ${delivery.postalCode.trim()}`]
      .filter(Boolean)
      .join(', ');
  };

  const computeDiscount = (coupon: CouponResponse, orderSubtotal: number) => {
    if (coupon.type === 'PERCENTAGE') {
      return (orderSubtotal * Number(coupon.value)) / 100;
    }
    return Math.min(orderSubtotal, Number(coupon.value));
  };

  const applyCoupon = async () => {
    if (!couponInput.trim()) {
      toast.warning('Enter a coupon code first.');
      return;
    }

    if (subtotal <= 0) {
      toast.warning('Add products to cart before applying coupon.');
      return;
    }

    try {
      const coupon = await getCouponByCode(couponInput.trim().toUpperCase());

      if (!coupon.active) {
        toast.error('Coupon is inactive.');
        return;
      }

      const expiryDate = new Date(coupon.expiryDate);
      const today = new Date();
      if (expiryDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
        toast.error('Coupon is expired.');
        return;
      }

      if (coupon.usageLimit != null && coupon.usedCount >= coupon.usageLimit) {
        toast.error('Coupon usage limit reached.');
        return;
      }

      const discount = computeDiscount(coupon, subtotal);
      setAppliedCoupon(coupon);
      setDiscountAmount(discount);
      setCouponInput(coupon.code);

      setPopup({
        open: true,
        title: 'Coupon Applied Successfully',
        description: 'Great choice. This offer will be used when you place the order.',
        code: coupon.code,
        label: 'Discount on this cart',
        value: formatCurrency(discount),
      });
    } catch (error) {
      toast.error(toErrorMessage(error, 'Invalid coupon code.'));
    }
  };

  const placeOrder = async () => {
    if (!user?.id) return;

    if (cart.length === 0) {
      toast.warning('Your cart is empty. Add products to continue.');
      return;
    }

    const deliveryAddress = buildDeliveryAddress();
    if (!deliveryAddress) {
      toast.warning('Complete delivery details with a valid 6-digit postal code.');
      return;
    }

    if (!validateStock(cart)) {
      return;
    }

    try {
      setPlacingOrder(true);
      const created = await createOrder({
        userId: user.id,
        deliveryAddress,
        couponCode: appliedCoupon?.code,
        status: 'PENDING',
        items: cart.map((line) => ({
          productId: line.productId,
          quantity: line.quantity,
          priceAtTime: productMap[line.productId]?.price ?? 0,
        })),
      });

      setOrders((current) => [created, ...current.filter((item) => item.id !== created.id)]);
      setSelectedOrderId(created.id);
      clearCart();
      toast.success(`Order #${created.id} placed successfully.`);
    } catch (error) {
      toast.error(toErrorMessage(error, 'Failed to place order.'));
    } finally {
      setPlacingOrder(false);
    }
  };

  const orderAgain = (order: OrderResponse) => {
    const lines = order.items.map((item) => ({ productId: item.productId, quantity: item.quantity }));
    if (!validateStock(lines)) {
      return;
    }

    setCart(lines);
    setAppliedCoupon(null);
    setDiscountAmount(0);
    setCouponInput('');
    toast.success(`Order #${order.id} loaded in cart.`);
  };

  if (loading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1480, mx: 'auto' }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2.5, md: 4 },
          borderRadius: 4,
          mb: 3,
          color: 'white',
          background: 'linear-gradient(130deg, #111827 0%, #1e40af 58%, #0ea5e9 100%)',
          boxShadow: '0 18px 34px rgba(30, 64, 175, 0.24)',
        }}
      >
        <Typography variant="overline" sx={{ opacity: 0.85, letterSpacing: 2.1 }}>
          SHOPPING EXPERIENCE
        </Typography>
        <Typography variant="h4" sx={{ mt: 0.5, fontWeight: 900 }}>
          Discover products with real cart and tracked orders
        </Typography>
        <Typography sx={{ mt: 1.2, opacity: 0.92, maxWidth: 760 }}>
          Add items with images, apply coupons, and place orders with structured delivery details.
        </Typography>
      </Paper>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'minmax(0, 2.2fr) minmax(320px, 1fr)' },
          gap: 2.5,
          alignItems: 'stretch',
        }}
      >
        <Stack spacing={2.5}>
          <Paper elevation={0} sx={{ p: 2.2, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
            <TextField
              fullWidth
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products"
            />
          </Paper>

          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, minmax(0, 1fr))', lg: 'repeat(3, minmax(0, 1fr))' },
              gap: 2,
            }}
          >
            {filteredProducts.map((product) => {
              const stock = inventory[product.id];
              const inCart = cart.find((item) => item.productId === product.id)?.quantity ?? 0;
              const isOut = stock != null && stock <= 0;
              return (
                <Card key={product.id} sx={{ borderRadius: 3, border: '1px solid #dbe3ef', height: '100%' }}>
                  <CardMedia component="img" height="165" image={imageForProduct(product.id)} alt={product.name} />
                  <CardContent>
                    <Stack spacing={1.25}>
                      <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
                        {product.name}
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 900 }}>{formatCurrency(product.price)}</Typography>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Chip
                          size="small"
                          label={stock == null ? 'Stock pending' : `${stock} in stock`}
                          color={isOut ? 'error' : 'default'}
                          variant="outlined"
                        />
                        <Typography variant="caption" color="text.secondary">
                          In cart: {inCart}
                        </Typography>
                      </Stack>
                      <Button
                        variant="contained"
                        disabled={isOut}
                        onClick={() => addToCart(product.id)}
                        startIcon={<ShoppingCartIcon />}
                      >
                        {inCart > 0 ? 'Add more' : 'Add to cart'}
                      </Button>
                    </Stack>
                  </CardContent>
                </Card>
              );
            })}
          </Box>

          {filteredProducts.length === 0 && (
            <Paper elevation={0} sx={{ p: 4, textAlign: 'center', borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Typography color="text.secondary">No products found for this search.</Typography>
            </Paper>
          )}
        </Stack>

        <Stack spacing={2.5}>
            <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Stack spacing={1.3}>
                <Typography variant="h6" sx={{ fontWeight: 900 }}>Cart Summary</Typography>
                <Typography variant="body2" color="text.secondary">{cartCount} items selected</Typography>
                <Divider />

                {cart.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">Your cart is empty. Add products to start checkout.</Typography>
                ) : (
                  <Stack spacing={1.2}>
                    {cart.map((line) => {
                      const product = productMap[line.productId];
                      if (!product) return null;
                      return (
                        <Box key={line.productId} sx={{ display: 'flex', justifyContent: 'space-between', gap: 1 }}>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" sx={{ fontWeight: 700 }} noWrap>{product.name}</Typography>
                            <Typography variant="caption" color="text.secondary">{formatCurrency(product.price)} each</Typography>
                          </Box>
                          <Stack direction="row" spacing={0.6} sx={{ alignItems: 'center' }}>
                            <Button size="small" variant="outlined" onClick={() => updateCartQuantity(line.productId, line.quantity - 1)}>-</Button>
                            <Typography variant="body2" sx={{ fontWeight: 700 }}>{line.quantity}</Typography>
                            <Button size="small" variant="outlined" onClick={() => updateCartQuantity(line.productId, line.quantity + 1)}>+</Button>
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                )}

                <Divider />

                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    fullWidth
                    label="Coupon code"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  />
                  <Button variant="outlined" onClick={applyCoupon} startIcon={<SellIcon />}>
                    Apply
                  </Button>
                </Stack>

                {appliedCoupon && (
                  <Chip
                    color="success"
                    variant="outlined"
                    label={`${appliedCoupon.code} applied (${formatCurrency(discountAmount)} off)`}
                  />
                )}

                <Divider />

                <TextField label="Address line" value={delivery.line1} onChange={(e) => setDeliveryField('line1', e.target.value)} fullWidth />
                <TextField label="Landmark (optional)" value={delivery.landmark} onChange={(e) => setDeliveryField('landmark', e.target.value)} fullWidth />
                <Stack direction="row" spacing={1}>
                  <TextField label="City" value={delivery.city} onChange={(e) => setDeliveryField('city', e.target.value)} fullWidth />
                  <TextField label="State" value={delivery.state} onChange={(e) => setDeliveryField('state', e.target.value)} fullWidth />
                </Stack>
                <TextField
                  label="Postal code"
                  value={delivery.postalCode}
                  onChange={(e) => setDeliveryField('postalCode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                  fullWidth
                />

                <Divider />

                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(subtotal)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2" color="text.secondary">Discount</Typography>
                  <Typography variant="body2" sx={{ fontWeight: 700 }}>- {formatCurrency(discountAmount)}</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>Payable</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>{formatCurrency(payable)}</Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Button variant="text" onClick={clearCart} disabled={cart.length === 0}>Clear</Button>
                  <Button variant="contained" fullWidth onClick={placeOrder} disabled={placingOrder || cart.length === 0}>
                    {placingOrder ? 'Placing order...' : 'Place order'}
                  </Button>
                </Stack>
              </Stack>
            </Paper>

            <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
              <Typography variant="h6" sx={{ fontWeight: 900, mb: 1 }}>My Orders</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Track history and reorder instantly.</Typography>
              <Divider sx={{ mb: 2 }} />

              {orders.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No orders yet.</Typography>
              ) : (
                <Stack spacing={1.1}>
                  {orders.map((order) => (
                    <Box
                      key={order.id}
                      sx={{
                        border: '1px solid',
                        borderColor: selectedOrder?.id === order.id ? 'primary.main' : 'divider',
                        borderRadius: 2,
                        p: 1.2,
                      }}
                    >
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="body2" sx={{ fontWeight: 800 }}>Order #{order.id}</Typography>
                        <Chip size="small" label={normalizeStatus(order.status)} variant="outlined" />
                      </Stack>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.4 }}>
                        {new Date(order.placedAt).toLocaleString('en-IN')}
                      </Typography>
                      <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center', mt: 0.8 }}>
                        <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(Number(order.totalAmount) || 0)}</Typography>
                        <Stack direction="row" spacing={0.5}>
                          <Button size="small" onClick={() => setSelectedOrderId(order.id)}>View</Button>
                          <Button size="small" startIcon={<ReplayIcon />} onClick={() => orderAgain(order)}>Order Again</Button>
                        </Stack>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>

            {selectedOrder && (
              <Paper elevation={0} sx={{ p: 2.25, borderRadius: 3, border: '1px solid', borderColor: 'divider' }}>
                <Stack spacing={1.1}>
                  <Typography variant="h6" sx={{ fontWeight: 900 }}>Delivery Tracking</Typography>
                  <Typography variant="body2" color="text.secondary">
                    Current status: {normalizeStatus(selectedOrder.status)}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar sx={{ bgcolor: '#e0f2fe', color: '#0369a1', width: 34, height: 34 }}>
                      <LocalShippingIcon fontSize="small" />
                    </Avatar>
                    <Typography variant="body2">Tracking ref: RO-{selectedOrder.id}-{String(selectedOrder.userId).padStart(4, '0')}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    Delivery address: {selectedOrder.deliveryAddress}
                  </Typography>
                </Stack>
              </Paper>
            )}
        </Stack>
      </Box>

      <CouponSuccessPopup
        open={popup.open}
        title={popup.title}
        description={popup.description}
        couponCode={popup.code}
        highlightLabel={popup.label}
        highlightValue={popup.value}
        ctaLabel="Got it"
        onClose={() => setPopup((current) => ({ ...current, open: false }))}
      />
    </Box>
  );
}
