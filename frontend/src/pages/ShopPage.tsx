import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  LinearProgress,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import ReplayIcon from '@mui/icons-material/Replay';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { toast } from 'react-toastify';

import { useAuth } from '../context/AuthContext';
import { createOrder, getOrdersByUser } from '../api/orders';
import { getProducts } from '../api/products';
import { getInventory } from '../api/inventory';
import type { OrderResponse, Product } from '../types';

interface CartLine {
  productId: number;
  quantity: number;
}

interface DriverProfile {
  name: string;
  bike: string;
  distanceKm: number;
  etaMinutes: number;
}

const BRANDS = ['Northline', 'Field', 'Studio', 'Common', 'Atlas', 'Parcel'];
const CART_STORAGE_PREFIX = 'retail_shop_cart_';
const DRIVER_PROFILES: DriverProfile[] = [
  { name: 'Ravi Kumar', bike: 'Honda Activa', distanceKm: 2.4, etaMinutes: 12 },
  { name: 'Aman Singh', bike: 'TVS Jupiter', distanceKm: 3.1, etaMinutes: 15 },
  { name: 'Imran Ali', bike: 'Hero Splendor', distanceKm: 1.8, etaMinutes: 9 },
];

function currency(value: number) {
  return `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
}

function orderStatusLabel(status: OrderResponse['status']) {
  return status.replace('_', ' ');
}

function selectedDriver(orderId: number): DriverProfile {
  return DRIVER_PROFILES[orderId % DRIVER_PROFILES.length];
}

function progressForStatus(status: OrderResponse['status']) {
  switch (status) {
    case 'PENDING': return 20;
    case 'CONFIRMED': return 45;
    case 'SHIPPED': return 70;
    case 'DELIVERED': return 100;
    case 'CANCELLED': return 0;
    default: return 0;
  }
}

export default function ShopPage() {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<OrderResponse[]>([]);
  const [inventory, setInventory] = useState<Record<number, number | null>>({});
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [cart, setCart] = useState<CartLine[]>([]);
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [placingOrder, setPlacingOrder] = useState(false);

  const brandForProduct = (productId: number) => BRANDS[(productId - 1) % BRANDS.length];

  const productMap = Object.fromEntries(products.map(product => [product.id, product]));
  const selectedOrder = orders.find(order => order.id === selectedOrderId) ?? orders[0] ?? null;

  useEffect(() => {
    if (!user?.id) return;

    let active = true;
    setLoading(true);

    Promise.all([getProducts(), getOrdersByUser(user.id)])
      .then(async ([productList, orderList]) => {
        if (!active) return;
        setProducts(productList);
        setOrders(orderList.sort((left, right) => right.id - left.id));
        setSelectedOrderId(current => current ?? orderList[0]?.id ?? null);

        const entries = await Promise.all(
          productList.map(async product => {
            try {
              const currentInventory = await getInventory(product.id);
              return [product.id, currentInventory.quantity] as const;
            } catch {
              return [product.id, null] as const;
            }
          })
        );

        if (active) {
          setInventory(Object.fromEntries(entries));
        }
      })
      .catch(() => toast.error('Failed to load shop data'))
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;

    try {
      const stored = sessionStorage.getItem(`${CART_STORAGE_PREFIX}${user.id}`);
      setCart(stored ? JSON.parse(stored) as CartLine[] : []);
    } catch {
      setCart([]);
    }
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) return;
    sessionStorage.setItem(`${CART_STORAGE_PREFIX}${user.id}`, JSON.stringify(cart));
  }, [cart, user?.id]);

  useEffect(() => {
    if (selectedOrderId == null && orders.length > 0) {
      setSelectedOrderId(orders[0].id);
    }
  }, [orders, selectedOrderId]);

  const filteredProducts = products.filter(product => {
    const brand = brandForProduct(product.id);
    const matchesBrand = selectedBrand === 'All' || brand === selectedBrand;
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    return matchesBrand && matchesSearch;
  });

  const cartCount = cart.reduce((sum, line) => sum + line.quantity, 0);
  const cartSubtotal = cart.reduce((sum, line) => {
    const product = productMap[line.productId];
    return sum + (product?.price ?? 0) * line.quantity;
  }, 0);

  const addToCart = (product: Product, quantity = 1) => {
    const stock = inventory[product.id];
    if (stock != null && stock <= 0) {
      toast.warning(`${product.name} is out of stock`);
      return;
    }

    setCart(current => {
      const existing = current.find(line => line.productId === product.id);
      if (existing) {
        return current.map(line => line.productId === product.id
          ? { ...line, quantity: line.quantity + quantity }
          : line);
      }
      return [...current, { productId: product.id, quantity }];
    });

    toast.success(`${product.name} added to cart`);
  };

  const updateCartQty = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      setCart(current => current.filter(line => line.productId !== productId));
      return;
    }

    setCart(current => current.map(line => line.productId === productId ? { ...line, quantity } : line));
  };

  const clearCart = () => setCart([]);

  const validateStock = (lines: CartLine[]) => {
    const missing = lines.filter(line => {
      const stock = inventory[line.productId];
      return stock == null || stock < line.quantity;
    });

    if (missing.length > 0) {
      const firstMissing = productMap[missing[0].productId]?.name ?? `Product #${missing[0].productId}`;
      toast.warning(`${firstMissing} is missing/out of stock`);
      return false;
    }

    return true;
  };

  const placeOrder = async () => {
    if (!user?.id) return;
    if (cart.length === 0) {
      toast.warning('Add at least one item to the cart');
      return;
    }
    if (!deliveryAddress.trim()) {
      toast.warning('Delivery address is required');
      return;
    }
    if (!validateStock(cart)) return;

    try {
      setPlacingOrder(true);
      const placedOrder = await createOrder({
        userId: user.id,
        deliveryAddress: deliveryAddress.trim(),
        status: 'PENDING',
        items: cart.map(line => {
          const product = productMap[line.productId];
          return {
            productId: line.productId,
            quantity: line.quantity,
            priceAtTime: product?.price ?? 0,
          };
        }),
      });

      setOrders(current => [placedOrder, ...current.filter(order => order.id !== placedOrder.id)]);
      setSelectedOrderId(placedOrder.id);
      setCart([]);
      setDeliveryAddress('');
      toast.success(`Order #${placedOrder.id} placed`);
    } catch {
      toast.error('Failed to place order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const reorder = (order: OrderResponse) => {
    const lines = order.items.map(item => ({ productId: item.productId, quantity: item.quantity }));
    if (!validateStock(lines)) return;
    setCart(lines);
    setDeliveryAddress(order.deliveryAddress);
    toast.success('Order added to cart');
  };

  const currentDriver = selectedOrder ? selectedDriver(selectedOrder.id) : DRIVER_PROFILES[0];
  const progress = selectedOrder ? progressForStatus(selectedOrder.status) : 0;

  if (loading) {
    return (
      <Box sx={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <CircularProgress size={48} />
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 1440, mx: 'auto' }}>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" fontWeight={700} color="text.primary">
          Shop
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Browse products, add them to a cart, and place a cash on delivery order.
        </Typography>
      </Box>

      <Grid container spacing={2.5} alignItems="stretch">
        <Grid item xs={12} md={2.5}>
          <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.25, height: '100%' }}>
            <Stack spacing={2}>
              <Box>
                <Typography variant="subtitle2" fontWeight={700} mb={1}>
                  Brands
                </Typography>
                <Stack spacing={1}>
                  {['All', ...BRANDS].map(brand => (
                    <Button
                      key={brand}
                      variant={selectedBrand === brand ? 'contained' : 'text'}
                      onClick={() => setSelectedBrand(brand)}
                      sx={{ justifyContent: 'flex-start', px: 1.25 }}
                    >
                      {brand}
                    </Button>
                  ))}
                </Stack>
              </Box>

              <Divider />

              <Box>
                <Typography variant="subtitle2" fontWeight={700} mb={1}>
                  Quick filters
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  <Chip label={`${products.length} items`} size="small" variant="outlined" />
                  <Chip label={`${cartCount} in cart`} size="small" variant="outlined" />
                  <Chip label={`${orders.length} orders`} size="small" variant="outlined" />
                </Stack>
              </Box>
            </Stack>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6.5}>
          <Stack spacing={2.5}>
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.25 }}>
              <Stack spacing={1.5}>
                <TextField
                  value={search}
                  onChange={event => setSearch(event.target.value)}
                  placeholder="Search products"
                  size="small"
                  fullWidth
                  InputProps={{
                    startAdornment: <SearchIcon fontSize="small" style={{ marginRight: 8 }} />,
                  }}
                />
                <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                  {['All', ...BRANDS].map(brand => (
                    <Chip
                      key={brand}
                      label={brand}
                      clickable
                      variant={selectedBrand === brand ? 'filled' : 'outlined'}
                      onClick={() => setSelectedBrand(brand)}
                    />
                  ))}
                </Stack>
              </Stack>
            </Paper>

            <Grid container spacing={2}>
              {filteredProducts.length === 0 ? (
                <Grid item xs={12}>
                  <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 4, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      No products match your search.
                    </Typography>
                  </Paper>
                </Grid>
              ) : filteredProducts.map(product => {
                const brand = brandForProduct(product.id);
                const stock = inventory[product.id];
                const isAvailable = stock == null || stock > 0;
                const quantityInCart = cart.find(line => line.productId === product.id)?.quantity ?? 0;

                return (
                  <Grid item xs={12} sm={6} key={product.id}>
                    <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, height: '100%' }}>
                      <CardContent sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, height: '100%' }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 1 }}>
                          <Box>
                            <Chip label={brand} size="small" variant="outlined" sx={{ mb: 1 }} />
                            <Typography variant="subtitle1" fontWeight={700} lineHeight={1.2}>
                              {product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mt={0.5}>
                              Curated retail item
                            </Typography>
                          </Box>
                          <Avatar variant="rounded" sx={{ bgcolor: 'grey.100', color: 'text.primary', width: 40, height: 40 }}>
                            <StorefrontIcon fontSize="small" />
                          </Avatar>
                        </Box>

                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="space-between">
                          <Typography variant="h6" fontWeight={700}>
                            {currency(product.price)}
                          </Typography>
                          <Chip
                            label={stock == null ? 'Stock not set' : stock > 0 ? `${stock} in stock` : 'Out of stock'}
                            size="small"
                            variant="outlined"
                          />
                        </Stack>

                        <Box sx={{ mt: 'auto' }}>
                          <Button
                            fullWidth
                            variant="contained"
                            disabled={!isAvailable}
                            onClick={() => addToCart(product)}
                            startIcon={<ShoppingCartIcon />}
                          >
                            {quantityInCart > 0 ? `Add more (${quantityInCart})` : 'Add to cart'}
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.25 }}>
              <Stack spacing={2}>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                  <Box>
                    <Typography variant="subtitle1" fontWeight={700}>
                      Cart
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {cart.length === 0 ? 'Your cart is empty' : `${cartCount} items ready for checkout`}
                    </Typography>
                  </Box>
                  <Typography variant="subtitle1" fontWeight={700}>
                    {currency(cartSubtotal)}
                  </Typography>
                </Box>

                <Divider />

                {cart.length === 0 ? (
                  <Paper variant="outlined" sx={{ borderRadius: 2, p: 1.5 }}>
                    <Typography variant="body2" color="text.secondary">
                      Add a product to begin checkout.
                    </Typography>
                  </Paper>
                ) : (
                  <Stack spacing={1.5}>
                    {cart.map(line => {
                      const product = productMap[line.productId];
                      const stock = inventory[line.productId];
                      return (
                        <Box key={line.productId} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2 }}>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {product?.name ?? `Product #${line.productId}`}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {currency(product?.price ?? 0)} each · {stock == null ? 'Stock not tracked' : `${stock} available`}
                            </Typography>
                          </Box>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Button size="small" variant="outlined" onClick={() => updateCartQty(line.productId, line.quantity - 1)}>
                              -
                            </Button>
                            <Typography variant="body2" fontWeight={700} sx={{ minWidth: 24, textAlign: 'center' }}>
                              {line.quantity}
                            </Typography>
                            <Button size="small" variant="outlined" onClick={() => updateCartQty(line.productId, line.quantity + 1)}>
                              +
                            </Button>
                          </Stack>
                        </Box>
                      );
                    })}
                  </Stack>
                )}

                <Divider />

                <Stack spacing={1.5}>
                  <TextField
                    label="Delivery address"
                    value={deliveryAddress}
                    onChange={event => setDeliveryAddress(event.target.value)}
                    multiline
                    minRows={2}
                    fullWidth
                  />
                  <Typography variant="caption" color="text.secondary">
                    Payment method: Cash on delivery.
                  </Typography>
                  <Stack direction="row" spacing={1} justifyContent="space-between">
                    <Button variant="text" onClick={clearCart} disabled={cart.length === 0}>
                      Clear cart
                    </Button>
                    <Button variant="contained" onClick={placeOrder} disabled={placingOrder || cart.length === 0}>
                      {placingOrder ? 'Placing order...' : 'Place order'}
                    </Button>
                  </Stack>
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Grid>

        <Grid item xs={12} md={3}>
          <Stack spacing={2.5}>
            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.25 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
                Order history
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {orders.length === 0 ? 'No orders placed yet' : `Latest ${orders.length} orders`}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {orders.length === 0 ? (
                <Box sx={{ py: 4, textAlign: 'center' }}>
                  <ShoppingCartIcon sx={{ fontSize: 36, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">
                    Your order history will appear here.
                  </Typography>
                </Box>
              ) : (
                <Stack spacing={1.25}>
                  {orders.map(order => (
                    <Box
                      key={order.id}
                      onClick={() => setSelectedOrderId(order.id)}
                      sx={{
                        border: '1px solid',
                        borderColor: selectedOrder?.id === order.id ? 'text.primary' : 'divider',
                        borderRadius: 2,
                        p: 1.5,
                        cursor: 'pointer',
                      }}
                    >
                      <Stack spacing={0.75}>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                          <Typography variant="body2" fontWeight={700}>
                            Order #{order.id}
                          </Typography>
                          <Chip label={orderStatusLabel(order.status)} size="small" variant="outlined" />
                        </Box>
                        <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 12 }} />
                          {new Date(order.placedAt).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 1 }}>
                          <Typography variant="body2" fontWeight={700}>
                            {currency(order.totalAmount ?? 0)}
                          </Typography>
                          <Button size="small" startIcon={<ReplayIcon />} onClick={event => { event.stopPropagation(); reorder(order); }}>
                            Order again
                          </Button>
                        </Box>
                      </Stack>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>

            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.25 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
                Order details
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                {selectedOrder ? `Order #${selectedOrder.id}` : 'Select an order to inspect it'}
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {selectedOrder ? (
                <Stack spacing={1.5}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">Placed at</Typography>
                    <Typography variant="body2" fontWeight={600} align="right">
                      {new Date(selectedOrder.placedAt).toLocaleString('en-IN')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">Status</Typography>
                    <Typography variant="body2" fontWeight={600} align="right">
                      {orderStatusLabel(selectedOrder.status)}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">Payment</Typography>
                    <Typography variant="body2" fontWeight={600} align="right">
                      Cash on delivery
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                    <Typography variant="body2" color="text.secondary">Total</Typography>
                    <Typography variant="body2" fontWeight={700} align="right">
                      {currency(selectedOrder.totalAmount ?? 0)}
                    </Typography>
                  </Box>

                  <Divider />

                  <Typography variant="subtitle2" fontWeight={700}>
                    Items
                  </Typography>
                  <Stack spacing={1}>
                    {selectedOrder.items.map(item => {
                      const product = productMap[item.productId];
                      return (
                        <Box key={item.id} sx={{ display: 'flex', justifyContent: 'space-between', gap: 2 }}>
                          <Box sx={{ minWidth: 0 }}>
                            <Typography variant="body2" fontWeight={600} noWrap>
                              {product?.name ?? `Product #${item.productId}`}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.quantity} x {currency(item.priceAtTime)}
                            </Typography>
                          </Box>
                          <Typography variant="body2" fontWeight={700}>
                            {currency(item.quantity * item.priceAtTime)}
                          </Typography>
                        </Box>
                      );
                    })}
                  </Stack>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No order selected.
                </Typography>
              )}
            </Paper>

            <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 3, p: 2.25 }}>
              <Typography variant="subtitle1" fontWeight={700} mb={0.5}>
                Delivery details
              </Typography>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Live delivery information for the selected order.
              </Typography>
              <Divider sx={{ mb: 2 }} />

              {selectedOrder ? (
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: 'grey.100', color: 'text.primary' }}>
                      <LocalShippingIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={700}>
                        {currentDriver.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {currentDriver.bike}
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                      Distance from hub
                    </Typography>
                    <Typography variant="body2" fontWeight={600}>
                      {currentDriver.distanceKm.toFixed(1)} km away · ETA {currentDriver.etaMinutes} min
                    </Typography>
                  </Box>

                  <Box>
                    <Typography variant="caption" color="text.secondary" display="block" mb={1}>
                      Location tracker
                    </Typography>
                    <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 999, mb: 1.5 }} />
                    <Stack direction="row" justifyContent="space-between" spacing={1}>
                      <Typography variant="caption" color="text.secondary">Warehouse</Typography>
                      <Typography variant="caption" color="text.secondary">Route</Typography>
                      <Typography variant="caption" color="text.secondary">Your address</Typography>
                    </Stack>
                  </Box>
                </Stack>
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Select an order to show delivery details.
                </Typography>
              )}
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}
