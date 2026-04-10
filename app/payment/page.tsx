"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface OrderData {
  customer: {
    name: string;
    email: string;
    phone: string;
    notes: string;
  };
  items: { name: string; price: number; quantity: number }[];
  totalPrice: number;
  orderId: string;
  createdAt: string;
}

type PaymentStatus = "waiting" | "checking" | "success" | "expired";

export default function PaymentPage() {
  const router = useRouter();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [status, setStatus] = useState<PaymentStatus>("waiting");
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const savedOrder = localStorage.getItem("designai-order");
    if (savedOrder) {
      setOrder(JSON.parse(savedOrder));
    } else {
      router.push("/");
    }
  }, [router]);

  // Countdown timer
  useEffect(() => {
    if (status !== "waiting" && status !== "checking") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setStatus("expired");
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [status]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  };

  const handleConfirmPayment = () => {
    setStatus("checking");
    // Simulate payment check — akan diganti dengan Pakasir API
    setTimeout(() => {
      setStatus("success");
      localStorage.removeItem("designai-cart");
    }, 3000);
  };

  const handleCopyOrderId = () => {
    if (order) {
      navigator.clipboard.writeText(order.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  // Success state
  if (status === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-10">
            {/* Success Animation */}
            <div className="relative w-24 h-24 mx-auto mb-6">
              <div className="absolute inset-0 bg-green-100 rounded-full animate-ping opacity-20"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center shadow-lg shadow-green-500/30">
                <i className="ph-duotone ph-check-circle text-5xl text-white"></i>
              </div>
            </div>

            <h1 className="font-display text-2xl font-extrabold text-slate-900 mb-2">
              Pembayaran <span className="gradient-text">Berhasil!</span>
            </h1>
            <p className="text-sm text-slate-500 leading-relaxed mb-6">
              Terima kasih! Pesananmu sedang diproses. Akun premium akan dikirim
              ke <strong className="text-slate-700">{order.customer.email}</strong>{" "}
              dalam 1-5 menit.
            </p>

            <div className="bg-slate-50 rounded-2xl p-4 mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">Order ID</span>
                <span className="text-sm font-bold text-slate-900">
                  {order.orderId}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">Total Bayar</span>
                <span className="text-sm font-bold text-brand-600">
                  Rp {order.totalPrice.toLocaleString("id-ID")}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <a
                href={`https://wa.me/6281234567890?text=Halo admin, saya sudah bayar untuk order ${order.orderId}. Mohon diproses. Terima kasih!`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-500/25"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Konfirmasi via WhatsApp
              </a>
              <a
                href="/"
                className="w-full py-3.5 bg-white border-2 border-slate-200 text-slate-700 text-sm font-semibold rounded-xl flex items-center justify-center gap-2 hover:border-brand-300 hover:text-brand-600 transition-all"
              >
                <i className="ph-duotone ph-house text-lg"></i>
                Kembali ke Beranda
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-xl border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <a href="/" className="flex items-center gap-2">
              <Image
                src="/ailogo.png"
                alt="DesignAI Store"
                width={120}
                height={36}
                className="h-8 lg:h-9 w-auto object-contain"
              />
            </a>

            {/* Stepper */}
            <div className="hidden sm:flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-500 text-white text-sm font-bold flex items-center justify-center">
                  <i className="ph-duotone ph-check text-base"></i>
                </div>
                <span className="text-sm font-medium text-green-600">
                  Data Diri
                </span>
              </div>
              <div className="w-8 h-[2px] bg-brand-300"></div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-600 text-white text-sm font-bold flex items-center justify-center">
                  2
                </div>
                <span className="text-sm font-semibold text-brand-600">
                  Pembayaran
                </span>
              </div>
            </div>

            <a
              href="/checkout"
              className="text-sm text-slate-500 hover:text-brand-600 transition-colors flex items-center gap-1"
            >
              <i className="ph-duotone ph-arrow-left text-base"></i>
              Kembali
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Payment Section */}
          <div className="lg:col-span-3">
            <div className="mb-8">
              <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900">
                Pembayaran <span className="gradient-text">QRIS</span>
              </h1>
              <p className="mt-2 text-slate-500 text-sm">
                Scan kode QR di bawah untuk melakukan pembayaran.
              </p>
            </div>

            {/* Timer Alert */}
            <div
              className={`mb-6 p-4 rounded-2xl border flex items-center gap-3 ${
                timeLeft <= 120
                  ? "bg-red-50 border-red-200"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  timeLeft <= 120 ? "bg-red-100" : "bg-amber-100"
                }`}
              >
                <i
                  className={`ph-duotone ph-clock-countdown text-xl ${
                    timeLeft <= 120 ? "text-red-600" : "text-amber-600"
                  }`}
                ></i>
              </div>
              <div className="flex-1">
                <p
                  className={`text-sm font-semibold ${
                    timeLeft <= 120 ? "text-red-800" : "text-amber-800"
                  }`}
                >
                  {status === "expired"
                    ? "Waktu pembayaran habis"
                    : "Selesaikan pembayaran dalam"}
                </p>
                <p
                  className={`text-xs mt-0.5 ${
                    timeLeft <= 120 ? "text-red-600" : "text-amber-600"
                  }`}
                >
                  {status === "expired"
                    ? "Silakan buat pesanan baru."
                    : `Sisa waktu: ${formatTime(timeLeft)}`}
                </p>
              </div>
              {status !== "expired" && (
                <span
                  className={`text-2xl font-display font-extrabold ${
                    timeLeft <= 120 ? "text-red-600" : "text-amber-700"
                  }`}
                >
                  {formatTime(timeLeft)}
                </span>
              )}
            </div>

            {/* QRIS Card */}
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                    <i className="ph-duotone ph-qr-code text-xl text-white"></i>
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-slate-900">
                      QRIS Payment
                    </h3>
                    <p className="text-xs text-slate-400">
                      Powered by Pakasir
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Logo_QRIS.svg/200px-Logo_QRIS.svg.png"
                    alt="QRIS"
                    className="h-6 object-contain"
                  />
                </div>
              </div>

              <div className="p-8 text-center">
                {status === "expired" ? (
                  <div className="py-12">
                    <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                      <i className="ph-duotone ph-clock-countdown text-4xl text-red-400"></i>
                    </div>
                    <h3 className="font-display font-bold text-lg text-slate-900 mb-2">
                      Waktu Habis
                    </h3>
                    <p className="text-sm text-slate-500 mb-6">
                      Sesi pembayaran telah berakhir.
                    </p>
                    <a
                      href="/"
                      className="inline-flex btn-primary px-8 py-3 text-sm font-semibold text-white rounded-xl gap-2"
                    >
                      <i className="ph-duotone ph-arrow-counter-clockwise text-base"></i>
                      Buat Pesanan Baru
                    </a>
                  </div>
                ) : (
                  <>
                    {/* QRIS Placeholder — akan diganti dengan QR dari Pakasir */}
                    <div className="w-64 h-64 mx-auto bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex items-center justify-center mb-6">
                      <div className="text-center">
                        <i className="ph-duotone ph-qr-code text-7xl text-slate-300"></i>
                        <p className="text-xs text-slate-400 mt-2 font-medium">
                          QR Code dari Pakasir
                        </p>
                        <p className="text-[10px] text-slate-300 mt-1">
                          Akan muncul setelah integrasi
                        </p>
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 font-semibold mb-1">
                      Total Pembayaran
                    </p>
                    <p className="text-3xl font-display font-extrabold text-brand-600 mb-6">
                      Rp {order.totalPrice.toLocaleString("id-ID")}
                    </p>

                    {/* How to pay */}
                    <div className="bg-slate-50 rounded-2xl p-5 text-left mb-6">
                      <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
                        <i className="ph-duotone ph-info text-base text-brand-500"></i>
                        Cara Pembayaran:
                      </h4>
                      <ol className="space-y-2">
                        {[
                          "Buka aplikasi e-wallet atau mobile banking",
                          "Pilih menu Scan QR / QRIS",
                          "Arahkan kamera ke kode QR di atas",
                          "Pastikan nominal sesuai, lalu konfirmasi",
                          'Klik tombol "Saya Sudah Bayar" di bawah',
                        ].map((step, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2.5 text-sm text-slate-600"
                          >
                            <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-600 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                              {i + 1}
                            </span>
                            {step}
                          </li>
                        ))}
                      </ol>
                    </div>

                    {/* Confirm Payment Button */}
                    <button
                      onClick={handleConfirmPayment}
                      disabled={status === "checking"}
                      className="w-full btn-primary py-4 text-base font-semibold text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 disabled:opacity-70"
                    >
                      {status === "checking" ? (
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
                          Memeriksa Pembayaran...
                        </>
                      ) : (
                        <>
                          <i className="ph-duotone ph-check-circle text-xl"></i>
                          Saya Sudah Bayar
                        </>
                      )}
                    </button>

                    {/* Supported wallets */}
                    <div className="mt-6 flex items-center justify-center gap-4 text-xs text-slate-400">
                      <span>Didukung oleh:</span>
                      <div className="flex items-center gap-3">
                        <span className="font-semibold text-slate-500">
                          GoPay
                        </span>
                        <span className="font-semibold text-slate-500">
                          OVO
                        </span>
                        <span className="font-semibold text-slate-500">
                          Dana
                        </span>
                        <span className="font-semibold text-slate-500">
                          ShopeePay
                        </span>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden sticky top-24">
              <div className="p-6 border-b border-slate-100 bg-gradient-to-r from-brand-50 to-purple-50">
                <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
                  <i className="ph-duotone ph-receipt text-xl text-brand-600"></i>
                  Detail Pesanan
                </h3>
              </div>

              <div className="p-6">
                {/* Order ID */}
                <div className="bg-slate-50 rounded-xl p-3 flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
                      Order ID
                    </p>
                    <p className="text-sm font-bold text-slate-900 font-mono">
                      {order.orderId}
                    </p>
                  </div>
                  <button
                    onClick={handleCopyOrderId}
                    className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all"
                    title="Copy Order ID"
                  >
                    {copied ? (
                      <i className="ph-duotone ph-check text-lg text-green-600"></i>
                    ) : (
                      <i className="ph-duotone ph-copy text-lg"></i>
                    )}
                  </button>
                </div>

                {/* Customer Info */}
                <div className="mb-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <i className="ph-duotone ph-user text-base text-brand-400"></i>
                    <span className="text-slate-600">{order.customer.name}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <i className="ph-duotone ph-envelope-simple text-base text-brand-400"></i>
                    <span className="text-slate-600">
                      {order.customer.email}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <i className="ph-duotone ph-whatsapp-logo text-base text-brand-400"></i>
                    <span className="text-slate-600">
                      {order.customer.phone}
                    </span>
                  </div>
                </div>

                <hr className="border-slate-100 my-4" />

                {/* Items */}
                <div className="space-y-3">
                  {order.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-slate-900">
                          {item.name}
                        </p>
                        <p className="text-xs text-slate-400">
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

                <div className="mt-4 pt-4 border-t-2 border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-base font-bold text-slate-900">
                      Total
                    </span>
                    <span className="text-xl font-display font-extrabold text-brand-600">
                      Rp {order.totalPrice.toLocaleString("id-ID")}
                    </span>
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
