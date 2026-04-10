"use client";

import { useState, useEffect } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Customer {
  name: string;
  email: string;
  phone: string;
  total_orders: number;
  total_spent: number;
  last_order: string;
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const res = await fetch(`${API_URL}/api/customers`);
        const json = await res.json();
        if (json.success) setCustomers(json.data);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400">Memuat pelanggan...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900">Pelanggan</h1>
          <p className="text-sm text-slate-500 mt-1">Daftar semua pelanggan yang pernah melakukan pembelian.</p>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 px-4 py-2.5 flex items-center gap-2">
          <i className="ph-duotone ph-users-three text-lg text-brand-600"></i>
          <span className="text-sm font-bold text-slate-900">{customers.length}</span>
          <span className="text-xs text-slate-400">pelanggan</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Pelanggan</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">WhatsApp</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Total Order</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Total Belanja</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Terakhir Order</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {customers.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">Belum ada pelanggan</td></tr>
              ) : customers.map(c => (
                <tr key={c.email} className="table-row border-b border-slate-50 last:border-0">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">{c.name.charAt(0)}</div>
                      <div><p className="text-sm font-semibold text-slate-900">{c.name}</p><p className="text-xs text-slate-400">{c.email}</p></div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-slate-600">{c.phone}</td>
                  <td className="px-5 py-4 text-sm font-bold text-slate-900">{c.total_orders}</td>
                  <td className="px-5 py-4 text-sm font-bold text-green-600">Rp {c.total_spent.toLocaleString("id-ID")}</td>
                  <td className="px-5 py-4 text-sm text-slate-500">{new Date(c.last_order).toLocaleDateString("id-ID")}</td>
                  <td className="px-5 py-4 text-right">
                    <a href={`https://wa.me/${c.phone}`} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all inline-flex"><i className="ph-duotone ph-whatsapp-logo text-base"></i></a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
