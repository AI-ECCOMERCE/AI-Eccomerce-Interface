"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export default function SalesPage() {
  const [stats, setStats] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [dashRes, ordersRes, productsRes] = await Promise.all([
          fetch(`${API_URL}/api/dashboard`),
          fetch(`${API_URL}/api/orders`),
          fetch(`${API_URL}/api/products`),
        ]);
        const dashData = await dashRes.json();
        const ordersData = await ordersRes.json();
        const productsData = await productsRes.json();

        if (dashData.success) setStats(dashData.data.stats);
        if (ordersData.success) setOrders(ordersData.data);
        if (productsData.success) setProducts(productsData.data);
      } catch (err) {
        console.error("Failed to fetch sales data:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  const formatCurrency = (val: number) => {
    if (val >= 1000000) return `Rp ${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `Rp ${(val / 1000).toFixed(0)}K`;
    return `Rp ${val.toLocaleString("id-ID")}`;
  };

  // Group orders by category
  const categoryRevenue = products.reduce((acc: Record<string, { category: string; revenue: number }>, p: any) => {
    const cat = p.categories?.name || p.category_slug;
    if (!acc[cat]) acc[cat] = { category: cat, revenue: 0 };
    acc[cat].revenue += p.sold * p.price;
    return acc;
  }, {});
  const categoryList = Object.values(categoryRevenue).sort((a: any, b: any) => b.revenue - a.revenue);
  const maxCatRevenue = categoryList.length > 0 ? (categoryList[0] as any).revenue : 1;

  // Group orders by date
  const ordersByDate = orders.reduce((acc: Record<string, { date: string; revenue: number; count: number }>, o: any) => {
    const date = new Date(o.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });
    if (!acc[date]) acc[date] = { date, revenue: 0, count: 0 };
    if (["paid", "completed"].includes(o.status)) {
      acc[date].revenue += o.total_price;
    }
    acc[date].count += 1;
    return acc;
  }, {});
  const dailySales = Object.values(ordersByDate).slice(0, 7);

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

      {/* Revenue Cards */}
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
        {/* Top Products */}
        <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-display font-bold text-lg text-slate-900 mb-6">Produk Terlaris</h3>
          <div className="space-y-4">
            {products.sort((a: any, b: any) => b.sold - a.sold).slice(0, 5).map((p: any) => {
              const maxSold = products[0]?.sold || 1;
              const pct = Math.round((p.sold / maxSold) * 100);
              return (
                <div key={p.id} className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center flex-shrink-0`}><i className={`ph-duotone ${p.icon} text-lg text-white`}></i></div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-slate-900">{p.name}</p>
                      <p className="text-xs font-bold text-slate-500">{p.sold} sold · {formatCurrency(p.sold * p.price)}</p>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full bg-gradient-to-r ${p.gradient} rounded-full`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-100 p-6">
          <h3 className="font-display font-bold text-lg text-slate-900 mb-6">Revenue per Kategori</h3>
          {categoryList.length === 0 ? (
            <p className="text-sm text-slate-400 text-center py-8">Belum ada data</p>
          ) : (
            <div className="space-y-4">
              {categoryList.map((cat: any) => {
                const pct = Math.round((cat.revenue / maxCatRevenue) * 100);
                return (
                  <div key={cat.category}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-sm font-semibold text-slate-700">{cat.category}</span>
                      <span className="text-xs font-bold text-slate-500">{pct}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: `${pct}%` }}></div>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">{formatCurrency(cat.revenue)}</p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Daily Sales */}
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
              ) : dailySales.map((day: any) => (
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
