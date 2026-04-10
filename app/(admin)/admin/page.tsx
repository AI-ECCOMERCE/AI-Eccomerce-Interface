"use client";

import { useState, useEffect } from "react";
import { adminFetch } from "@/lib/api/adminFetch";

interface DashboardData {
  stats: {
    total_revenue: number;
    total_orders: number;
    unique_customers: number;
    active_products: number;
    pending_orders: number;
  };
  recent_orders: any[];
  top_products: any[];
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const json = await adminFetch<{ success: boolean; data: DashboardData }>("/api/dashboard");
        if (json.success) setData(json.data);
      } catch (err) {
        console.error("Failed to fetch dashboard:", err);
        setErrorMessage(err instanceof Error ? err.message : "Gagal memuat dashboard admin.");
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `Rp ${(val / 1000).toFixed(0)}K`;
    return `Rp ${val.toLocaleString("id-ID")}`;
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400">Memuat dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-8 text-center text-slate-500">
        <p>{errorMessage || "Gagal memuat data. Pastikan API server berjalan di port 4000."}</p>
      </div>
    );
  }

  const stats = [
    { label: "Total Pendapatan", value: formatCurrency(data.stats.total_revenue), icon: "ph-currency-circle-dollar", iconBg: "bg-green-100", iconColor: "text-green-600" },
    { label: "Total Pesanan", value: data.stats.total_orders.toLocaleString("id-ID"), icon: "ph-shopping-bag", iconBg: "bg-brand-100", iconColor: "text-brand-600" },
    { label: "Pelanggan", value: data.stats.unique_customers.toLocaleString("id-ID"), icon: "ph-users", iconBg: "bg-blue-100", iconColor: "text-blue-600" },
    { label: "Produk Aktif", value: data.stats.active_products.toString(), icon: "ph-package", iconBg: "bg-amber-100", iconColor: "text-amber-600" },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500 mt-1">Selamat datang kembali, Admin! Berikut ringkasan bisnismu.</p>
        </div>
        {data.stats.pending_orders > 0 && (
          <a href="/admin/orders" className="px-4 py-2.5 bg-red-50 border border-red-200 rounded-xl text-sm font-semibold text-red-600 flex items-center gap-2 hover:bg-red-100 transition-all">
            <i className="ph-duotone ph-warning-circle text-lg"></i>
            {data.stats.pending_orders} pesanan perlu diproses
          </a>
        )}
      </div>

      {/* Stat Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="stat-card bg-white rounded-2xl border border-slate-100 p-5">
            <div className="flex items-start justify-between mb-4">
              <div className={`w-11 h-11 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                <i className={`ph-duotone ${stat.icon} text-xl ${stat.iconColor}`}></i>
              </div>
            </div>
            <p className="text-sm text-slate-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-display font-extrabold text-slate-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid xl:grid-cols-5 gap-6">
        {/* Recent Orders */}
        <div className="xl:col-span-3 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">Pesanan Terbaru</h3>
              <p className="text-xs text-slate-400 mt-0.5">{data.recent_orders.length} pesanan terakhir</p>
            </div>
            <a href="/admin/orders" className="text-sm font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1 transition-colors">
              Lihat Semua <i className="ph-bold ph-arrow-right text-xs"></i>
            </a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-50">
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Order ID</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Pelanggan</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Total</th>
                  <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_orders.length === 0 ? (
                  <tr><td colSpan={4} className="px-5 py-10 text-center text-sm text-slate-400">Belum ada pesanan</td></tr>
                ) : (
                  data.recent_orders.map((order: any) => (
                    <tr key={order.id} className="table-row border-b border-slate-50 last:border-0">
                      <td className="px-5 py-3.5 text-sm font-mono font-bold text-brand-600">{order.order_id}</td>
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-semibold text-slate-900">{order.customer_name}</p>
                        <p className="text-xs text-slate-400">{order.customer_email}</p>
                      </td>
                      <td className="px-5 py-3.5 text-sm font-bold text-slate-900">Rp {order.total_price?.toLocaleString("id-ID")}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                          order.status === "completed" || order.status === "paid" ? "badge-success" : order.status === "cancelled" ? "badge-danger" : "badge-warning"
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            order.status === "completed" || order.status === "paid" ? "bg-green-500" : order.status === "cancelled" ? "bg-red-500" : "bg-amber-500"
                          }`}></span>
                          {order.status === "completed" ? "Selesai" : order.status === "paid" ? "Dibayar" : order.status === "pending" ? "Menunggu" : order.status === "processing" ? "Diproses" : "Dibatalkan"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Products */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b border-slate-100">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">Produk Terlaris</h3>
              <p className="text-xs text-slate-400 mt-0.5">Berdasarkan total terjual</p>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {data.top_products.length === 0 ? (
              <p className="text-sm text-slate-400 text-center py-8">Belum ada data</p>
            ) : (
              data.top_products.map((product: any) => {
                const maxSold = data.top_products[0]?.sold || 1;
                const percentage = Math.round((product.sold / maxSold) * 100);
                return (
                  <div key={product.name} className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center flex-shrink-0`}>
                      <i className={`ph-duotone ${product.icon} text-lg text-white`}></i>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-semibold text-slate-900 truncate">{product.name}</p>
                        <p className="text-xs font-bold text-slate-500">{product.sold} sold</p>
                      </div>
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full bg-gradient-to-r ${product.gradient} rounded-full`} style={{ width: `${percentage}%` }}></div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
