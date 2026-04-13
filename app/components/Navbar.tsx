"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

interface NavbarProps {
  cartCount: number;
  onCartOpen: () => void;
}

export default function Navbar({ cartCount, onCartOpen }: NavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Beranda", href: "#home" },
    { label: "Produk", href: "#products" },
    { label: "Cara Order", href: "#how-to-order" },
  ];

  return (
    <nav
      id="navbar"
      aria-label="Menu navigasi utama"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "navbar-scrolled" : ""
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <a href="#" id="logo" className="flex items-center gap-2 group">
            <Image
              src="/logo1.png"
              alt="Poinstore Logo"
              width={120}
              height={36}
              className="h-8 lg:h-9 w-auto object-contain"
              priority
            />
          </a>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-brand-600 rounded-lg hover:bg-brand-50 transition-all"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* Desktop CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <button
              id="cart-btn"
              onClick={onCartOpen}
              aria-label={`Buka keranjang belanja${cartCount > 0 ? `, ${cartCount} item` : ''}`}
              className="relative p-2.5 text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all"
            >
              <i className="ph-duotone ph-shopping-cart-simple text-xl"></i>
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 count-badge text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>
            <a
              href="https://wa.me/6285656252426"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary px-5 py-2.5 text-sm font-semibold text-white rounded-xl flex items-center gap-2"
            >
              <i className="ph-duotone ph-chat-circle-dots text-base"></i>
              Hubungi Kami
            </a>
          </div>

          {/* Mobile Menu Button (Cart Only) */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              id="cart-btn-mobile"
              onClick={onCartOpen}
              aria-label={`Buka keranjang belanja${cartCount > 0 ? `, ${cartCount} item` : ''}`}
              className="relative p-2 text-slate-500 hover:text-brand-600 transition-all"
            >
              <i className="ph-duotone ph-shopping-cart-simple text-xl"></i>
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 count-badge text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
