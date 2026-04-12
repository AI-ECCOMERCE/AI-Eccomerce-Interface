"use client";

import { useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ProductsSection from "./components/ProductsSection";

import HowToOrderSection from "./components/HowToOrderSection";

import CtaSection from "./components/CtaSection";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import CartModal from "./components/CartModal";
import ToastNotification from "./components/ToastNotification";
import { CartItem } from "./lib/checkout";

export default function Home() {
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
      } else {
        return [...prevCart, { ...product, quantity: 1 }];
      }
    });

    // Show toast
    setToastMessage(`${product.name} ditambahkan ke keranjang.`);
    setToastVisible(true);
    setTimeout(() => {
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
        <HeroSection />
        <ProductsSection onAddToCart={addToCart} />
        <HowToOrderSection />
        <CtaSection />
      </main>
      <Footer />
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
