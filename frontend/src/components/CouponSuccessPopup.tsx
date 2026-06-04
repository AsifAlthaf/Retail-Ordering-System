import { Box, Button, Dialog, DialogContent, IconButton, Stack, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import notify from '../utils/notify';

interface CouponSuccessPopupProps {
  open: boolean;
  title: string;
  couponCode: string;
  description: string;
  highlightLabel: string;
  highlightValue: string;
  ctaLabel?: string;
  onClose: () => void;
}

export default function CouponSuccessPopup({
  open, title, couponCode, description, highlightLabel, highlightValue, ctaLabel = 'Continue', onClose,
}: CouponSuccessPopupProps) {
  const copyCode = () => {
    if (!couponCode) return;
    navigator.clipboard.writeText(couponCode).then(() => notify.info(`Copied ${couponCode}`));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogContent sx={{ p: 3, position: 'relative' }}>
        <IconButton size="small" onClick={onClose} sx={{ position: 'absolute', top: 12, right: 12 }}>
          <CloseIcon fontSize="small" />
        </IconButton>

        <Stack spacing={2} alignItems="center" textAlign="center">
          <Box sx={{ width: 56, height: 56, borderRadius: '16px', bgcolor: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26 }}>
            🎉
          </Box>
          <Box>
            <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 0.5 }}>{title}</Typography>
            <Typography sx={{ fontSize: 14, color: 'text.secondary' }}>{description}</Typography>
          </Box>
          {couponCode && (
            <Box
              onClick={copyCode}
              sx={{
                display: 'flex', alignItems: 'center', gap: 1, px: 2, py: 1,
                borderRadius: '8px', bgcolor: '#f8fafc', border: '1px dashed #cbd5e1',
                cursor: 'pointer', '&:hover': { bgcolor: '#f1f5f9' },
              }}
            >
              <Typography sx={{ fontFamily: 'monospace', fontSize: 18, fontWeight: 700, color: 'primary.main', letterSpacing: '0.1em' }}>
                {couponCode}
              </Typography>
              <ContentCopyIcon fontSize="small" sx={{ color: 'text.secondary' }} />
            </Box>
          )}
          {highlightLabel && (
            <Box>
              <Typography sx={{ fontSize: 12, color: 'text.secondary', textTransform: 'uppercase', mb: 0.25 }}>{highlightLabel}</Typography>
              <Typography sx={{ fontSize: 20, fontWeight: 700, color: 'success.main' }}>{highlightValue}</Typography>
            </Box>
          )}
          <Button variant="contained" fullWidth onClick={onClose} sx={{ mt: 1 }}>{ctaLabel}</Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
