"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/api/adminFetch";

type DashboardStats = {
  total_revenue: number;
  total_orders: number;
  unique_customers: number;
  active_products: number;
  pending_orders: number;
};

type SalesProduct = {
  id: string;
  name: string;
  sold: number;
  price: number;
  gradient: string;
  icon: string;
  category_slug: string;
  categories?: {
    name: string;
  } | null;
};

type SalesOrder = {
  created_at: string;
  status: string;
  total_price: number;
};

type CategoryRevenue = {
  category: string;
  revenue: number;
};

type DailySalesRow = {
  date: string;
  revenue: number;
  count: number;
};

export default function SalesPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [orders, setOrders] = useState<SalesOrder[]>([]);
  const [products, setProducts] = useState<SalesProduct[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [dashData, ordersData, productsData] = await Promise.all([
          adminFetch<{ success: boolean; data: { stats: DashboardStats } }>("/api/dashboard"),
          adminFetch<{ success: boolean; data: SalesOrder[] }>("/api/orders"),
          adminFetch<{ success: boolean; data: SalesProduct[] }>("/api/products"),
        ]);

        if (dashData.success) setStats(dashData.data.stats);
        if (ordersData.success) setOrders(ordersData.data);
        if (productsData.success) setProducts(productsData.data);
      } catch (err) {
        console.error("Failed to fetch sales data:", err);
        setErrorMessage(err instanceof Error ? err.message : "Gagal memuat laporan penjualan.");
      } finally {
        setLoading(false);
      }
    }

    void fetchAll();
  }, []);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `Rp ${(val / 1000).toFixed(0)}K`;
    return `Rp ${val.toLocaleString("id-ID")}`;
  };

  const categoryList = useMemo(() => {
    const categoryRevenue = products.reduce<Record<string, CategoryRevenue>>((acc, product) => {
      const category = product.categories?.name || product.category_slug;
      if (!acc[category]) {
        acc[category] = { category, revenue: 0 };
      }
      acc[category].revenue += product.sold * product.price;
      return acc;
    }, {});

    return Object.values(categoryRevenue).sort((a, b) => b.revenue - a.revenue);
  }, [products]);

  const maxCatRevenue = categoryList.length > 0 ? categoryList[0].revenue : 1;

  const dailySales = useMemo(() => {
    const ordersByDate = orders.reduce<Record<string, DailySalesRow>>((acc, order) => {
      const date = new Date(order.created_at).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });

      if (!acc[date]) {
        acc[date] = { date, revenue: 0, count: 0 };
      }

      if (["paid", "completed"].includes(order.status)) {
        acc[date].revenue += order.total_price;
      }

      acc[date].count += 1;
      return acc;
    }, {});

    return Object.values(ordersByDate).slice(0, 7);
  }, [orders]);

  const topProducts = useMemo(
    () => [...products].sort((a, b) => b.sold - a.sold).slice(0, 5),
    [products]
  );

  const maxSold = topProducts[0]?.sold || 1;

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400">Memuat laporan...</p>
        </div>
      </div>
    );
  }

  const totalRevenue = stats?.total_revenue || 0;
  const totalOrders = stats?.total_orders || 0;
  const avgOrder = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900">Laporan Penjualan</h1>
          <p className="text-sm text-slate-500 mt-1">Analisis performa penjualan dan pendapatan.</p>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <div className="grid sm:grid-cols-3 gap-5 mb-8">
        <div className="bg-gradient-to-br from-brand-600 to-brand-700 rounded-2xl p-6 text-white">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center"><i className="ph-duotone ph-chart-line-up text-xl"></i></div>
            <span className="text-sm font-medium text-brand-200">Total Revenue</span>
          </div>
          <p className="text-3xl font-display font-extrabold">{formatCurrency(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center"><i className="ph-duotone ph-receipt text-xl text-green-600"></i></div>
            <span className="text-sm font-medium text-slate-500">Total Transaksi</span>
          </div>
          <p className="text-3xl font-display font-extrabold text-slate-900">{totalOrders.toLocaleString("id-ID")}</p>
        </div>
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center"><i className="ph-duotone ph-shopping-bag text-xl text-blue-600"></i></div>
            <span className="text-sm font-medium text-slate-500">Rata-rata Order</span>
          </div>
          <p className="text-3xl font-display font-extrabold text-slate-900">{formatCurrency(avgOrder)}</p>
        </div>
      </div>

      <div className="grid xl:grid-cols-3 gap-6 mb-8">
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-display font-bold text-lg text-slate-900 mb-6">Produk Terlaris</h3>
          <div className="space-y-4">
            {topProducts.map((product) => {
              const pct = Math.round((product.sold / maxSold) * 100);
              return (
                <div key={product.id} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center flex-shrink-0`}><i className={`ph-duotone ${product.icon} text-lg text-white`}></i></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                      <p className="text-xs font-bold text-slate-500">{product.sold} sold · {formatCurrency(product.sold * product.price)}</p>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${product.gradient} rounded-full`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-display font-bold text-lg text-slate-900 mb-6">Revenue per Kategori</h3>
          {categoryList.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Belum ada data</p>
          ) : (
            <div className="space-y-4">
              {categoryList.map((category) => {
                const pct = Math.round((category.revenue / maxCatRevenue) * 100);
                return (
                  <div key={category.category}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-slate-700">{category.category}</span>
                      <span className="text-xs font-bold text-slate-500">{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{formatCurrency(category.revenue)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="p-5 border-b border-slate-100">
          <h3 className="font-display font-bold text-lg text-slate-900">Detail Penjualan</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Tanggal</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Pendapatan</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Pesanan</th>
              </tr>
            </thead>
            <tbody>
              {dailySales.length === 0 ? (
                <tr><td colSpan={3} className="px-5 py-12 text-center text-sm text-slate-400">Belum ada data penjualan</td></tr>
              ) : dailySales.map((day) => (
                <tr key={day.date} className="table-row border-b border-slate-50 last:border-0">
                  <td className="px-5 py-4 text-sm font-semibold text-slate-900">{day.date}</td>
                  <td className="px-5 py-4 text-sm font-bold text-green-600">Rp {day.revenue.toLocaleString("id-ID")}</td>
                  <td className="px-5 py-4 text-sm text-slate-600">{day.count} order</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
