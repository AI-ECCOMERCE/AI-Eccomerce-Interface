"use client";

import { useState, useCallback } from "react";
import Navbar from "./components/Navbar";
import HeroSection from "./components/HeroSection";
import ProductsSection from "./components/ProductsSection";
import BundlePromoSection from "./components/BundlePromoSection";
import FeaturesSection from "./components/FeaturesSection";
import HowToOrderSection from "./components/HowToOrderSection";
import TestimonialsSection from "./components/TestimonialsSection";
import FaqSection from "./components/FaqSection";
import CtaSection from "./components/CtaSection";
import Footer from "./components/Footer";
import WhatsAppFloat from "./components/WhatsAppFloat";
import CartModal from "./components/CartModal";
import ToastNotification from "./components/ToastNotification";

interface CartItem {
  name: string;
  price: number;
  quantity: number;
}

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const addToCart = useCallback((name: string, price: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.name === name);
      if (existingItem) {
        return prevCart.map((item) =>
          item.name === name
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      } else {
        return [...prevCart, { name, price, quantity: 1 }];
      }
    });

    // Show toast
    setToastMessage(`${name} ditambahkan ke keranjang.`);
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
      <HeroSection />
      <ProductsSection onAddToCart={addToCart} />
      <BundlePromoSection />
      <FeaturesSection />
      <HowToOrderSection />
      <TestimonialsSection />
      <FaqSection />
      <CtaSection />
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
