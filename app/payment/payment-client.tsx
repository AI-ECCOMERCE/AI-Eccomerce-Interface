"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { QRCodeSVG } from "qrcode.react";

import {
  API_URL,
  CART_STORAGE_KEY,
  CheckoutOrder,
  ORDER_STORAGE_KEY,
  PAYMENT_ACCESS_HEADER,
} from "../lib/checkout";

const WHATSAPP_NUMBER = "6281234567890";

const formatCurrency = (amount: number) =>
  `Rp ${amount.toLocaleString("id-ID")}`;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};

const isPaid = (order: CheckoutOrder) =>
  order.payment.status === "completed" ||
  order.status === "paid" ||
  order.status === "completed";

const getDeliveryMessage = (order: CheckoutOrder) => {
  if (order.delivery.emailStatus === "sent") {
    return `Akun premium sudah dikirim ke ${order.customer.email}. Cek inbox dan folder spam jika belum terlihat.`;
  }

  if (order.delivery.status === "manual_review") {
    return `Pembayaran berhasil. Tim kami sedang menyiapkan akun dan akan mengirimkannya ke ${order.customer.email} secepatnya.`;
  }

  if (order.delivery.status === "failed") {
    return `Pembayaran berhasil, tetapi email otomatis sedang terkendala. Tim kami akan follow up ke ${order.customer.email}.`;
  }

  return `Pembayaran berhasil. Akun sedang diproses untuk dikirim ke ${order.customer.email}.`;
};

