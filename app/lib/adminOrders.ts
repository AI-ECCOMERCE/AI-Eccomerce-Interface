export const ADMIN_ORDER_LAST_SEEN_KEY = "designai-admin-orders-last-seen-at";
export const ADMIN_ORDER_POLL_INTERVAL_MS = 15000;

type OrderTimestampEntry = {
  created_at?: string | null;
};

const toTimestamp = (value?: string | null) => {
  const parsed = value ? new Date(value).getTime() : Number.NaN;
  return Number.isNaN(parsed) ? 0 : parsed;
};

export const getLastSeenOrdersAt = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ADMIN_ORDER_LAST_SEEN_KEY);
};

export const markOrdersAsSeen = () => {
  if (typeof window === "undefined") {
    return null;
  }

  const seenAt = new Date().toISOString();
  window.localStorage.setItem(ADMIN_ORDER_LAST_SEEN_KEY, seenAt);
  return seenAt;
};

export const countUnreadOrders = (
  orders: OrderTimestampEntry[],
  lastSeenAt?: string | null
) => {
  if (!lastSeenAt) {
    return orders.length;
  }

  const lastSeenTimestamp = toTimestamp(lastSeenAt);

  return orders.filter(
    (order) => toTimestamp(order.created_at) > lastSeenTimestamp
  ).length;
};
