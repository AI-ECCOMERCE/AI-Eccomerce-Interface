"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onRemoveFromCart: (index: number) => void;
}

export default function CartModal({
  isOpen,
  onClose,
  cart,
  onRemoveFromCart,
}: CartModalProps) {
  const router = useRouter();
  const [panelVisible, setPanelVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => setPanelVisible(true), 10);
    } else {
      setPanelVisible(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    setPanelVisible(false);
    setTimeout(() => onClose(), 300);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleCheckout = () => {
    // Save cart to localStorage for checkout page
    localStorage.setItem("designai-cart", JSON.stringify(cart));
    handleClose();
    setTimeout(() => {
      router.push("/checkout");
    }, 350);
  };

  if (!isOpen) return null;

  return (
    <div id="cart-modal" className="fixed inset-0 z-50">
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={handleClose}
      ></div>
      <div
        className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ${
          panelVisible ? "translate-x-0" : "translate-x-full"
        }`}
        id="cart-panel"
      >
        <div className="flex flex-col h-full">
          {/* Cart Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <i className="ph-duotone ph-shopping-cart-simple text-xl text-brand-600"></i>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Keranjang
              </h3>
            </div>
            <button
              onClick={handleClose}
              className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all"
            >
              <i className="ph-duotone ph-x text-xl"></i>
            </button>
          </div>

          {/* Cart Items */}
          <div id="cart-items" className="flex-1 overflow-y-auto p-6">
            {cart.length === 0 ? (
              <div
                id="empty-cart"
                className="flex flex-col items-center justify-center h-full text-center"
              >
                <div className="w-20 h-20 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                  <i className="ph-duotone ph-shopping-bag text-4xl text-slate-300"></i>
                </div>
                <p className="font-semibold text-slate-900 mb-1">
                  Keranjang Kosong
                </p>
                <p className="text-sm text-slate-400">
                  Tambahkan produk ke keranjang untuk mulai belanja.
                </p>
              </div>
            ) : (
              <div id="cart-list" className="space-y-4">
                {cart.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-slate-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Qty: {item.quantity} × Rp{" "}
                        {item.price.toLocaleString("id-ID")}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-sm text-slate-900">
                        Rp{" "}
                        {(item.price * item.quantity).toLocaleString("id-ID")}
                      </span>
                      <button
                        onClick={() => onRemoveFromCart(index)}
                        className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                      >
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                          ></path>
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Cart Footer */}
          {cart.length > 0 && (
            <div id="cart-footer" className="p-6 border-t border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-500">Total</span>
                <span
                  id="cart-total"
                  className="text-xl font-display font-extrabold text-slate-900"
                >
                  Rp {totalPrice.toLocaleString("id-ID")}
                </span>
              </div>

              {/* Primary: Lanjutkan ke Checkout */}
              <button
                onClick={handleCheckout}
                className="btn-primary w-full py-3.5 text-sm font-semibold text-white rounded-xl flex items-center justify-center gap-2 mb-3"
              >
                <i className="ph-duotone ph-arrow-right text-lg"></i>
                Lanjutkan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
