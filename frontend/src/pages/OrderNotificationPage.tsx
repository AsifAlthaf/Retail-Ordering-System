import { useLocation, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  CardContent,
  Chip,
  Divider,
  Stack,
  Typography,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { OrderResponse, OrderStatus } from "../types";

function formatINR(v?: number) {
  return `₹${(v ?? 0).toLocaleString("en-IN", { maximumFractionDigits: 2 })}`;
}

export default function OrderNotificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = (location.state ?? {}) as {
    order?: OrderResponse;
    outcome?: Extract<OrderStatus, "CONFIRMED" | "CANCELLED">;
  };
  const order = state.order;
  const outcome = state.outcome ?? order?.status;
  const isCancelled = outcome === "CANCELLED";
  const hasState = !!order;

  if (!hasState) {
    return (
      <Box sx={{ maxWidth: 480, mx: "auto", mt: 8, textAlign: "center" }}>
        <ShoppingBagIcon
          sx={{ fontSize: 48, color: "text.secondary", mb: 2 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          No order data
        </Typography>
        <Typography sx={{ color: "text.secondary", mt: 1, mb: 3 }}>
          Please return to the orders dashboard.
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate("/orders")}
        >
          Back to Orders
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: 600, mx: "auto" }}>
      <Paper sx={{ overflow: "hidden" }}>
        <Box
          sx={{
            p: 4,
            bgcolor: isCancelled ? "#fef2f2" : "#f0fdf4",
            display: "flex",
            alignItems: "center",
            gap: 2,
            borderBottom: "1px solid #e2e8f0",
          }}
        >
          {isCancelled ? (
            <CancelIcon color="error" sx={{ fontSize: 32 }} />
          ) : (
            <CheckCircleIcon color="success" sx={{ fontSize: 32 }} />
          )}
          <Box>
            <Typography
              variant="h5"
              sx={{ color: isCancelled ? "#991b1b" : "#166534", mb: 0.5 }}
            >
              Order {isCancelled ? "Cancelled" : "Confirmed"}
            </Typography>
            <Typography
              sx={{ fontSize: 14, color: isCancelled ? "#b91c1c" : "#15803d" }}
            >
              {isCancelled
                ? "The order has been cancelled."
                : "The order has been successfully confirmed."}
            </Typography>
          </Box>
        </Box>

        <CardContent sx={{ p: 4 }}>
          {order && (
            <Stack spacing={3}>
              <Stack direction="row" spacing={1}>
                <Chip label={`Order #${order.id}`} />
                <Chip
                  label={outcome}
                  color={isCancelled ? "error" : "success"}
                />
              </Stack>
              <Divider />
              <Box
                sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}
              >
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Placed
                  </Typography>
                  <Typography>
                    {new Date(order.placedAt).toLocaleString()}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Total
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {formatINR(order.totalAmount)}
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Coupon
                  </Typography>
                  <Typography>{order.couponCode ?? "None"}</Typography>
                </Box>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Address
                </Typography>
                <Typography>{order.deliveryAddress}</Typography>
              </Box>
              <Divider />
              <Typography variant="subtitle2">Items</Typography>
              {order.items.map((item) => (
                <Box
                  key={item.id}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    p: 1.5,
                    bgcolor: "#f8fafc",
                    borderRadius: 1,
                  }}
                >
                  <Typography>
                    Product #{item.productId} (x{item.quantity})
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {formatINR(item.priceAtTime * item.quantity)}
                  </Typography>
                </Box>
              ))}
              <Divider />
              <Stack
                direction="row"
                spacing={1.5}
                sx={{ justifyContent: "flex-end" }}
              >
                <Button variant="outlined" onClick={() => navigate("/orders")}>
                  Back to Orders
                </Button>
              </Stack>
            </Stack>
          )}
        </CardContent>
      </Paper>
    </Box>
  );
}
