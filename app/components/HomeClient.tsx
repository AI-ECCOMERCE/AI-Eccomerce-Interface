"use client";

import { ReactNode, useCallback, useState } from "react";
import Navbar from "./Navbar";
import ProductsSection from "./ProductsSection";
import HowToOrderSection from "./HowToOrderSection";
import CtaSection from "./CtaSection";
import WhatsAppFloat from "./WhatsAppFloat";
import CartModal from "./CartModal";
import ToastNotification from "./ToastNotification";
import { CartItem } from "../lib/checkout";

interface HomeClientProps {
  children: ReactNode;
}

export default function HomeClient({ children }: HomeClientProps) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = useCallback((product: Omit<CartItem, "quantity">) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.id === product.id);

      if (existingItem) {
        return prevCart.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });

    setToastMessage(`${product.name} ditambahkan ke keranjang.`);
    setToastVisible(true);
    window.setTimeout(() => {
      setToastVisible(false);
    }, 2500);
  }, []);

  const removeFromCart = useCallback((index: number) => {
    setCart((prevCart) => prevCart.filter((_, i) => i !== index));
  }, []);

  return (
    <>
      <Navbar cartCount={cartCount} onCartOpen={() => setCartOpen(true)} />
      <main id="main-content" aria-label="Konten utama Poinstore">
        {children}
        <ProductsSection onAddToCart={addToCart} />
        <HowToOrderSection />
        <CtaSection />
      </main>
      <WhatsAppFloat />
      <CartModal
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onRemoveFromCart={removeFromCart}
      />
      <ToastNotification message={toastMessage} visible={toastVisible} />
    </>
  );
}
