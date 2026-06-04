import { Chip } from "@mui/material";

export default function StatusBadge({
  status,
  onClick,
  size = "md",
}: {
  status: string;
  onClick?: () => void;
  size?: "sm" | "md";
}) {
  const cfg: Record<string, { label: string; color: string; bgcolor: string }> =
    {
      PENDING: { label: "Pending", color: "#b45309", bgcolor: "#fef3c7" }, // Amber
      CONFIRMED: { label: "Confirmed", color: "#1d4ed8", bgcolor: "#dbeafe" }, // Blue
      SHIPPED: { label: "Shipped", color: "#6d28d9", bgcolor: "#ede9fe" }, // Purple
      DELIVERED: { label: "Delivered", color: "#15803d", bgcolor: "#dcfce3" }, // Green
      CANCELLED: { label: "Cancelled", color: "#b91c1c", bgcolor: "#fee2e2" }, // Red
    };

  const current = cfg[status] || {
    label: status,
    color: "#475569",
    bgcolor: "#f1f5f9",
  };

  return (
    <Chip
      label={current.label}
      onClick={onClick}
      size={size === "sm" ? "small" : "medium"}
      sx={{
        bgcolor: current.bgcolor,
        color: current.color,
        fontWeight: 600,
        fontSize: size === "sm" ? 11 : 12,
        height: size === "sm" ? 20 : 24,
        cursor: onClick ? "pointer" : "default",
        "&:hover": onClick ? { filter: "brightness(0.95)" } : undefined,
      }}
    />
  );
}
