import {
  Button,
  Dialog,
  DialogContent,
  Stack,
  Typography,
} from '@mui/material';
import CelebrationIcon from '@mui/icons-material/Celebration';

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
  open,
  title,
  couponCode,
  description,
  highlightLabel,
  highlightValue,
  ctaLabel = 'Continue',
  onClose,
}: CouponSuccessPopupProps) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiPaper-root': {
          borderRadius: 4,
          border: '1px solid #dbe3ef',
          boxShadow: '0 22px 40px rgba(15, 23, 42, 0.16)',
        },
      }}
    >
      <DialogContent sx={{ p: 4 }}>
        <Stack spacing={2} sx={{ alignItems: 'center', textAlign: 'center' }}>
          <CelebrationIcon sx={{ fontSize: 48, color: '#1d4ed8' }} />
          <Typography variant="h5" sx={{ fontWeight: 900 }}>{title}</Typography>
          <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 380 }}>
            {description}
          </Typography>
          <Typography variant="h6" sx={{ fontWeight: 900, letterSpacing: 0.4 }}>
            {couponCode}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {highlightLabel}
          </Typography>
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 800 }}>
            {highlightValue}
          </Typography>
          <Button variant="contained" fullWidth onClick={onClose} sx={{ mt: 1.5 }}>
            {ctaLabel}
          </Button>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
