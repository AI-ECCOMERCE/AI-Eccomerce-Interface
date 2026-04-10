"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Order {
  id: string;
  order_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  total_price: number;
  status: string;
  payment_method: string;
  created_at: string;
  order_items?: { product_name: string; quantity: number; price: number; products?: { name: string } }[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/api/orders`);
      const json = await res.json();
      if (json.success) setOrders(json.data);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await fetch(`${API_URL}/api/orders/${id}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      fetchOrders();
      setSelectedOrder(null);
    } catch (err) {
      console.error("Failed to update:", err);
    }
  };

  const statusConfig: Record<string, { label: string; badgeClass: string; dotColor: string }> = {
    paid: { label: "Dibayar", badgeClass: "badge-success", dotColor: "bg-green-500" },
    pending: { label: "Menunggu", badgeClass: "badge-warning", dotColor: "bg-amber-500" },
    processing: { label: "Diproses", badgeClass: "badge-info", dotColor: "bg-blue-500" },
    completed: { label: "Selesai", badgeClass: "badge-success", dotColor: "bg-green-500" },
    cancelled: { label: "Dibatalkan", badgeClass: "badge-danger", dotColor: "bg-red-500" },
  };

  const tabs = [
    { id: "all", label: "Semua", count: orders.length },
    { id: "pending", label: "Menunggu", count: orders.filter(o => o.status === "pending").length },
    { id: "paid", label: "Dibayar", count: orders.filter(o => o.status === "paid").length },
    { id: "processing", label: "Diproses", count: orders.filter(o => o.status === "processing").length },
    { id: "completed", label: "Selesai", count: orders.filter(o => o.status === "completed").length },
  ];

  const filteredOrders = activeTab === "all" ? orders : orders.filter(o => o.status === activeTab);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400">Memuat pesanan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900">Pesanan</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola semua pesanan masuk dari pelanggan.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center"><i className="ph-duotone ph-receipt text-xl text-brand-600"></i></div>
          <div><p className="text-xs text-slate-400">Total Pesanan</p><p className="text-lg font-display font-extrabold text-slate-900">{orders.length}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center"><i className="ph-duotone ph-currency-circle-dollar text-xl text-green-600"></i></div>
          <div><p className="text-xs text-slate-400">Total Pendapatan</p><p className="text-lg font-display font-extrabold text-slate-900">Rp {orders.filter(o => ["paid","completed"].includes(o.status)).reduce((a,o) => a + o.total_price, 0).toLocaleString("id-ID")}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center"><i className="ph-duotone ph-hourglass-medium text-xl text-amber-600"></i></div>
          <div><p className="text-xs text-slate-400">Perlu Diproses</p><p className="text-lg font-display font-extrabold text-red-500">{orders.filter(o => ["pending","paid"].includes(o.status)).length}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center"><i className="ph-duotone ph-check-circle text-xl text-blue-600"></i></div>
          <div><p className="text-xs text-slate-400">Selesai</p><p className="text-lg font-display font-extrabold text-slate-900">{orders.filter(o => o.status === "completed").length}</p></div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex items-center gap-1 p-4 border-b border-slate-100 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${activeTab === tab.id ? "bg-brand-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-50"}`}>
              {tab.label}
              <span className={`w-5 h-5 rounded-md text-[10px] font-bold flex items-center justify-center ${activeTab === tab.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>{tab.count}</span>
            </button>
          ))}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Order ID</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Pelanggan</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Item</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Total</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">Belum ada pesanan</td></tr>
              ) : filteredOrders.map(order => {
                const sc = statusConfig[order.status] || statusConfig.pending;
                const itemNames = order.order_items?.map(i => i.product_name).join(", ") || "-";
                return (
                  <tr key={order.id} className="table-row border-b border-slate-50 last:border-0">
                    <td className="px-5 py-4 text-sm font-mono font-bold text-brand-600">{order.order_id}</td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-semibold text-slate-900">{order.customer_name}</p>
                      <p className="text-xs text-slate-400">{order.customer_email}</p>
                    </td>
                    <td className="px-5 py-4">
                      <p className="text-sm text-slate-700 truncate max-w-[200px]">{itemNames}</p>
                      <p className="text-xs text-slate-400">{order.order_items?.length || 0} item</p>
                    </td>
                    <td className="px-5 py-4 text-sm font-bold text-slate-900">Rp {order.total_price.toLocaleString("id-ID")}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${sc.badgeClass}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sc.dotColor}`}></span>
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button onClick={() => setSelectedOrder(order)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all" title="Detail"><i className="ph-duotone ph-eye text-base"></i></button>
                        {(order.status === "paid" || order.status === "pending") && (
                          <button onClick={() => handleUpdateStatus(order.id, "completed")} className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="Selesai"><i className="ph-duotone ph-check-circle text-base"></i></button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedOrder(null)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h3 className="font-display font-bold text-lg text-slate-900">Detail Pesanan</h3>
                <p className="text-sm font-mono text-brand-600 font-bold">{selectedOrder.order_id}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all"><i className="ph-duotone ph-x text-xl"></i></button>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Data Pelanggan</h4>
                <div className="bg-slate-50 rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm"><i className="ph-duotone ph-user text-base text-brand-400"></i><span className="text-slate-700">{selectedOrder.customer_name}</span></div>
                  <div className="flex items-center gap-2 text-sm"><i className="ph-duotone ph-envelope-simple text-base text-brand-400"></i><span className="text-slate-700">{selectedOrder.customer_email}</span></div>
                  <div className="flex items-center gap-2 text-sm"><i className="ph-duotone ph-phone text-base text-brand-400"></i><span className="text-slate-700">{selectedOrder.customer_phone}</span></div>
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Item Pesanan</h4>
                <div className="space-y-2">
                  {selectedOrder.order_items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                      <div><p className="text-sm font-semibold text-slate-900">{item.product_name}</p><p className="text-xs text-slate-400">{item.quantity}x @ Rp {item.price.toLocaleString("id-ID")}</p></div>
                      <span className="text-sm font-bold text-slate-900">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</span>
                    </div>
                  )) || <p className="text-sm text-slate-400">Tidak ada item</p>}
                </div>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="font-bold text-slate-900">Total</span>
                <span className="text-xl font-display font-extrabold text-brand-600">Rp {selectedOrder.total_price.toLocaleString("id-ID")}</span>
              </div>
            </div>
            <div className="flex items-center gap-3 p-6 border-t border-slate-100">
              {(selectedOrder.status === "paid" || selectedOrder.status === "pending") && (
                <button onClick={() => handleUpdateStatus(selectedOrder.id, "completed")} className="flex-1 btn-primary py-3 text-sm font-semibold text-white rounded-xl flex items-center justify-center gap-2">
                  <i className="ph-duotone ph-check-circle text-lg"></i>
                  Konfirmasi & Selesai
                </button>
              )}
              <a href={`https://wa.me/${selectedOrder.customer_phone}`} target="_blank" rel="noopener noreferrer" className="flex-1 py-3 text-sm font-semibold text-center text-green-700 bg-green-50 rounded-xl hover:bg-green-100 transition-all flex items-center justify-center gap-2">
                <i className="ph-duotone ph-whatsapp-logo text-lg"></i>
                Hubungi
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