export default function PaymentPageClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryOrderId = searchParams.get("order");
  const queryToken = searchParams.get("token");

  const [order, setOrder] = useState<CheckoutOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [simulating, setSimulating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [timeLeft, setTimeLeft] = useState<number | null>(null);

  const persistOrder = useCallback((nextOrder: CheckoutOrder) => {
    setOrder(nextOrder);
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(nextOrder));

    if (isPaid(nextOrder)) {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  const fetchOrder = useCallback(async (orderId: string, accessToken: string) => {
    const response = await fetch(`${API_URL}/api/orders/${orderId}/payment`, {
      headers: {
        [PAYMENT_ACCESS_HEADER]: accessToken,
      },
    });
    const json = (await response.json()) as {
      success: boolean;
      data?: CheckoutOrder;
      error?: string;
    };

    if (!response.ok || !json.success || !json.data) {
      throw new Error(json.error || "Gagal mengambil data pembayaran.");
    }

    return json.data;
  }, []);

  const syncOrder = useCallback(
    async (orderId: string, accessToken: string, silent = false) => {
      if (!silent) {
        setSyncing(true);
      }

      try {
        const response = await fetch(
          `${API_URL}/api/orders/${orderId}/payment/sync`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              [PAYMENT_ACCESS_HEADER]: accessToken,
            },
          }
        );

        const json = (await response.json()) as {
          success: boolean;
          data?: CheckoutOrder;
          error?: string;
        };

        if (!response.ok || !json.success || !json.data) {
          throw new Error(json.error || "Gagal memeriksa status pembayaran.");
        }

        persistOrder(json.data);
        setErrorMessage("");
      } catch (error) {
        if (!silent) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Gagal memeriksa status pembayaran."
          );
        }
      } finally {
        if (!silent) {
          setSyncing(false);
        }
      }
    },
    [persistOrder]
  );

  const simulateSandboxPayment = useCallback(async () => {
    if (!order?.paymentAccess?.token) {
      return;
    }

    setSimulating(true);

    try {
      const response = await fetch(
        `${API_URL}/api/orders/${order.id}/payment/simulate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            [PAYMENT_ACCESS_HEADER]: order.paymentAccess.token,
          },
        }
      );

      const json = (await response.json()) as {
        success: boolean;
        data?: CheckoutOrder;
        error?: string;
      };

      if (!response.ok || !json.success || !json.data) {
        throw new Error(json.error || "Gagal mensimulasikan pembayaran sandbox.");
      }

      persistOrder(json.data);
      setErrorMessage("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Gagal mensimulasikan pembayaran sandbox."
      );
    } finally {
      setSimulating(false);
    }
  }, [order, persistOrder]);

  useEffect(() => {
    let cancelled = false;

    const storedRaw = localStorage.getItem(ORDER_STORAGE_KEY);
    let storedOrder: CheckoutOrder | null = null;

    if (storedRaw) {
      try {
        storedOrder = JSON.parse(storedRaw) as CheckoutOrder;
      } catch {
        localStorage.removeItem(ORDER_STORAGE_KEY);
      }
    }

    const targetOrderId = queryOrderId || storedOrder?.id;
    const targetToken = queryToken || storedOrder?.paymentAccess?.token;

    if (!targetOrderId) {
      router.replace("/");
      return;
    }

    if (!targetToken) {
      setErrorMessage(
        "Sesi pembayaran tidak valid atau sudah berakhir. Silakan ulangi checkout."
      );
      setLoading(false);
      return;
    }

    if (storedOrder && storedOrder.id === targetOrderId) {
      setOrder(storedOrder);
    }

    const loadOrder = async () => {
      try {
        const nextOrder = await fetchOrder(targetOrderId, targetToken);

        if (cancelled) {
          return;
        }

        persistOrder(nextOrder);

        if (queryToken) {
          window.history.replaceState(
            null,
            "",
            `/payment?order=${encodeURIComponent(targetOrderId)}`
          );
        }

        if (!isPaid(nextOrder) && nextOrder.payment.status === "pending") {
          await syncOrder(targetOrderId, targetToken, true);
        } else if (
          isPaid(nextOrder) &&
          nextOrder.delivery.emailStatus !== "sent"
        ) {
          await syncOrder(targetOrderId, targetToken, true);
        }
      } catch (error) {
        if (!cancelled) {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : "Gagal memuat data pembayaran."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    void loadOrder();

    return () => {
      cancelled = true;
    };
  }, [fetchOrder, persistOrder, queryOrderId, queryToken, router, syncOrder]);

  useEffect(() => {
    const expiresAt = order?.payment.expiresAt;

    if (!expiresAt || !order || isPaid(order)) {
      setTimeLeft(null);
      return;
    }

    const updateCountdown = () => {
      const remainingMs = new Date(expiresAt).getTime() - Date.now();
      setTimeLeft(Math.max(0, Math.ceil(remainingMs / 1000)));
    };

    updateCountdown();
    const timer = window.setInterval(updateCountdown, 1000);

    return () => window.clearInterval(timer);
  }, [order]);

  useEffect(() => {
    if (
      !order?.id ||
      !order.paymentAccess?.token ||
      isPaid(order) ||
      order.payment.status !== "pending"
    ) {
      return;
    }

    const timer = window.setInterval(() => {
      void syncOrder(order.id, order.paymentAccess.token, true);
    }, 7000);

    return () => window.clearInterval(timer);
  }, [order, syncOrder]);

  const handleCopyOrderId = useCallback(() => {
    if (!order) {
      return;
    }

    navigator.clipboard.writeText(order.orderId);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 2000);
  }, [order]);

  const statusLabel = useMemo(() => {
    if (!order) {
      return "";
    }

    if (isPaid(order)) {
      return "Pembayaran berhasil diverifikasi.";
    }

    if (order.payment.status === "canceled") {
      return "Transaksi dibatalkan.";
    }

    if (order.payment.status === "expired" || timeLeft === 0) {
      return "Sesi pembayaran telah berakhir.";
    }

    return "Menunggu pembayaran QRIS.";
  }, [order, timeLeft]);

  const deliveryMessage = order ? getDeliveryMessage(order) : "";

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
          <h1 className="font-display text-xl font-extrabold text-slate-900">
            Data pembayaran tidak ditemukan
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {errorMessage || "Silakan ulangi checkout dari halaman utama."}
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex btn-primary px-6 py-3 text-sm font-semibold text-white rounded-xl"
          >
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    );
  }

  if (isPaid(order)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-brand-50/30 px-4">
        <div className="bg-white max-w-md w-full p-10 rounded-3xl border border-slate-100 shadow-xl text-center">
          <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <i className="ph-duotone ph-check-circle text-5xl text-green-600"></i>
          </div>
          <h1 className="font-display text-2xl font-extrabold text-slate-900">
            Pembayaran <span className="gradient-text">Berhasil!</span>
          </h1>
          <p className="mt-3 text-sm text-slate-500 leading-relaxed">
            {deliveryMessage}
          </p>
          <div className="mt-6 rounded-2xl bg-slate-50 p-4 text-left space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Order ID</span>
              <span className="font-bold text-slate-900">{order.orderId}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Subtotal</span>
              <span className="font-semibold text-slate-700">
                {formatCurrency(order.pricing.subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-400">Biaya QRIS</span>
              <span className="font-semibold text-slate-700">
                {formatCurrency(order.pricing.fee)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-200">
              <span className="text-slate-400">Total Dibayar</span>
              <span className="font-bold text-brand-600">
                {formatCurrency(order.pricing.totalPayment)}
              </span>
            </div>
            <div className="flex items-center justify-between text-sm pt-2 border-t border-slate-200">
              <span className="text-slate-400">Status Pengiriman</span>
              <span className="font-semibold text-slate-700 capitalize">
                {order.delivery.emailStatus === "sent"
                  ? "Email terkirim"
                  : order.delivery.status === "manual_review"
                    ? "Perlu review manual"
                    : order.delivery.status === "failed"
                      ? "Gagal terkirim"
                      : "Sedang diproses"}
              </span>
            </div>
          </div>
          <div className="mt-6 space-y-3">
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Halo admin, pembayaran order ${order.orderId} sudah berhasil. Mohon diproses ya.`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3.5 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              <i className="ph-duotone ph-whatsapp-logo text-lg"></i>
              Konfirmasi via WhatsApp
            </a>
            <Link
              href="/"
              className="w-full py-3.5 bg-white border-2 border-slate-200 text-slate-700 text-sm font-semibold rounded-xl flex items-center justify-center gap-2"
            >
              <i className="ph-duotone ph-house text-lg"></i>
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isExpired = order.payment.status === "expired" || timeLeft === 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30">
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
            <button
              type="button"
              onClick={() => router.push("/checkout")}
              className="text-sm text-slate-500 hover:text-brand-600 transition-colors flex items-center gap-1"
            >
              <i className="ph-duotone ph-arrow-left text-base"></i>
              Kembali
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">
          <section className="lg:col-span-3 space-y-6">
            <div>
              <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900">
                Pembayaran <span className="gradient-text">QRIS</span>
              </h1>
              <p className="mt-2 text-sm text-slate-500">{statusLabel}</p>
            </div>

            <div
              className={`rounded-2xl border p-4 flex items-center justify-between gap-4 ${
                isExpired
                  ? "bg-red-50 border-red-200"
                  : "bg-amber-50 border-amber-200"
              }`}
            >
              <div>
                <p
                  className={`text-sm font-semibold ${
                    isExpired ? "text-red-700" : "text-amber-700"
                  }`}
                >
                  {isExpired
                    ? "Waktu pembayaran habis"
                    : "Selesaikan pembayaran sebelum expired"}
                </p>
                <p
                  className={`text-xs mt-1 ${
                    isExpired ? "text-red-600" : "text-amber-600"
                  }`}
                >
                  {order.payment.expiresAt
                    ? new Date(order.payment.expiresAt).toLocaleString("id-ID")
                    : "Menunggu data expired dari gateway"}
                </p>
              </div>
              {!isExpired && timeLeft !== null && (
                <span className="text-2xl font-display font-extrabold text-amber-700">
                  {formatTime(timeLeft)}
                </span>
              )}
            </div>

            {errorMessage && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 lg:p-8">
              {order.payment.number ? (
                <div className="w-64 h-64 mx-auto rounded-3xl bg-gradient-to-br from-brand-50 via-white to-slate-50 border border-brand-100 flex flex-col items-center justify-center text-center px-4 relative overflow-hidden shadow-sm">
                  <div className="absolute inset-0 bg-brand-500/5 mix-blend-multiply rounded-3xl"></div>
                   <div className="relative z-10 bg-white p-3 rounded-2xl shadow-sm border border-slate-100">
                     <QRCodeSVG value={order.payment.number} size={180} />
                   </div>
                  <p className="relative z-10 mt-3 text-xs font-semibold text-slate-700 tracking-wide">
                    Scan via QRIS / E-Wallet
                  </p>
                </div>
              ) : (
                <div className="w-64 h-64 mx-auto rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-center px-8">
                   <p className="text-sm text-slate-500">Menunggu antrean QRIS...</p>
                </div>
              )}

              <div className="mt-6 rounded-2xl bg-slate-50 p-5 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Subtotal Produk</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(order.pricing.subtotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">Biaya QRIS Pakasir</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(order.pricing.fee)}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-3 border-t border-slate-200">
                  <span className="text-base font-bold text-slate-900">
                    Total Dibayar
                  </span>
                  <span className="text-2xl font-display font-extrabold text-brand-600">
                    {formatCurrency(order.pricing.totalPayment)}
                  </span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                <a
                  href={order.payment.paymentUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full btn-primary py-4 text-base font-semibold text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25"
                >
                  <i className="ph-duotone ph-arrow-square-out text-xl"></i>
                  Buka di Tab Baru
                </a>
                <button
                  type="button"
                  onClick={() =>
                    void syncOrder(order.id, order.paymentAccess.token)
                  }
                  disabled={syncing}
                  className="w-full py-4 text-base font-semibold text-brand-700 bg-brand-50 border border-brand-200 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {syncing ? (
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
                      <i className="ph-duotone ph-arrows-clockwise text-xl"></i>
                      Cek Status Pembayaran
                    </>
                  )}
                </button>
                {order.payment.sandboxMode && (
                  <button
                    type="button"
                    onClick={() => void simulateSandboxPayment()}
                    disabled={simulating}
                    className="w-full py-4 text-base font-semibold text-white bg-slate-900 rounded-2xl flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {simulating ? (
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
                        Memverifikasi Sandbox...
                      </>
                    ) : (
                      <>
                        <i className="ph-duotone ph-flask text-xl"></i>
                        Verifikasi Langsung (Sandbox)
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </section>

          <aside className="lg:col-span-2">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-3">
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
                >
                  {copied ? (
                    <i className="ph-duotone ph-check text-lg text-green-600"></i>
                  ) : (
                    <i className="ph-duotone ph-copy text-lg"></i>
                  )}
                </button>
              </div>

              <div className="mt-5 space-y-2 text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <i className="ph-duotone ph-user text-base text-brand-400"></i>
                  <span>{order.customer.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="ph-duotone ph-envelope-simple text-base text-brand-400"></i>
                  <span>{order.customer.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="ph-duotone ph-whatsapp-logo text-base text-brand-400"></i>
                  <span>{order.customer.phone}</span>
                </div>
              </div>

              <div className="mt-6 space-y-3">
                {order.items.map((item) => (
                  <div
                    key={`${item.id}-${item.name}`}
                    className="flex items-center justify-between"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.name}
                      </p>
                      <p className="text-xs text-slate-400">
                        {item.quantity}x @ {formatCurrency(item.price)}
                      </p>
                    </div>
                    <span className="text-sm font-bold text-slate-900">
                      {formatCurrency(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 p-4">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-semibold">
                  Status Gateway
                </p>
                <p className="mt-2 text-sm font-semibold text-slate-900">
                  {statusLabel}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
