import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Box, Button, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, Divider, FormControl, IconButton,
  InputAdornment, InputLabel, MenuItem, Select, Skeleton, Stack,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  TextField, Tooltip, Typography, Paper,
  AddCircleOutlineIcon as _a,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import { useNavigate } from 'react-router-dom';
import { getOrders, getOrderById, createOrder, updateOrderStatus, deleteOrder } from '../api/orders';
import { getProducts } from '../api/products';
import type { OrderResponse, OrderRequest, OrderStatus, Product, OrderItemRequest } from '../types';
import StatusBadge from '../components/StatusBadge';
import ConfirmDialog from '../components/ConfirmDialog';
import notify from '../utils/notify';

const ALL_STATUSES: OrderStatus[] = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

function formatINR(v?: number) {
  return `₹${(v ?? 0).toLocaleString('en-IN', { maximumFractionDigits: 2 })}`;
}

function toErr(e: any, fallback: string) {
  return e?.response?.data?.message || e?.message || fallback;
}

export default function OrdersPage() {
  const navigate = useNavigate();

  const [orders, setOrders]     = useState<OrderResponse[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);

  // Filters
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'ALL'>('ALL');

  // Create dialog
  const [createDialog, setCreateDialog] = useState(false);
  const [form, setForm] = useState<OrderRequest>({
    userId: 1, deliveryAddress: '', couponCode: '', status: 'PENDING',
    items: [{ productId: 0, quantity: 1, priceAtTime: 0 }],
  });
  const [saving, setSaving] = useState(false);

  // Detail dialog
  const [detailDialog, setDetailDialog]   = useState(false);
  const [detailOrder, setDetailOrder]     = useState<OrderResponse | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  // Status dialog
  const [statusDialog, setStatusDialog] = useState(false);
  const [statusOrder, setStatusOrder]   = useState<OrderResponse | null>(null);
  const [newStatus, setNewStatus]       = useState<OrderStatus>('PENDING');
  const [statusSaving, setStatusSaving] = useState(false);

  // Delete confirm
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  // Per-row accept/reject in-flight tracking
  const [actionIds, setActionIds] = useState<Record<number, 'accepting' | 'rejecting'>>({});

  const productMap = useMemo(
    () => Object.fromEntries(products.map(p => [p.id, p])),
    [products]
  );

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [o, p] = await Promise.all([getOrders(), getProducts()]);
      setOrders(o.sort((a, b) => b.id - a.id));
      setProducts(p);
    } catch {
      notify.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const matchStatus = statusFilter === 'ALL' || o.status === statusFilter;
      const q = search.toLowerCase();
      const matchSearch = !q
        || String(o.id).includes(q)
        || String(o.userId).includes(q)
        || o.deliveryAddress.toLowerCase().includes(q)
        || (o.couponCode ?? '').toLowerCase().includes(q);
      return matchStatus && matchSearch;
    });
  }, [orders, search, statusFilter]);

  const pendingCount = useMemo(() => orders.filter(o => o.status === 'PENDING').length, [orders]);

  // ─── Create order ──────────────────────────────────────────────────────────
  const resetForm = () => setForm({
    userId: 1, deliveryAddress: '', couponCode: '', status: 'PENDING',
    items: [{ productId: 0, quantity: 1, priceAtTime: 0 }],
  });

  const addItem    = () => setForm(f => ({ ...f, items: [...f.items, { productId: 0, quantity: 1, priceAtTime: 0 }] }));
  const removeItem = (i: number) => setForm(f => ({ ...f, items: f.items.filter((_, idx) => idx !== i) }));
  const updateItem = (i: number, patch: Partial<OrderItemRequest>) =>
    setForm(f => ({ ...f, items: f.items.map((it, idx) => idx === i ? { ...it, ...patch } : it) }));

  const handleCreate = async () => {
    if (!form.deliveryAddress.trim())                              { notify.warning('Delivery address is required'); return; }
    if (form.items.some(i => !i.productId || i.quantity < 1 || i.priceAtTime <= 0)) {
      notify.warning('Fill all item fields correctly'); return;
    }
    try {
      setSaving(true);
      const created = await createOrder(form);
      setOrders(os => [created, ...os]);
      setCreateDialog(false);
      resetForm();
      notify.success(`Order #${created.id} created`);
    } catch {
      notify.error('Failed to create order');
    } finally {
      setSaving(false);
    }
  };

  // ─── View detail ───────────────────────────────────────────────────────────
  const viewDetails = async (orderId: number) => {
    try {
      setDetailLoading(true);
      setDetailDialog(true);
      const order = await getOrderById(orderId);
      setDetailOrder(order);
    } catch {
      notify.error('Failed to load order details');
      setDetailDialog(false);
    } finally {
      setDetailLoading(false);
    }
  };

  // ─── Status update (from dialog) ───────────────────────────────────────────
  const openStatusDialog = (o: OrderResponse) => {
    setStatusOrder(o);
    setNewStatus(o.status);
    setStatusDialog(true);
  };

  const handleStatusUpdate = async () => {
    if (!statusOrder) return;
    try {
      setStatusSaving(true);
      const updated = await updateOrderStatus(statusOrder.id, newStatus);
      setOrders(os => os.map(o => o.id === updated.id ? updated : o));
      if (detailOrder?.id === statusOrder.id) setDetailOrder(updated);
      setStatusDialog(false);
      notify.orderStatus(statusOrder.id, newStatus);
      if (newStatus === 'CONFIRMED' || newStatus === 'CANCELLED') {
        navigate('/order-notification', { state: { order: updated, outcome: newStatus } });
      }
    } catch {
      notify.error('Failed to update status');
    } finally {
      setStatusSaving(false);
    }
  };

  // ─── Quick accept / reject (per-row buttons) ───────────────────────────────
  const quickAction = async (
    order: OrderResponse,
    status: Extract<OrderStatus, 'CONFIRMED' | 'CANCELLED'>
  ) => {
    if (actionIds[order.id]) return;
    setActionIds(prev => ({ ...prev, [order.id]: status === 'CONFIRMED' ? 'accepting' : 'rejecting' }));
    try {
      const updated = await updateOrderStatus(order.id, status);
      setOrders(os => os.map(o => o.id === updated.id ? updated : o));
      if (detailOrder?.id === order.id) setDetailOrder(updated);
      notify.orderStatus(order.id, status);
      if (status === 'CONFIRMED' || status === 'CANCELLED') {
        navigate('/order-notification', { state: { order: updated, outcome: status } });
      }
    } catch {
      notify.error(`Failed to ${status === 'CONFIRMED' ? 'accept' : 'reject'} order`);
    } finally {
      setActionIds(prev => { const n = { ...prev }; delete n[order.id]; return n; });
    }
  };

  // ─── Delete ────────────────────────────────────────────────────────────────
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      await deleteOrder(deleteId);
      setOrders(os => os.filter(o => o.id !== deleteId));
      notify.success(`Order #${deleteId} deleted`);
    } catch {
      notify.error('Failed to delete order');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  return (
    <Box sx={{ animation: 'fadeInUp 0.4s ease both' }}>
      {/* Page header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, flexWrap: 'wrap', gap: 2 }}>
        <Box>
          <Typography variant="overline" sx={{ color: '#6366f1' }}>FULFILMENT</Typography>
          <Typography variant="h5" sx={{ color: '#f1f5f9', display: 'flex', alignItems: 'center', gap: 1 }}>
            Orders
            {pendingCount > 0 && (
              <Chip label={`${pendingCount} pending`} size="small" color="warning" sx={{ ml: 0.5 }} />
            )}
          </Typography>
        </Box>
        <Stack direction="row" spacing={1.5} alignItems="center" flexWrap="wrap">
          <TextField
            size="small" placeholder="Search by ID, user, address…"
            value={search} onChange={e => setSearch(e.target.value)}
            sx={{ minWidth: 220 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon sx={{ fontSize: 15, color: '#475569' }} /></InputAdornment> }}
          />
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as OrderStatus | 'ALL')}
              startAdornment={<InputAdornment position="start"><FilterListIcon sx={{ fontSize: 15, color: '#475569', ml: 0.5 }} /></InputAdornment>}
            >
              <MenuItem value="ALL">All statuses</MenuItem>
              {ALL_STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
          <Button variant="contained" size="small" onClick={() => { resetForm(); setCreateDialog(true); }}>
            + New Order
          </Button>
        </Stack>
      </Box>

      {/* Table */}
      {loading ? (
        <Stack spacing={1.5}>
          {[0,1,2,3,4].map(i => <Skeleton key={i} height={62} variant="rounded" sx={{ borderRadius: '8px' }} />)}
        </Stack>
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: '12px' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Order</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Total</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 8, color: '#475569' }}>
                    {search || statusFilter !== 'ALL' ? 'No orders match your filters' : 'No orders yet'}
                  </TableCell>
                </TableRow>
              ) : filteredOrders.map(o => (
                <TableRow key={o.id}>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#6366f1' }}>#{o.id}</Typography>
                    {o.couponCode && (
                      <Typography sx={{ fontSize: 10.5, color: '#8b5cf6', mt: 0.25 }}>🏷 {o.couponCode}</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ color: '#94a3b8', fontSize: 13 }}>User #{o.userId}</TableCell>
                  <TableCell>
                    <StatusBadge status={o.status} onClick={() => openStatusDialog(o)} />
                  </TableCell>
                  <TableCell align="right">
                    <Typography sx={{ fontSize: 13.5, fontWeight: 700, color: '#f1f5f9', fontVariantNumeric: 'tabular-nums' }}>
                      {formatINR(o.totalAmount)}
                    </Typography>
                    {(o.discount ?? 0) > 0 && (
                      <Typography sx={{ fontSize: 10.5, color: '#10b981' }}>-{formatINR(o.discount)}</Typography>
                    )}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 160 }}>
                    <Typography sx={{ fontSize: 12.5, color: '#64748b', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {o.deliveryAddress}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ fontSize: 12.5, color: '#64748b', whiteSpace: 'nowrap' }}>
                    {new Date(o.placedAt).toLocaleDateString('en-IN')}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center">
                      {/* View */}
                      <Tooltip title="View details">
                        <IconButton size="small" onClick={() => viewDetails(o.id)} sx={{ color: '#6366f1' }}>
                          <VisibilityIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      </Tooltip>

                      {/* Quick Accept / Reject for PENDING */}
                      {o.status === 'PENDING' && (
                        <>
                          <Tooltip title="Accept order">
                            <Button
                              size="small" variant="contained" color="success"
                              disabled={!!actionIds[o.id]}
                              onClick={() => quickAction(o, 'CONFIRMED')}
                              sx={{ minWidth: 0, px: 1.25, py: 0.5, fontSize: 11.5 }}
                              startIcon={actionIds[o.id] === 'accepting'
                                ? <CircularProgress size={10} color="inherit" />
                                : <CheckIcon sx={{ fontSize: 13 }} />}
                            >
                              Accept
                            </Button>
                          </Tooltip>
                          <Tooltip title="Reject order">
                            <Button
                              size="small" variant="outlined" color="error"
                              disabled={!!actionIds[o.id]}
                              onClick={() => quickAction(o, 'CANCELLED')}
                              sx={{ minWidth: 0, px: 1.25, py: 0.5, fontSize: 11.5 }}
                              startIcon={actionIds[o.id] === 'rejecting'
                                ? <CircularProgress size={10} color="inherit" />
                                : <CloseIcon sx={{ fontSize: 13 }} />}
                            >
                              Reject
                            </Button>
                          </Tooltip>
                        </>
                      )}

                      {/* Status edit */}
                      <Tooltip title="Change status">
                        <IconButton size="small" onClick={() => openStatusDialog(o)} sx={{ color: '#f59e0b' }}>
                          <EditIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      </Tooltip>

                      {/* Delete */}
                      <Tooltip title="Delete order">
                        <IconButton size="small" onClick={() => setDeleteId(o.id)} sx={{ color: '#ef4444' }}>
                          <DeleteIcon sx={{ fontSize: 15 }} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* ─── Order Detail Dialog ──────────────────────────────────────────── */}
      <Dialog open={detailDialog} onClose={() => setDetailDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {detailLoading ? 'Loading…' : `Order #${detailOrder?.id}`}
        </DialogTitle>
        <DialogContent>
          {detailLoading ? (
            <Stack spacing={1.5} sx={{ mt: 1 }}>
              {[0,1,2,3,4].map(i => <Skeleton key={i} height={20} variant="rounded" />)}
            </Stack>
          ) : detailOrder ? (
            <Stack spacing={2} sx={{ mt: 1 }}>
              <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1.5 }}>
                <Box>
                  <Typography sx={{ fontSize: 11, color: '#475569', mb: 0.25, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Status</Typography>
                  <StatusBadge status={detailOrder.status} />
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 11, color: '#475569', mb: 0.25, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Total</Typography>
                  <Typography sx={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9' }}>{formatINR(detailOrder.totalAmount)}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 11, color: '#475569', mb: 0.25, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Customer</Typography>
                  <Typography sx={{ fontSize: 13.5, color: '#f1f5f9' }}>User #{detailOrder.userId}</Typography>
                </Box>
                <Box>
                  <Typography sx={{ fontSize: 11, color: '#475569', mb: 0.25, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Placed</Typography>
                  <Typography sx={{ fontSize: 13.5, color: '#f1f5f9' }}>{new Date(detailOrder.placedAt).toLocaleString('en-IN')}</Typography>
                </Box>
              </Box>

              <Box>
                <Typography sx={{ fontSize: 11, color: '#475569', mb: 0.5, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Delivery Address</Typography>
                <Typography sx={{ fontSize: 13.5, color: '#94a3b8', lineHeight: 1.6 }}>{detailOrder.deliveryAddress}</Typography>
              </Box>

              {detailOrder.couponCode && (
                <Box sx={{ display: 'flex', gap: 3 }}>
                  <Box>
                    <Typography sx={{ fontSize: 11, color: '#475569', mb: 0.25, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Coupon</Typography>
                    <Typography sx={{ fontSize: 13.5, color: '#818cf8', fontFamily: 'monospace', fontWeight: 700 }}>{detailOrder.couponCode}</Typography>
                  </Box>
                  {(detailOrder.discount ?? 0) > 0 && (
                    <Box>
                      <Typography sx={{ fontSize: 11, color: '#475569', mb: 0.25, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Discount</Typography>
                      <Typography sx={{ fontSize: 13.5, color: '#10b981', fontWeight: 700 }}>-{formatINR(detailOrder.discount)}</Typography>
                    </Box>
                  )}
                </Box>
              )}

              <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)' }} />

              <Box>
                <Typography sx={{ fontSize: 11, color: '#475569', mb: 1, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                  Items ({detailOrder.items?.length ?? 0})
                </Typography>
                <Stack spacing={1}>
                  {detailOrder.items?.length ? detailOrder.items.map(item => (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                        p: 1.25, borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                      }}
                    >
                      <Box>
                        <Typography sx={{ fontSize: 13.5, fontWeight: 600, color: '#f1f5f9' }}>
                          {productMap[item.productId]?.name ?? `Product #${item.productId}`}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: '#475569' }}>
                          {item.quantity} × {formatINR(item.priceAtTime)}
                        </Typography>
                      </Box>
                      <Typography sx={{ fontSize: 14, fontWeight: 700, color: '#f1f5f9', fontVariantNumeric: 'tabular-nums' }}>
                        {formatINR(item.priceAtTime * item.quantity)}
                      </Typography>
                    </Box>
                  )) : (
                    <Typography sx={{ fontSize: 13, color: '#475569' }}>No item details available</Typography>
                  )}
                </Stack>
              </Box>

              {detailOrder.status === 'PENDING' && (
                <>
                  <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)' }} />
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="contained" color="success" fullWidth
                      startIcon={<CheckIcon fontSize="small" />}
                      disabled={!!actionIds[detailOrder.id]}
                      onClick={() => quickAction(detailOrder, 'CONFIRMED')}
                    >
                      {actionIds[detailOrder.id] === 'accepting' ? <CircularProgress size={16} color="inherit" /> : 'Accept Order'}
                    </Button>
                    <Button
                      variant="outlined" color="error" fullWidth
                      startIcon={<CloseIcon fontSize="small" />}
                      disabled={!!actionIds[detailOrder.id]}
                      onClick={() => quickAction(detailOrder, 'CANCELLED')}
                    >
                      {actionIds[detailOrder.id] === 'rejecting' ? <CircularProgress size={16} color="inherit" /> : 'Reject Order'}
                    </Button>
                  </Stack>
                </>
              )}
            </Stack>
          ) : (
            <Typography sx={{ color: '#475569', py: 4, textAlign: 'center' }}>No data available</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDetailDialog(false)} variant="outlined">Close</Button>
        </DialogActions>
      </Dialog>

      {/* ─── Status Update Dialog ─────────────────────────────────────────── */}
      <Dialog open={statusDialog} onClose={() => setStatusDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Update Status — Order #{statusOrder?.id}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 1 }}>
            <InputLabel>New Status</InputLabel>
            <Select
              label="New Status"
              value={newStatus}
              onChange={e => setNewStatus(e.target.value as OrderStatus)}
            >
              {ALL_STATUSES.map(s => <MenuItem key={s} value={s}>{s}</MenuItem>)}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusDialog(false)} variant="outlined">Cancel</Button>
          <Button variant="contained" onClick={handleStatusUpdate} disabled={statusSaving}>
            {statusSaving ? <CircularProgress size={16} color="inherit" /> : 'Update'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Create Order Dialog ──────────────────────────────────────────── */}
      <Dialog open={createDialog} onClose={() => setCreateDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>New Order</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="User ID" type="number" value={form.userId}
              onChange={e => setForm(f => ({ ...f, userId: parseInt(e.target.value) || 1 }))}
              fullWidth inputProps={{ min: 1 }}
            />
            <TextField
              label="Delivery Address" value={form.deliveryAddress} required
              onChange={e => setForm(f => ({ ...f, deliveryAddress: e.target.value }))}
              fullWidth multiline rows={2}
            />
            <TextField
              label="Coupon Code (optional)" value={form.couponCode}
              onChange={e => setForm(f => ({ ...f, couponCode: e.target.value.toUpperCase() }))}
              fullWidth inputProps={{ style: { fontFamily: 'monospace' } }}
            />
            <Divider sx={{ borderColor: 'rgba(255,255,255,0.07)' }}>
              <Typography sx={{ fontSize: 11, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.07em' }}>Items</Typography>
            </Divider>
            {form.items.map((item, idx) => (
              <Stack key={idx} direction="row" spacing={1} alignItems="center">
                <FormControl size="small" sx={{ minWidth: 140, flex: 2 }}>
                  <InputLabel>Product</InputLabel>
                  <Select
                    label="Product" value={item.productId}
                    onChange={e => {
                      const pid = Number(e.target.value);
                      const prod = products.find(p => p.id === pid);
                      updateItem(idx, { productId: pid, priceAtTime: prod?.price ?? item.priceAtTime });
                    }}
                  >
                    {products.map(p => <MenuItem key={p.id} value={p.id}>{p.name}</MenuItem>)}
                  </Select>
                </FormControl>
                <TextField
                  label="Qty" type="number" size="small" value={item.quantity}
                  onChange={e => updateItem(idx, { quantity: parseInt(e.target.value) || 1 })}
                  sx={{ width: 70 }} inputProps={{ min: 1 }}
                />
                <TextField
                  label="Price" type="number" size="small" value={item.priceAtTime}
                  onChange={e => updateItem(idx, { priceAtTime: parseFloat(e.target.value) || 0 })}
                  sx={{ width: 90 }} inputProps={{ min: 0, step: 0.01 }}
                />
                <IconButton
                  size="small" color="error"
                  onClick={() => removeItem(idx)}
                  disabled={form.items.length === 1}
                >
                  <RemoveCircleIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Stack>
            ))}
            <Button
              startIcon={<AddCircleIcon fontSize="small" />}
              onClick={addItem} variant="outlined" size="small"
              sx={{ alignSelf: 'flex-start' }}
            >
              Add Item
            </Button>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setCreateDialog(false)} variant="outlined">Cancel</Button>
          <Button variant="contained" onClick={handleCreate} disabled={saving}>
            {saving ? <CircularProgress size={16} color="inherit" /> : 'Place Order'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Delete Confirm ───────────────────────────────────────────────── */}
      <ConfirmDialog
        open={deleteId !== null}
        title="Delete Order"
        message={`Permanently delete Order #${deleteId}? This cannot be undone.`}
        confirmLabel="Delete Order"
        confirmColor="error"
        loading={deleting}
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteId(null)}
      />
    </Box>
  );
}
