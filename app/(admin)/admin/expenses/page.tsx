"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/api/adminFetch";

type Expense = { id: string; date: string; category: string; description: string; amount: number; createdAt: string; };
type Income = { id: string; date: string; category: string; description: string; amount: number; createdAt: string; };
type DashboardStats = { total_revenue: number; total_orders: number; };

const EXPENSE_CATEGORIES = ["Pembelian Akun", "Biaya Operasional", "Iklan & Marketing", "Infrastruktur", "Gaji & Honorarium", "Lainnya"];
const INCOME_CATEGORIES = ["Penjualan Manual", "Deposit/Topup", "Layanan Khusus", "Sponsorship", "Pendapatan Lainnya"];

const CAT_ICON: Record<string, string> = { 
  "Pembelian Akun": "ph-key", "Biaya Operasional": "ph-buildings", "Iklan & Marketing": "ph-megaphone", "Infrastruktur": "ph-cloud", "Gaji & Honorarium": "ph-users", "Lainnya": "ph-dots-three-circle",
  "Penjualan Manual": "ph-shopping-cart", "Deposit/Topup": "ph-wallet", "Layanan Khusus": "ph-briefcase", "Sponsorship": "ph-handshake", "Pendapatan Lainnya": "ph-dots-three-circle"
};
const CAT_COLOR: Record<string, string> = { 
  "Pembelian Akun": "text-violet-500", "Biaya Operasional": "text-orange-500", "Iklan & Marketing": "text-blue-500", "Infrastruktur": "text-cyan-500", "Gaji & Honorarium": "text-emerald-500", "Lainnya": "text-slate-500",
  "Penjualan Manual": "text-emerald-500", "Deposit/Topup": "text-blue-500", "Layanan Khusus": "text-violet-500", "Sponsorship": "text-orange-500", "Pendapatan Lainnya": "text-slate-500"
};
const CAT_BG: Record<string, string> = { 
  "Pembelian Akun": "bg-violet-50", "Biaya Operasional": "bg-orange-50", "Iklan & Marketing": "bg-blue-50", "Infrastruktur": "bg-cyan-50", "Gaji & Honorarium": "bg-emerald-50", "Lainnya": "bg-slate-50",
  "Penjualan Manual": "bg-emerald-50", "Deposit/Topup": "bg-blue-50", "Layanan Khusus": "bg-violet-50", "Sponsorship": "bg-orange-50", "Pendapatan Lainnya": "bg-slate-50"
};
const CAT_HEX: Record<string, string> = { 
  "Pembelian Akun": "#8b5cf6", "Biaya Operasional": "#f97316", "Iklan & Marketing": "#3b82f6", "Infrastruktur": "#06b6d4", "Gaji & Honorarium": "#10b981", "Lainnya": "#64748b",
  "Penjualan Manual": "#10b981", "Deposit/Topup": "#3b82f6", "Layanan Khusus": "#8b5cf6", "Sponsorship": "#f97316", "Pendapatan Lainnya": "#64748b"
};

function fmtShort(v: number) {
  if (v >= 1e9) return `Rp ${(v / 1e9).toFixed(1)}M`;
  if (v >= 1e6) return `Rp ${(v / 1e6).toFixed(1)}Jt`;
  if (v >= 1e3) return `Rp ${(v / 1e3).toFixed(0)}K`;
  return `Rp ${v.toLocaleString("id-ID")}`;
}
function fmtFull(v: number) { return `Rp ${v.toLocaleString("id-ID")}`; }
function toRpInput(r: string) { const d = r.replace(/[^0-9]/g, ""); return d ? Number(d).toLocaleString("id-ID") : ""; }
function fromRpInput(v: string) { return parseFloat(v.replace(/[^0-9]/g, "")) || 0; }
function fmtDate(iso: string) { return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }); }

