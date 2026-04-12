"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  API_URL,
  CART_STORAGE_KEY,
  CartItem,
  CheckoutOrder,
  ORDER_STORAGE_KEY,
} from "../lib/checkout";

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    notes: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      const parsed = JSON.parse(savedCart) as CartItem[];
      if (parsed.length === 0) {
        router.push("/");
      }
      setCart(parsed);
    } else {
      router.push("/");
    }
  }, [router]);

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = "Nama lengkap wajib diisi";
    if (!formData.email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Nomor WhatsApp wajib diisi";
    } else if (!/^[\d+\-\s()]{8,}$/.test(formData.phone)) {
      newErrors.phone = "Format nomor tidak valid";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: formData.name,
          customer_email: formData.email,
          customer_phone: formData.phone,
          customer_notes: formData.notes,
          items: cart.map((item) => ({
            product_id: item.id,
            quantity: item.quantity,
          })),
        }),
      });

      const json = await res.json();

      if (!res.ok || !json.success) {
        throw new Error(json.error || "Gagal membuat pesanan.");
      }

      const orderData = json.data as CheckoutOrder;
      localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orderData));
      router.push(
        `/payment?order=${encodeURIComponent(orderData.id)}&token=${encodeURIComponent(
          orderData.paymentAccess.token
        )}`
      );
    } catch (err) {
      console.error("Order error:", err);
      alert(
        err instanceof Error
          ? err.message
          : "Gagal terhubung ke server. Pastikan API berjalan."
      );
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/ailogo.png"
                alt="DesignAI Store"
                width={120}
                height={36}
                className="h-8 lg:h-9 w-auto object-contain"
              />
            </Link>

            {/* Stepper */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-600 text-white text-sm font-bold flex items-center justify-center">
                  1
                </div>
                <span className="text-sm font-semibold text-brand-600">
                  Data Diri
                </span>
              </div>
              <div className="w-8 h-[2px] bg-slate-200"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-400 text-sm font-bold flex items-center justify-center">
                  2
                </div>
                <span className="text-sm font-medium text-slate-400">
                  Pembayaran
                </span>
              </div>
            </div>

            <Link
              href="/"
              className="text-sm text-slate-500 hover:text-brand-600 transition-colors flex items-center gap-1"
            >
              <i className="ph-duotone ph-arrow-left text-base"></i>
              Kembali
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Form Section */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900">
                Informasi <span className="gradient-text">Pemesan</span>
              </h1>
              <p className="mt-2 text-slate-500 text-sm">
                Lengkapi data di bawah untuk memproses pesanan kamu.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <i className="ph-duotone ph-user text-base text-brand-500 mr-1.5"></i>
                  Nama Lengkap <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Masukkan nama lengkap"
                  className={`w-full px-4 py-3.5 rounded-xl border ${
                    errors.name
                      ? "border-red-300 bg-red-50/50"
                      : "border-slate-200 bg-white"
                  } text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all`}
                />
                {errors.name && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <i className="ph-duotone ph-warning-circle text-sm"></i>
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <i className="ph-duotone ph-envelope-simple text-base text-brand-500 mr-1.5"></i>
                  Email <span className="text-red-400">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  placeholder="contoh@email.com"
                  className={`w-full px-4 py-3.5 rounded-xl border ${
                    errors.email
                      ? "border-red-300 bg-red-50/50"
                      : "border-slate-200 bg-white"
                  } text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all`}
                />
                {errors.email && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <i className="ph-duotone ph-warning-circle text-sm"></i>
                    {errors.email}
                  </p>
                )}
                <p className="mt-1.5 text-xs text-slate-400">
                  Akun premium akan dikirim ke email ini
                </p>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <i className="ph-duotone ph-whatsapp-logo text-base text-brand-500 mr-1.5"></i>
                  Nomor WhatsApp <span className="text-red-400">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  placeholder="08xxxxxxxxxx"
                  className={`w-full px-4 py-3.5 rounded-xl border ${
                    errors.phone
                      ? "border-red-300 bg-red-50/50"
                      : "border-slate-200 bg-white"
                  } text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all`}
                />
                {errors.phone && (
                  <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
                    <i className="ph-duotone ph-warning-circle text-sm"></i>
                    {errors.phone}
                  </p>
                )}
                <p className="mt-1.5 text-xs text-slate-400">
                  Untuk konfirmasi dan OTP login akun
                </p>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">
                  <i className="ph-duotone ph-note text-base text-brand-500 mr-1.5"></i>
                  Catatan{" "}
                  <span className="text-slate-400 font-normal">(opsional)</span>
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Catatan tambahan untuk pesanan..."
                  rows={3}
                  className="w-full px-4 py-3.5 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all resize-none"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-4 text-base font-semibold text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                      />
                    </svg>
                    Memproses...
                  </>
                ) : (
                  <>
                    Lanjut ke Pembayaran
                    <i className="ph-duotone ph-arrow-right text-xl"></i>
                  </>
                )}
              </button>
            </form>

            {/* Security badge */}
            <div className="mt-6 flex items-center justify-center gap-6 text-slate-400 text-xs">
              <div className="flex items-center gap-1.5">
                <i className="ph-duotone ph-shield-check text-sm text-green-500"></i>
                Data Aman & Terenkripsi
              </div>
              <div className="flex items-center gap-1.5">
                <i className="ph-duotone ph-lock-key text-sm text-brand-500"></i>
                Privasi Terjaga
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden sticky top-24">
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-brand-50 to-purple-50">
                <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                  <i className="ph-duotone ph-receipt text-xl text-brand-600"></i>
                  Ringkasan Pesanan
                </h3>
              </div>

              <div className="p-6">
                <div className="space-y-3">
                  {cart.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-400 mt-0.5">
                          {item.quantity}x @ Rp{" "}
                          {item.price.toLocaleString("id-ID")}
                        </p>
                      </div>
                      <span className="text-sm font-bold text-slate-900">
                        Rp{" "}
                        {(item.price * item.quantity).toLocaleString("id-ID")}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-500">Subtotal</span>
                    <span className="text-sm font-semibold text-slate-700">
                      Rp {totalPrice.toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-sm text-slate-500">Biaya Admin</span>
                    <span className="text-sm font-semibold text-slate-500">
                      Dihitung otomatis di QRIS
                    </span>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t-2 border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-slate-900">
                      Estimasi Subtotal
                    </span>
                    <span className="text-xl font-display font-extrabold text-brand-600">
                      Rp {totalPrice.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Trust */}
                <div className="mt-6 p-4 rounded-2xl bg-green-50/80 border border-green-100">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                      <i className="ph-duotone ph-shield-check text-lg text-green-600"></i>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-green-800">
                        Garansi 7 Hari
                      </p>
                      <p className="text-xs text-green-600 mt-0.5 leading-relaxed">
                        Akun bermasalah? Langsung diganti baru tanpa biaya
                        tambahan.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
