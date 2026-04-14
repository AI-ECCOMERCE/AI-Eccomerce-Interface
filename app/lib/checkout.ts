export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const CART_STORAGE_KEY = "designai-cart";
export const ORDER_STORAGE_KEY = "designai-order";
export const PAYMENT_ACCESS_HEADER = "x-payment-access-token";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutOrder {
  id: string;
  orderId: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
  items: CartItem[];
  pricing: {
    subtotal: number;
    fee: number;
    totalPayment: number;
  };
  payment: {
    gateway: string;
    method: string;
    reference: string | null;
    status: string;
    number: string | null;
    paymentUrl: string | null;
    expiresAt: string | null;
    completedAt: string | null;
    lastCheckedAt: string | null;
    sandboxMode: boolean;
  };
  delivery: {
    status: string;
    emailStatus: string;
    emailId: string | null;
    sentAt: string | null;
    deliveredAt: string | null;
    providerStatus: string | null;
    lastEventAt: string | null;
    completedAt: string | null;
    error: string | null;
  };
  paymentAccess: {
    token: string;
    expiresAt: string;
  };
}