export default function ExpensesPage() {
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [incomes, setIncomes] = useState<Income[]>([]);
  
  const [totalRevenue, setTotalRevenue] = useState(0); // From dashboard (orders)
  const [loadingRevenue, setLoadingRevenue] = useState(true);
  
  const [formExpense, setFormExpense] = useState({ date: new Date().toISOString().split("T")[0], category: EXPENSE_CATEGORIES[0], description: "", amount: "" });
  const [formIncome, setFormIncome] = useState({ date: new Date().toISOString().split("T")[0], category: INCOME_CATEGORIES[0], description: "", amount: "" });
  
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [filterMonth, setFilterMonth] = useState("all");  
  const [filterCategory, setFilterCategory] = useState("all");
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const [resExp, resInc] = await Promise.all([
        adminFetch<{ success: boolean; data: any[] }>("/api/expenses"),
        adminFetch<{ success: boolean; data: any[] }>("/api/incomes")
      ]);
      
      if (resExp.success && Array.isArray(resExp.data)) {
        setExpenses(resExp.data.map(e => ({ ...e, createdAt: e.created_at || e.createdAt })));
      }
      if (resInc.success && Array.isArray(resInc.data)) {
        setIncomes(resInc.data.map(i => ({ ...i, createdAt: i.created_at || i.createdAt })));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadData(); }, []);
  useEffect(() => {
    adminFetch<{ success: boolean; data: { stats: DashboardStats } }>("/api/dashboard")
      .then(r => { if (r.success) setTotalRevenue(r.data.stats.total_revenue); })
      .catch(() => { }).finally(() => setLoadingRevenue(false));
  }, []);

  const totalExpense = useMemo(() => expenses.reduce((s, e) => s + e.amount, 0), [expenses]);
  const totalManualIncome = useMemo(() => incomes.reduce((s, i) => s + i.amount, 0), [incomes]);
  const combinedTotalRevenue = totalRevenue + totalManualIncome;
  const netBalance = combinedTotalRevenue - totalExpense;

  const currentData = activeTab === "expense" ? expenses : incomes;
  const currentCategories = activeTab === "expense" ? EXPENSE_CATEGORIES : INCOME_CATEGORIES;

  const availableMonths = useMemo(() => Array.from(new Set(currentData.map(e => new Date(e.date).toLocaleDateString("id-ID", { month: "long", year: "numeric" })))), [currentData]);

  const filtered = useMemo(() => currentData.filter(e => {
    const m = new Date(e.date).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
    if (filterMonth !== "all" && m !== filterMonth) return false;
    if (filterCategory !== "all" && e.category !== filterCategory) return false;
    return true;
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()), [currentData, filterMonth, filterCategory]);

  const breakdownData = useMemo(() =>
    currentCategories.map(cat => ({ cat, total: currentData.filter(e => e.category === cat).reduce((s, e) => s + e.amount, 0) }))
      .filter(d => d.total > 0).sort((a, b) => b.total - a.total),
    [currentData, currentCategories]
  );
  const maxBreakdown = Math.max(...breakdownData.map(d => d.total), 1);
  const totalBreakdown = breakdownData.reduce((s, d) => s + d.total, 0);

  async function handleSubmit(ev?: React.FormEvent) {
    if (ev) ev.preventDefault();
    if (isSubmitting) return;

    setFormError("");
    const form = activeTab === "expense" ? formExpense : formIncome;
    const amount = fromRpInput(form.amount);
    if (!form.description.trim()) { setFormError("Deskripsi tidak boleh kosong."); return; }
    if (amount <= 0) { setFormError("Jumlah harus lebih dari 0."); return; }

    setIsSubmitting(true);
    const endpoint = activeTab === "expense" ? "/api/expenses" : "/api/incomes";
    try {
      const res = await adminFetch<{ success: boolean; error?: string }>(endpoint, {
        method: "POST",
        body: JSON.stringify({
          date: form.date,
          category: form.category,
          description: form.description.trim(),
          amount
        })
      });
      if (!res.success) {
        setFormError(res.error || `Gagal menyimpan ${activeTab === "expense" ? "pengeluaran" : "pemasukan"}`);
        return;
      }
      await loadData();
      if (activeTab === "expense") {
        setFormExpense(f => ({ ...f, description: "", amount: "" }));
      } else {
        setFormIncome(f => ({ ...f, description: "", amount: "" }));
      }
    } catch (err: any) {
      setFormError(err.message || "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function del(id: string) {
    try {
      const endpoint = activeTab === "expense" ? `/api/expenses/${id}` : `/api/incomes/${id}`;
      await adminFetch(endpoint, { method: "DELETE" });
      await loadData();
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  }

  const totalView = filtered.reduce((s, e) => s + e.amount, 0);
  const form = activeTab === "expense" ? formExpense : formIncome;
  const setForm = activeTab === "expense" ? setFormExpense : setFormIncome as any;

  return (
    <div className="p-6 lg:p-8 min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900">
            Keuangan
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Catat & monitor seluruh pemasukan & biaya operasional bisnis
          </p>
        </div>
      </div>

      {/* ── Metric Row ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Pemasukan (Total)", value: loadingRevenue ? "—" : fmtShort(combinedTotalRevenue), icon: "ph-trend-up", bg: "bg-emerald-50", color: "text-emerald-600", valColor: "text-emerald-600" },
          { label: "Pengeluaran", value: fmtShort(totalExpense), icon: "ph-trend-down", bg: "bg-red-50", color: "text-red-600", valColor: "text-red-600" },
          { label: "Saldo Bersih", value: loadingRevenue ? "—" : fmtShort(Math.abs(netBalance)), icon: "ph-wallet", bg: "bg-brand-50", color: "text-brand-600", valColor: netBalance >= 0 ? "text-brand-600" : "text-red-600" },
          { label: "Total Transaksi", value: String(expenses.length + incomes.length), icon: "ph-receipt", bg: "bg-slate-100", color: "text-slate-600", valColor: "text-slate-900" },
        ].map(m => (
          <div key={m.label} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${m.bg} flex items-center justify-center`}>
              <i className={`ph-duotone ${m.icon} text-xl ${m.color}`}></i>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{m.label}</p>
              <p className={`text-lg font-display font-extrabold ${m.valColor} mt-0.5`}>{m.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-slate-100/50 p-1 rounded-xl w-fit mb-6 border border-slate-200/60">
        <button
          onClick={() => { setActiveTab("expense"); setFilterCategory("all"); setFilterMonth("all"); setFormError(""); }}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "expense"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
          }`}
        >
          <i className="ph-duotone ph-trend-down text-red-500"></i> Pengeluaran
        </button>
        <button
          onClick={() => { setActiveTab("income"); setFilterCategory("all"); setFilterMonth("all"); setFormError(""); }}
          className={`px-5 py-2.5 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${
            activeTab === "income"
              ? "bg-white text-slate-900 shadow-sm border border-slate-200/50"
              : "text-slate-500 hover:text-slate-700 hover:bg-slate-200/50"
          }`}
        >
          <i className="ph-duotone ph-trend-up text-emerald-500"></i> Pemasukan Manual
        </button>
      </div>

      {/* ── Main Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Form & Breakdown */}
        <div className="space-y-6 lg:col-span-1">
          {/* Form */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h2 className="font-display font-bold text-slate-900 flex items-center gap-2">
                <i className={`ph-duotone ph-plus-circle ${activeTab === 'expense' ? 'text-brand-500' : 'text-emerald-500'} text-lg`}></i>
                Tambah {activeTab === "expense" ? "Pengeluaran" : "Pemasukan"}
              </h2>
              <p className="text-xs text-slate-500 mt-1">Input data {activeTab === "expense" ? "pengeluaran" : "pemasukan"} baru secara manual</p>
            </div>
            <div className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Tanggal</label>
                <input type="date" value={form.date} onChange={e => setForm((f: any) => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Kategori</label>
                <select value={form.category} onChange={e => setForm((f: any) => ({ ...f, category: e.target.value }))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 cursor-pointer">
                  {currentCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Deskripsi</label>
                <input type="text" placeholder={activeTab === 'expense' ? "cth: Beli akun ChatGPT Plus" : "cth: Topup dari Klien A"} value={form.description} onChange={e => setForm((f: any) => ({ ...f, description: e.target.value }))} className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Jumlah</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-slate-400">Rp</span>
                  <input type="text" inputMode="numeric" placeholder="0" value={form.amount} onChange={e => setForm((f: any) => ({ ...f, amount: toRpInput(e.target.value) }))} className="w-full pl-11 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium" />
                </div>
              </div>
              {formError && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-center gap-2 text-xs text-red-600 font-medium">
                  <i className="ph-duotone ph-warning-circle text-base"></i> {formError}
                </div>
              )}
              <button
                onClick={() => handleSubmit()}
                disabled={isSubmitting}
                className="w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <i className={`ph-bold ${isSubmitting ? "ph-spinner-gap animate-spin" : "ph-plus-circle"}`}></i>
                {isSubmitting ? "Menyimpan..." : `Simpan ${activeTab === "expense" ? "Pengeluaran" : "Pemasukan"}`}
              </button>
            </div>
          </div>

          {/* Breakdown */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h2 className="font-display font-bold text-slate-900 flex items-center gap-2">
                <i className="ph-duotone ph-chart-pie-slice text-slate-400 text-lg"></i>
                Breakdown Kategori
              </h2>
              <p className="text-xs text-slate-500 mt-1">Distribusi berdasarkan kategori</p>
            </div>
            <div className="p-5 space-y-4">
              {breakdownData.length === 0 ? (
                <div className="text-center py-6">
                  <i className="ph-duotone ph-chart-pie-slice text-4xl text-slate-200 mb-2"></i>
                  <p className="text-sm text-slate-500">Belum ada data</p>
                </div>
              ) : breakdownData.map(({ cat, total }) => {
                const pct = Math.round((total / maxBreakdown) * 100);
                const pctOfTotal = totalBreakdown > 0 ? Math.round((total / totalBreakdown) * 100) : 0;
                const hexColor = CAT_HEX[cat] ?? "#94a3b8";
                const dotColorClass = CAT_COLOR[cat] ?? "text-slate-500";

                return (
                  <div key={cat}>
                    <div className="flex justify-between items-center mb-1.5">
                      <div className="flex items-center gap-2">
                        <i className={`ph-fill ph-circle text-[8px] ${dotColorClass}`}></i>
                        <span className="text-sm font-medium text-slate-700">{cat}</span>
                      </div>
                      <div className="text-sm font-bold text-slate-900">
                        {fmtShort(total)} <span className="text-xs font-normal text-slate-400">({pctOfTotal}%)</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: hexColor }} />
                    </div>
                  </div>
                );
              })}
              {breakdownData.length > 0 && (
                <div className="pt-4 mt-2 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total</span>
                  <span className="text-base font-bold text-slate-900">{fmtShort(totalBreakdown)}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Col: Table */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden flex flex-col h-full">
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="font-display font-bold text-slate-900">Riwayat {activeTab === "expense" ? "Pengeluaran" : "Pemasukan"}</h2>
                <p className="text-xs text-slate-500 mt-1">{filtered.length} transaksi ditemukan</p>
              </div>
              <div className="flex gap-2">
                <select value={filterMonth} onChange={e => setFilterMonth(e.target.value)} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer">
                  <option value="all">Semua Bulan</option>
                  {availableMonths.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-500/20 cursor-pointer">
                  <option value="all">Semua Kategori</option>
                  {currentCategories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>

            <div className="overflow-x-auto flex-1">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-100">
                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Tanggal</th>
                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Deskripsi</th>
                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">Kategori</th>
                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Jumlah</th>
                    <th className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-12 text-center">
                        <i className={`ph-duotone ${activeTab === "expense" ? "ph-receipt" : "ph-wallet"} text-4xl text-slate-200 mb-3`}></i>
                        <p className="text-sm font-medium text-slate-600">Belum ada {activeTab === "expense" ? "pengeluaran" : "pemasukan"}</p>
                        <p className="text-xs text-slate-400 mt-1">Gunakan form di sebelah kiri untuk mencatat.</p>
                      </td>
                    </tr>
                  ) : filtered.map(e => {
                    const colorClass = CAT_COLOR[e.category] ?? "text-slate-500";
                    const bgClass = CAT_BG[e.category] ?? "bg-slate-50";
                    const icon = CAT_ICON[e.category] ?? "ph-tag";

                    return (
                      <tr key={e.id} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-5 py-4 text-sm text-slate-500 whitespace-nowrap">{fmtDate(e.date)}</td>
                        <td className="px-5 py-4 text-sm font-medium text-slate-900 max-w-[200px] truncate" title={e.description}>
                          {e.description}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold ${bgClass} ${colorClass}`}>
                            <i className={`ph-duotone ${icon}`}></i> {e.category}
                          </span>
                        </td>
                        <td className={`px-5 py-4 text-sm font-bold ${activeTab === 'expense' ? 'text-red-600' : 'text-emerald-600'} text-right whitespace-nowrap`}>
                          {activeTab === 'expense' ? '-' : '+'}{fmtFull(e.amount)}
                        </td>
                        <td className="px-5 py-4 text-right">
                          {deleteId === e.id ? (
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => del(e.id)} className="px-2.5 py-1 text-xs font-bold bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors">Hapus</button>
                              <button onClick={() => setDeleteId(null)} className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-600 rounded hover:bg-slate-200 transition-colors">Batal</button>
                            </div>
                          ) : (
                            <button onClick={() => setDeleteId(e.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100">
                              <i className="ph-bold ph-trash text-sm"></i>
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                {filtered.length > 0 && (
                  <tfoot>
                    <tr className="bg-slate-50 border-t border-slate-100">
                      <td colSpan={3} className="px-5 py-3 text-xs font-bold text-slate-500 uppercase tracking-wider">
                        Total <span className="font-normal lowercase ml-1">({filtered.length} transaksi)</span>
                      </td>
                      <td className={`px-5 py-3 text-sm font-bold ${activeTab === 'expense' ? 'text-red-600' : 'text-emerald-600'} text-right`}>
                        {activeTab === 'expense' ? '-' : '+'}{fmtFull(totalView)}
                      </td>
                      <td></td>
                    </tr>
                  </tfoot>
                )}
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
