/**
 * Centralized notification utility wrapping react-hot-toast.
 * All existing toast.* calls are replaced by notify.* across the app.
 * Provides rich, context-aware toasts with icons, titles, and actions.
 */
import toast, { type ToastOptions } from 'react-hot-toast';

const BASE: ToastOptions = {
  duration: 3500,
  style: {
    background: '#1a2235',
    color: '#f1f5f9',
    border: '1px solid rgba(255,255,255,0.09)',
    borderRadius: '12px',
    fontSize: '13.5px',
    fontWeight: 500,
    fontFamily: '"Inter", system-ui, sans-serif',
    padding: '12px 16px',
    boxShadow: '0 16px 40px rgba(0,0,0,0.55)',
    maxWidth: '380px',
  },
};

function icon(emoji: string) {
  return <span style={{ fontSize: 16 }}>{emoji}</span>;
}

export const notify = {
  success: (message: string, title?: string) =>
    toast.success(title ? `${title}: ${message}` : message, {
      ...BASE,
      style: { ...BASE.style, borderLeft: '3px solid #10b981' },
      iconTheme: { primary: '#10b981', secondary: '#111827' },
    }),

  error: (message: string, title?: string) =>
    toast.error(title ? `${title}: ${message}` : message, {
      ...BASE,
      duration: 5000,
      style: { ...BASE.style, borderLeft: '3px solid #ef4444' },
      iconTheme: { primary: '#ef4444', secondary: '#111827' },
    }),

  warning: (message: string) =>
    toast(message, {
      ...BASE,
      icon: icon('⚠️'),
      style: { ...BASE.style, borderLeft: '3px solid #f59e0b' },
    }),

  info: (message: string) =>
    toast(message, {
      ...BASE,
      icon: icon('ℹ️'),
      style: { ...BASE.style, borderLeft: '3px solid #3b82f6' },
    }),

  loading: (message: string) =>
    toast.loading(message, {
      ...BASE,
      style: { ...BASE.style, borderLeft: '3px solid #6366f1' },
    }),

  dismiss: (id?: string) => toast.dismiss(id),

  /** Async promise toast — shows loading → success / error automatically */
  promise: <T,>(
    promise: Promise<T>,
    messages: { loading: string; success: string; error: string }
  ) =>
    toast.promise(promise, messages, {
      ...BASE,
      loading: { ...BASE, style: { ...BASE.style, borderLeft: '3px solid #6366f1' } },
      success: { ...BASE, style: { ...BASE.style, borderLeft: '3px solid #10b981' } },
      error:   { ...BASE, duration: 5000, style: { ...BASE.style, borderLeft: '3px solid #ef4444' } },
    } as any),

  /** Order status change notification with contextual icon */
  orderStatus: (orderId: number, status: string) => {
    const map: Record<string, { emoji: string; msg: string; color: string }> = {
      CONFIRMED: { emoji: '✅', msg: `Order #${orderId} confirmed!`,    color: '#10b981' },
      CANCELLED: { emoji: '❌', msg: `Order #${orderId} cancelled.`,    color: '#ef4444' },
      SHIPPED:   { emoji: '🚚', msg: `Order #${orderId} shipped!`,      color: '#8b5cf6' },
      DELIVERED: { emoji: '📦', msg: `Order #${orderId} delivered!`,    color: '#06b6d4' },
      PENDING:   { emoji: '⏳', msg: `Order #${orderId} marked pending.`, color: '#f59e0b' },
    };
    const cfg = map[status] ?? { emoji: 'ℹ️', msg: `Order #${orderId} updated.`, color: '#6366f1' };
    return toast(cfg.msg, {
      ...BASE,
      icon: icon(cfg.emoji),
      style: { ...BASE.style, borderLeft: `3px solid ${cfg.color}` },
    });
  },

  /** Coupon notification */
  coupon: (code: string, saving: string) =>
    toast(`🎉 Coupon ${code} applied — saving ${saving}!`, {
      ...BASE,
      duration: 4000,
      style: { ...BASE.style, borderLeft: '3px solid #6366f1' },
    }),

  /** Cart notification */
  cart: (productName: string, action: 'added' | 'removed') =>
    toast(
      action === 'added' ? `🛒 ${productName} added to cart` : `🗑️ ${productName} removed`,
      { ...BASE, style: { ...BASE.style, borderLeft: '3px solid #8b5cf6' } }
    ),
};

export default notify;
