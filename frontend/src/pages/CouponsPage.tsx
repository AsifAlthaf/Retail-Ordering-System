import { useEffect, useState } from 'react';
import {
  Box, Button, Chip, CircularProgress, Dialog, DialogActions,
  DialogContent, DialogTitle, FormControl, IconButton, InputLabel,
  MenuItem, Paper, Select, Switch, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, TextField, Tooltip, Typography,
  FormControlLabel,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { toast } from 'react-toastify';
import { getCoupons, createCoupon, updateCoupon, setCouponActive, deleteCoupon } from '../api/coupons';
import type { CouponRequest, CouponResponse, DiscountType } from '../types';

function toErrorMessage(error: any, fallback: string) {
  return error?.response?.data?.message || error?.message || fallback;
}

const emptyForm = (): CouponRequest => ({
  code: '',
  type: 'PERCENTAGE',
  value: 0,
  expiryDate: new Date().toISOString().split('T')[0],
  active: true,
  usageLimit: undefined,
});

export default function CouponsPage() {
  const [coupons, setCoupons] = useState<CouponResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialog, setDialog] = useState(false);
  const [editCoupon, setEditCoupon] = useState<CouponResponse | null>(null);
  const [form, setForm] = useState<CouponRequest>(emptyForm());
  const [saving, setSaving] = useState(false);

  const load = async () => {
    try {
      setLoading(true);
      const data = await getCoupons();
      setCoupons(data);
    } catch (error) {
      toast.error(toErrorMessage(error, 'Failed to load coupons'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditCoupon(null); setForm(emptyForm()); setDialog(true); };
  const openEdit = (c: CouponResponse) => {
    setEditCoupon(c);
    setForm({
      code: c.code,
      type: c.type,
      value: c.value,
      expiryDate: c.expiryDate,
      active: c.active,
      usageLimit: c.usageLimit,
    });
    setDialog(true);
  };

  const handleSave = async () => {
    if (!form.code.trim()) { toast.warning('Code is required'); return; }
    if (form.value <= 0) { toast.warning('Value must be positive'); return; }
    if (form.type === 'PERCENTAGE' && form.value > 100) { toast.warning('Percentage coupon cannot exceed 100'); return; }
    if (!form.expiryDate) { toast.warning('Expiry date is required'); return; }

    const normalized: CouponRequest = {
      ...form,
      code: form.code.trim().toUpperCase(),
    };

    try {
      setSaving(true);
      if (editCoupon) {
        await updateCoupon(editCoupon.id, normalized);
        toast.success('Coupon updated!');
      } else {
        await createCoupon(normalized);
        toast.success('Coupon created!');
      }
      setDialog(false);
      load();
    } catch (error) {
      toast.error(toErrorMessage(error, 'Failed to save coupon'));
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (c: CouponResponse) => {
    try {
      await setCouponActive(c.id, !c.active);
      toast.success(`Coupon ${!c.active ? 'activated' : 'deactivated'}`);
      load();
    } catch (error) {
      toast.error(toErrorMessage(error, 'Failed to toggle coupon'));
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      await deleteCoupon(id);
      toast.success('Coupon deleted');
      load();
    } catch (error) {
      toast.error(toErrorMessage(error, 'Failed to delete coupon'));
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700, flexGrow: 1 }}>Coupons</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openCreate}>
          New Coupon
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}><CircularProgress /></Box>
      ) : (
        <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ '& th': { fontWeight: 700, bgcolor: 'primary.main', color: 'white' } }}>
                <TableCell>Code</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">Value</TableCell>
                <TableCell>Expiry</TableCell>
                <TableCell align="center">Usage</TableCell>
                <TableCell align="center">Active</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {coupons.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 6, color: 'text.secondary' }}>
                    No coupons yet
                  </TableCell>
                </TableRow>
              ) : coupons.map((c, idx) => (
                <TableRow key={c.id}
                  sx={{ bgcolor: idx % 2 === 0 ? 'background.paper' : 'action.hover', '&:hover': { bgcolor: 'action.selected' } }}>
                  <TableCell>
                    <Chip label={c.code} variant="outlined" size="small" color="secondary" />
                  </TableCell>
                  <TableCell>{c.type}</TableCell>
                  <TableCell align="right">
                    {c.type === 'PERCENTAGE' ? `${c.value}%` : `₹${c.value}`}
                  </TableCell>
                  <TableCell>{c.expiryDate}</TableCell>
                  <TableCell align="center">
                    {c.usedCount} / {c.usageLimit ?? '∞'}
                  </TableCell>
                  <TableCell align="center">
                    <Switch
                      checked={c.active}
                      onChange={() => handleToggleActive(c)}
                      color="success"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => openEdit(c)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(c.id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Dialog */}
      <Dialog open={dialog} onClose={() => setDialog(false)} maxWidth="xs" fullWidth>
        <DialogTitle>{editCoupon ? 'Edit Coupon' : 'New Coupon'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: '16px !important' }}>
          <TextField label="Code" value={form.code} required
            onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} fullWidth />
          <FormControl fullWidth>
            <InputLabel>Discount Type</InputLabel>
            <Select label="Discount Type" value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value as DiscountType }))}>
              <MenuItem value="PERCENTAGE">Percentage (%)</MenuItem>
              <MenuItem value="FLAT">Flat Amount (₹)</MenuItem>
            </Select>
          </FormControl>
          <TextField label={form.type === 'PERCENTAGE' ? 'Value (%)' : 'Value (₹)'}
            type="number" value={form.value}
            onChange={e => setForm(f => ({ ...f, value: parseFloat(e.target.value) || 0 }))}
            fullWidth />
          <TextField label="Expiry Date" type="date" value={form.expiryDate}
            onChange={e => setForm(f => ({ ...f, expiryDate: e.target.value }))}
            fullWidth />
          <TextField label="Usage Limit (leave blank for unlimited)"
            type="number" value={form.usageLimit ?? ''}
            onChange={e => setForm(f => ({ ...f, usageLimit: e.target.value ? parseInt(e.target.value) : undefined }))}
            fullWidth />
          <FormControlLabel
            control={<Switch checked={form.active ?? true} onChange={e => setForm(f => ({ ...f, active: e.target.checked }))} />}
            label="Active"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialog(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? <CircularProgress size={20} /> : 'Save'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
