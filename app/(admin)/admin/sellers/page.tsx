"use client";

import { useEffect, useMemo, useState } from "react";
import { adminFetch } from "@/lib/api/adminFetch";

// ✨ Types ✨

type Seller = {
  id: string;
  name: string;
  wa?: string;
  telegram?: string;
  website?: string;
  products: string[];
  notes?: string;
  createdAt: string;
};

const PRODUCT_TAGS = [
  "ChatGPT Plus", "Gemini Advanced", "Netflix", "Spotify", "YouTube Premium",
  "Canva Pro", "Adobe CC", "Microsoft 365", "LinkedIn Premium", "Notion Pro",
  "Figma Pro", "Grammarly", "Semrush", "Lainnya",
];

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

const AVATAR_COLORS = [
  "from-violet-500 to-purple-600",
  "from-blue-500 to-cyan-600",
  "from-emerald-500 to-teal-600",
  "from-orange-500 to-amber-600",
  "from-rose-500 to-pink-600",
  "from-indigo-500 to-blue-600",
];

function avatarColor(name: string) {
  return AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];
}

function waLink(wa: string) {
  const digits = wa.replace(/[^0-9]/g, "");
  const num = digits.startsWith("0") ? "62" + digits.slice(1) : digits;
  return `https://wa.me/${num}`;
}

const EMPTY_FORM = { name: "", wa: "", telegram: "", website: "", products: [] as string[], notes: "" };

// ✨ Component ✨

