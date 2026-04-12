"use client";

import { useState, useEffect } from "react";
import { adminFetch } from "@/lib/api/adminFetch";
import Pagination from "@/app/components/admin/Pagination";

interface Customer {
  name: string;
  email: string;
  phone: string;
  total_orders: number;
  total_spent: number;
  last_order: string;
  order_ids: string[];
}

interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_id: string;
  total_price: number;
  status: string;
  payment_method: string;
  created_at: string;
  order_items: OrderItem[];
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [customerOrders, setCustomerOrders] = useState<Order[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  useEffect(() => {
    async function fetchCustomers() {
      try {
        const json = await adminFetch<{ success: boolean; data: Customer[] }>("/api/customers");
        if (json.success) setCustomers(json.data);
      } catch (err) {
        console.error("Failed to fetch customers:", err);
        setErrorMessage(err instanceof Error ? err.message : "Gagal memuat data pelanggan.");
      } finally {
        setLoading(false);
      }
    }

    fetchCustomers();
  }, []);

  const handleOpenDetail = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setOrdersLoading(true);
    try {
      const json = await adminFetch<{ success: boolean; data: Order[] }>(`/api/orders?search=${encodeURIComponent(customer.email)}`);
      if (json.success) {
        setCustomerOrders(json.data);
      }
    } catch (err) {
      console.error("Failed to fetch customer orders:", err);
    } finally {
      setOrdersLoading(false);
    }
  };

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

  const filteredCustomers = customers.filter(c => {
    const q = searchQuery.toLowerCase();
    return c.name.toLowerCase().includes(q) || 
           c.email.toLowerCase().includes(q) ||
           (c.order_ids && c.order_ids.some(id => id.toLowerCase().includes(q)));
  });

  const totalPages = Math.ceil(filteredCustomers.length / ITEMS_PER_PAGE);
  const paginatedCustomers = filteredCustomers.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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

      {errorMessage && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-slate-100">
          <div className="relative flex-1 max-w-md">
            <i className="ph-duotone ph-magnifying-glass text-lg text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            <input 
              type="text" 
              placeholder="Cari berdasarkan nama, email, atau Order ID..." 
              value={searchQuery} 
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }} 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" 
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Pelanggan</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">WhatsApp</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Total Order</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Total Belanja</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Terakhir</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">Belum ada pelanggan</td></tr>
              ) : paginatedCustomers.map(c => (
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
                    <div className="flex items-center justify-end gap-1">
                      <a href={`https://wa.me/${c.phone}`} target="_blank" rel="noopener noreferrer" className="p-2 text-slate-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all" title="WhatsApp"><i className="ph-duotone ph-whatsapp-logo text-base"></i></a>
                      <button onClick={() => handleOpenDetail(c)} className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all" title="Lihat Detail"><i className="ph-duotone ph-eye text-base"></i></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          totalItems={filteredCustomers.length}
          itemsPerPage={ITEMS_PER_PAGE}
        />
      </div>

      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setSelectedCustomer(null)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-xl font-display font-bold flex-shrink-0">
                  {selectedCustomer.name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-display font-bold text-lg text-slate-900">{selectedCustomer.name}</h3>
                  <p className="text-sm text-slate-500">{selectedCustomer.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCustomer(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all">
                <i className="ph-duotone ph-x text-xl"></i>
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-1">WhatsApp</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedCustomer.phone}</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-1">Total Pesanan</p>
                  <p className="text-sm font-semibold text-slate-900">{selectedCustomer.total_orders} Order</p>
                </div>
                <div className="bg-slate-50 rounded-xl p-4">
                  <p className="text-xs text-slate-400 mb-1">Total Belanja</p>
                  <p className="text-sm font-bold text-green-600">Rp {selectedCustomer.total_spent.toLocaleString("id-ID")}</p>
                </div>
              </div>

              <h4 className="text-md font-bold text-slate-900 mb-4">Riwayat Pesanan Pelanggan</h4>
              
              {ordersLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-8 h-8 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : customerOrders.length === 0 ? (
                <p className="text-slate-500 text-center py-8">Belum ada riwayat pesanan.</p>
              ) : (
                <div className="space-y-4">
                  {customerOrders.map(order => (
                    <div key={order.id} className="border border-slate-200 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3 pb-3 border-b border-slate-100">
                        <div>
                          <p className="text-xs text-slate-500">{new Date(order.created_at).toLocaleString("id-ID")}</p>
                          <p className="text-sm font-mono font-bold text-slate-900">#{order.order_id}</p>
                        </div>
                        <div className="text-right">
                          <span className={`inline-block px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider ${order.status === 'completed' || order.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'}`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {order.order_items.map((item, idx) => (
                           <div key={idx} className="flex justify-between items-center text-sm">
                             <p className="text-slate-600">{item.product_name} <span className="text-slate-400 text-xs">x{item.quantity}</span></p>
                             <p className="font-semibold text-slate-900">Rp {(item.price * item.quantity).toLocaleString("id-ID")}</p>
                           </div>
                        ))}
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-between items-center">
                        <span className="text-xs text-slate-500 uppercase">{order.payment_method || 'QRIS'}</span>
                        <span className="font-bold text-brand-600">Rp {order.total_price.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="p-6 border-t border-slate-100 flex justify-end">
               <a
                href={`https://wa.me/${selectedCustomer.phone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary py-2.5 px-6 text-sm font-semibold text-white rounded-xl flex items-center gap-2"
              >
                <i className="ph-duotone ph-whatsapp-logo text-lg"></i>
                Chat Pelanggan
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
