/**
 * notify.ts — centralized toast wrapper around react-hot-toast.
 *
 * Rule: every user-facing action (success, error, warning) goes through here.
 * Never call toast() directly in page components — always use notify.*
 * This keeps toast styling consistent and makes it trivial to swap libraries later.
 */
import toast from "react-hot-toast";

const DARK_BASE = {
  background: "rgba(255, 255, 255, 0.88)",
  backdropFilter: "blur(20px) saturate(190%)",
  color: "#191919",
  border: "1px solid rgba(230, 228, 221, 0.7)",
  borderRadius: "12px",
  fontSize: "13.5px",
  fontWeight: "600",
  fontFamily: '"CohereText", "Anthropic Sans", "Plus Jakarta Sans", "Instrument Sans", -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", sans-serif',
  padding: "12px 18px",
  boxShadow: "0 8px 32px -4px rgba(25, 25, 25, 0.06), 0 2px 12px -2px rgba(25, 25, 25, 0.02)",
  maxWidth: "380px",
};

const withBorder = (color: string) => ({
  ...DARK_BASE,
  borderLeft: `4px solid ${color}`,
});

const notify = {
  success(msg: string) {
    return toast.success(msg, {
      duration: 3000,
      style: withBorder("#15803D"),
      iconTheme: { primary: "#15803D", secondary: "#ffffff" },
    });
  },

  error(msg: string) {
    return toast.error(msg, {
      duration: 4500,
      style: withBorder("#B91C1C"),
      iconTheme: { primary: "#B91C1C", secondary: "#ffffff" },
    });
  },

  warning(msg: string) {
    return toast(msg, {
      duration: 3500,
      icon: "⚠️",
      style: withBorder("#B45309"),
    });
  },

  info(msg: string) {
    return toast(msg, {
      duration: 3000,
      icon: "ℹ️",
      style: withBorder("#1D4ED8"),
    });
  },

  loading(msg: string) {
    return toast.loading(msg, {
      style: withBorder("#6d28d9"),
    });
  },

  dismiss(id?: string) {
    toast.dismiss(id);
  },

  /** Wrap an async call: shows loading → auto resolves to success/error */
  promise<T>(
    prom: Promise<T>,
    msgs: { loading: string; success: string; error: string },
  ) {
    return toast.promise(prom, msgs, {
      style: DARK_BASE,
      loading: { style: withBorder("#6d28d9") },
      success: {
        style: withBorder("#15803D"),
        iconTheme: { primary: "#15803D", secondary: "#ffffff" },
      },
      error: {
        style: withBorder("#B91C1C"),
        iconTheme: { primary: "#B91C1C", secondary: "#ffffff" },
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as unknown as any);
  },

  /** Specific notification after an order status change */
  orderStatus(orderId: number, status: string) {
    const cfg: Record<string, { icon: string; color: string; msg: string }> = {
      CONFIRMED: {
        icon: "✅",
        color: "#15803D",
        msg: `Order #${orderId} confirmed`,
      },
      CANCELLED: {
        icon: "❌",
        color: "#B91C1C",
        msg: `Order #${orderId} cancelled`,
      },
      SHIPPED: {
        icon: "🚚",
        color: "#6d28d9",
        msg: `Order #${orderId} shipped`,
      },
      DELIVERED: {
        icon: "📦",
        color: "#1D4ED8",
        msg: `Order #${orderId} delivered`,
      },
      PENDING: {
        icon: "⏳",
        color: "#B45309",
        msg: `Order #${orderId} set to pending`,
      },
    };
    const c = cfg[status] ?? {
      icon: "📋",
      color: "#6d28d9",
      msg: `Order #${orderId} updated`,
    };
    return toast(c.msg, {
      icon: c.icon,
      duration: 3500,
      style: withBorder(c.color),
    });
  },

  /** Coupon applied feedback */
  couponApplied(code: string, saving: string) {
    return toast(`Coupon ${code} applied — saving ${saving}`, {
      icon: "🎉",
      duration: 4000,
      style: withBorder("#1D4ED8"),
    });
  },

  /** Cart action feedback */
  cart(productName: string, action: "added" | "removed") {
    return toast(
      action === "added"
        ? `Added ${productName} to cart`
        : `Removed ${productName}`,
      {
        icon: action === "added" ? "🛒" : "🗑️",
        duration: 2000,
        style: withBorder("#6d28d9"),
      },
    );
  },
};

export default notify;