export default function SellersPage() {
  const [sellers, setSellers] = useState<Seller[]>([]);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadData = async () => {
    try {
      const res = await adminFetch<{ success: boolean; data: any[] }>("/api/sellers");
      if (res.success && Array.isArray(res.data)) {
        const parsed = res.data.map(s => ({
          ...s,
          createdAt: s.created_at || s.createdAt
        }));
        setSellers(parsed);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => { loadData(); }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return sellers;
    return sellers.filter((s) =>
      s.name.toLowerCase().includes(q) ||
      s.products.some((p) => p.toLowerCase().includes(q)) ||
      s.notes?.toLowerCase().includes(q)
    );
  }, [sellers, search]);

  function openAdd() {
    setEditId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setShowModal(true);
  }

  function openEdit(s: Seller) {
    setEditId(s.id);
    setForm({
      name: s.name,
      wa: s.wa ?? "",
      telegram: s.telegram ?? "",
      website: s.website ?? "",
      products: s.products,
      notes: s.notes ?? ""
    });
    setFormError("");
    setShowModal(true);
  }

  async function submit(ev: React.FormEvent) {
    ev.preventDefault();
    if (isSubmitting) return;

    setFormError("");
    if (!form.name.trim()) { setFormError("Nama seller tidak boleh kosong."); return; }
    if (!form.wa && !form.telegram && !form.website) { setFormError("Isi minimal satu kontak (WA / Telegram / Website)."); return; }
    if (form.products.length === 0) { setFormError("Pilih minimal 1 produk yang disediakan."); return; }

    setIsSubmitting(true);
    try {
      const endpoint = editId ? `/api/sellers/${editId}` : "/api/sellers";
      const method = editId ? "PUT" : "POST";
      const payload = {
        name: form.name.trim(),
        wa: form.wa.trim() || undefined,
        telegram: form.telegram.trim() || undefined,
        website: form.website.trim() || undefined,
        products: form.products,
        notes: form.notes.trim() || undefined
      };

      const res = await adminFetch<{ success: boolean; error?: string }>(endpoint, {
        method,
        body: JSON.stringify(payload)
      });

      if (!res.success) {
        setFormError(res.error || "Gagal menyimpan seller");
        return;
      }

      await loadData();
      setShowModal(false);
    } catch (err: any) {
      setFormError(err.message || "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function del(id: string) {
    try {
      await adminFetch(`/api/sellers/${id}`, { method: "DELETE" });
      await loadData();
      setDeleteId(null);
    } catch (err) {
      console.error(err);
    }
  }

  function toggleProduct(p: string) {
    setForm((f) => ({
      ...f,
      products: f.products.includes(p) ? f.products.filter((x) => x !== p) : [...f.products, p],
    }));
  }

  return (
    <div className="p-6 lg:p-8 min-h-screen">

      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900">Kontak Seller</h1>
          <p className="text-sm text-slate-500 mt-1">Direktori supplier & penyedia produk lengkap dengan kontak.</p>
        </div>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {[
          { label: "Total Seller", value: sellers.length, icon: "ph-address-book", iconBg: "bg-brand-50", iconColor: "text-brand-600" },
          { label: "Kontak WA", value: sellers.filter((s) => s.wa).length, icon: "ph-whatsapp-logo", iconBg: "bg-green-50", iconColor: "text-green-600" },
          { label: "Telegram", value: sellers.filter((s) => s.telegram).length, icon: "ph-telegram-logo", iconBg: "bg-sky-50", iconColor: "text-sky-600" },
          { label: "Jenis Produk", value: new Set(sellers.flatMap((s) => s.products)).size, icon: "ph-package", iconBg: "bg-amber-50", iconColor: "text-amber-600" },
        ].map((stat) => (
          <div key={stat.label} className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg ${stat.iconBg} flex items-center justify-center flex-shrink-0`}>
              <i className={`ph-duotone ${stat.icon} text-xl ${stat.iconColor}`}></i>
            </div>
            <div>
              <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">{stat.label}</p>
              <p className="text-lg font-display font-extrabold text-slate-900 mt-0.5">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main Content (Table) ── */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
        {/* Table Toolbar */}
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white">
          <div className="relative max-w-md w-full">
            <i className="ph-duotone ph-magnifying-glass text-lg text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            <input
              suppressHydrationWarning
              type="text"
              placeholder="Cari seller, nama, atau produk..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all bg-slate-50 focus:bg-white"
            />
          </div>
          <button suppressHydrationWarning onClick={openAdd} className="bg-brand-600 hover:bg-brand-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-sm transition-all flex items-center justify-center gap-2 flex-shrink-0">
            <i className="ph-bold ph-plus"></i> Tambah Seller
          </button>
        </div>

        {/* Table Body */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Seller</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Kontak</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Produk</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider max-w-[200px]">Catatan</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {sellers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-slate-50 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                      <i className="ph-duotone ph-address-book text-3xl text-slate-400"></i>
                    </div>
                    <h3 className="font-display font-bold text-lg text-slate-900 mb-1">Belum ada seller</h3>
                    <p className="text-sm text-slate-400">Klik tombol "Tambah Seller" untuk mulai menambahkan kontak supplier.</p>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <i className="ph-duotone ph-magnifying-glass text-4xl text-slate-200 block mb-3"></i>
                    <p className="text-sm text-slate-500">Tidak ada seller yang cocok dengan &ldquo;{search}&rdquo;</p>
                  </td>
                </tr>
              ) : (
                filtered.map((seller) => (
                  <tr key={seller.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 align-top">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${avatarColor(seller.name)} flex items-center justify-center text-white font-bold text-sm flex-shrink-0 shadow-sm`}>
                          {initials(seller.name)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-900">{seller.name}</p>
                          <p className="text-xs text-slate-400 mt-0.5">Bergabung {new Date(seller.createdAt).toLocaleDateString("id-ID", { month: "short", year: "numeric" })}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-col gap-2.5">
                        {seller.wa && (
                          <a href={waLink(seller.wa)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-xs font-semibold text-slate-600 hover:text-green-600 transition-colors w-fit max-w-full">
                            <div className="w-7 h-7 rounded-lg bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0 border border-green-100/50">
                              <i className="ph-duotone ph-whatsapp-logo text-[15px]"></i>
                            </div>
                            <span className="truncate">{seller.wa}</span>
                          </a>
                        )}
                        {seller.telegram && (
                          <a href={`https://t.me/${seller.telegram.replace(/^@/, "")}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-xs font-semibold text-slate-600 hover:text-sky-600 transition-colors w-fit max-w-full">
                            <div className="w-7 h-7 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0 border border-sky-100/50">
                              <i className="ph-duotone ph-telegram-logo text-[15px]"></i>
                            </div>
                            <span className="truncate">{seller.telegram}</span>
                          </a>
                        )}
                        {seller.website && (
                          <a href={seller.website.startsWith("http") ? seller.website : `https://${seller.website}`} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2.5 text-xs font-semibold text-slate-600 hover:text-brand-600 transition-colors w-fit max-w-full" title={seller.website}>
                            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center flex-shrink-0 border border-slate-200/50">
                              <i className="ph-duotone ph-globe text-[15px]"></i>
                            </div>
                            <span className="truncate max-w-[130px]">{seller.website.replace(/^https?:\/\//, '')}</span>
                          </a>
                        )}
                        {!seller.wa && !seller.telegram && !seller.website && (
                          <span className="text-xs text-slate-400 italic">Belum ada kontak</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <div className="flex flex-wrap gap-1.5 max-w-[250px]">
                        {seller.products.slice(0, 3).map(p => (
                          <span key={p} className="px-2.5 py-1 bg-brand-50 text-brand-700 text-[11px] font-semibold rounded-lg border border-brand-100/50">
                            {p}
                          </span>
                        ))}
                        {seller.products.length > 3 && (
                          <span className="px-2 py-1 bg-slate-100 text-slate-500 text-[11px] font-semibold rounded-lg border border-slate-200/50">
                            +{seller.products.length - 3} lainnya
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 align-top">
                      {seller.notes ? (
                        <div className="text-xs text-slate-500 line-clamp-3 max-w-[200px]" title={seller.notes}>
                          {seller.notes}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-300 italic">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top text-right">
                      {deleteId === seller.id ? (
                        <div className="flex items-center justify-end gap-2">
                          <button onClick={() => del(seller.id)} className="px-3 py-1.5 text-xs font-bold bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors">Hapus</button>
                          <button onClick={() => setDeleteId(null)} className="px-3 py-1.5 text-xs font-bold bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-200 transition-colors">Batal</button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-end gap-1.5 transition-opacity">
                          <button onClick={() => openEdit(seller)} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-xl transition-all" title="Edit Seller">
                            <i className="ph-duotone ph-pencil-simple text-lg"></i>
                          </button>
                          <button onClick={() => setDeleteId(seller.id)} className="w-9 h-9 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" title="Hapus Seller">
                            <i className="ph-duotone ph-trash text-lg"></i>
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Modal ── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>

          <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">

            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 flex-shrink-0 bg-white">
              <div>
                <h2 className="font-display font-bold text-xl text-slate-900">
                  {editId ? "Edit Seller" : "Tambah Seller Baru"}
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  {editId ? "Perbarui informasi supplier dengan detail yang lebih rapi." : "Lengkapi informasi supplier baru dengan detail yang jelas."}
                </p>
              </div>
              <button onClick={() => setShowModal(false)} className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-all">
                <i className="ph-bold ph-x text-lg"></i>
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto">
              <form id="seller-form" onSubmit={submit} className="space-y-8">

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Left Column: Name & Contacts */}
                  <div className="space-y-6">
                    {/* Name */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Nama Seller <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="cth: Toko AI Premium"
                        value={form.name}
                        onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all bg-slate-50 focus:bg-white"
                      />
                    </div>

                    {/* Contacts */}
                    <div className="space-y-4">
                      <div className="space-y-1.5">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                          Kontak <span className="text-red-500">*</span>
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed">
                          Isi minimal satu kontak yang valid agar mudah dihubungi.
                        </p>
                      </div>

                      {/* WhatsApp */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wide">
                          <i className="ph-duotone ph-whatsapp-logo text-green-500 text-base"></i> WhatsApp
                        </label>
                        <input type="text" placeholder="Contoh: 081234567890" value={form.wa}
                          onChange={(e) => setForm((f) => ({ ...f, wa: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all bg-slate-50 focus:bg-white" />
                      </div>

                      {/* Telegram */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wide">
                          <i className="ph-duotone ph-telegram-logo text-sky-500 text-base"></i> Telegram
                        </label>
                        <div className="flex bg-slate-50 border border-slate-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-sky-400/30 focus-within:border-sky-400 transition-all focus-within:bg-white">
                          <input type="text" placeholder="username" value={form.telegram.replace(/^@|https?:\/\/(www\.)?t\.me\//i, "")}
                            onChange={(e) => setForm((f) => ({ ...f, telegram: e.target.value.replace(/^@|https?:\/\/(www\.)?t\.me\//i, "") }))}
                            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-400/30 focus:border-green-400 transition-all bg-slate-50 focus:bg-white" />
                        </div>
                      </div>

                      {/* Website */}
                      <div className="space-y-2">
                        <label className="flex items-center gap-1.5 text-xs font-bold text-slate-600 uppercase tracking-wide">
                          <i className="ph-duotone ph-globe text-slate-500 text-base"></i> Website
                        </label>
                        <input type="text" placeholder="Contoh: supplier.com" value={form.website}
                          onChange={(e) => setForm((f) => ({ ...f, website: e.target.value }))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all bg-slate-50 focus:bg-white" />
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Products & Notes */}
                  <div className="space-y-6">
                    {/* Products */}
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <p className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                          Produk Disediakan <span className="text-red-500">*</span>
                        </p>
                        {form.products.length > 0 && (
                          <span className="text-brand-600 font-bold normal-case bg-brand-50 px-2 py-0.5 rounded-md text-xs">{form.products.length} dipilih</span>
                        )}
                      </div>
                      <div className="bg-slate-50/50 border border-slate-200 rounded-xl p-4">
                        <div className="flex flex-wrap gap-2">
                          {PRODUCT_TAGS.map((p) => (
                            <button key={p} type="button" onClick={() => toggleProduct(p)}
                              className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${form.products.includes(p)
                                ? "bg-brand-600 border-brand-600 text-white shadow-md shadow-brand-500/20"
                                : "bg-white border-slate-200 text-slate-600 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 shadow-sm"
                                }`}>
                              {p}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide">
                        Catatan Internal <span className="text-slate-400 font-normal normal-case">(opsional)</span>
                      </label>
                      <textarea rows={3} placeholder="Contoh: Harga grosir minimal 10 akun, pembayaran via transfer BCA."
                        value={form.notes}
                        onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all resize-none bg-slate-50 focus:bg-white"
                      />
                    </div>
                  </div>
                </div>

                {formError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 font-medium flex items-center gap-2 mt-4">
                    <i className="ph-duotone ph-warning-circle text-lg flex-shrink-0"></i>
                    {formError}
                  </div>
                )}
              </form>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex-shrink-0 flex justify-end gap-3">
              <button type="button" onClick={() => setShowModal(false)}
                className="px-6 py-2.5 border border-slate-200 bg-white text-slate-600 text-sm font-bold rounded-xl hover:bg-slate-50 transition-all">
                Batal
              </button>
              <button type="submit" form="seller-form" disabled={isSubmitting}
                className="px-8 py-2.5 bg-brand-600 hover:bg-brand-700 text-white text-sm font-bold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px]">
                {isSubmitting ? (
                  <><i className="ph-bold ph-spinner-gap animate-spin"></i> Menyimpan...</>
                ) : (
                  editId ? "Simpan Perubahan" : "Tambah Seller"
                )}
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
