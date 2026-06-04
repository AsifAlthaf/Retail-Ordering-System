import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
  Box,
} from "@mui/material";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DeleteIcon from "@mui/icons-material/Delete";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  confirmColor?: "primary" | "error" | "warning" | "info" | "success";
  onConfirm: () => void;
  onCancel: () => void;
  loading?: boolean;
  danger?: boolean;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmColor = "primary",
  onConfirm,
  onCancel,
  loading = false,
  danger = false,
}: ConfirmDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onCancel}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {danger && <WarningAmberIcon color="error" />}
          <Typography sx={{ fontSize: 16, fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
          {message}
        </Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 1 }}>
        <Button onClick={onCancel} disabled={loading} color="inherit">
          {cancelLabel}
        </Button>
        <Button
          onClick={onConfirm}
          variant="contained"
          color={confirmColor}
          disabled={loading}
          startIcon={
            loading ? (
              <CircularProgress size={16} />
            ) : danger ? (
              <DeleteIcon fontSize="small" />
            ) : undefined
          }
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
