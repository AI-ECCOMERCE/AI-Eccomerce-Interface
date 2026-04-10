"use client";

import { useState, useEffect } from "react";
import { adminFetch, showSuccessToast } from "@/lib/api/adminFetch";

interface Product {
  id: string;
  name: string;
  category_slug: string;
  price: number;
  original_price: number;
  stock: number;
  sold: number;
  status: string;
  icon: string;
  gradient: string;
  categories?: { name: string };
}

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: "", category_slug: "ai-chat", price: 0, original_price: 0, stock: 0, description: "" });

  const fetchProducts = async () => {
    try {
      const json = await adminFetch<{ success: boolean; data: Product[] }>("/api/products");
      if (json.success) setProducts(json.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setErrorMessage(err instanceof Error ? err.message : "Gagal memuat produk admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleAddProduct = async () => {
    try {
      const json = await adminFetch<{ success: boolean; data: Product }>("/api/products", {
        method: "POST",
        body: JSON.stringify(newProduct),
      });
      if (json.success) {
        showSuccessToast("Produk ditambahkan", "Produk baru berhasil disimpan.");
        setShowAddModal(false);
        setNewProduct({ name: "", category_slug: "ai-chat", price: 0, original_price: 0, stock: 0, description: "" });
        fetchProducts();
      }
    } catch (err) {
      console.error("Failed to add product:", err);
      setErrorMessage(err instanceof Error ? err.message : "Gagal menambah produk.");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Yakin mau hapus produk ini?")) return;
    try {
      await adminFetch(`/api/products/${id}`, { method: "DELETE" });
      showSuccessToast("Produk dihapus", "Produk berhasil dihapus.");
      fetchProducts();
    } catch (err) {
      console.error("Failed to delete:", err);
      setErrorMessage(err instanceof Error ? err.message : "Gagal menghapus produk.");
    }
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const statusLabel = (status: string) => {
    switch (status) {
      case "active": return { text: "Aktif", class: "badge-success" };
      case "draft": return { text: "Draft", class: "badge-info" };
      case "out_of_stock": return { text: "Habis", class: "badge-danger" };
      default: return { text: status, class: "badge-info" };
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400">Memuat produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900">Manajemen Produk</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola semua produk AI premium yang dijual di marketplace.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn-primary px-5 py-2.5 text-sm font-semibold text-white rounded-xl flex items-center gap-2">
          <i className="ph-duotone ph-plus text-lg"></i>
          Tambah Produk
        </button>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      {/* Stats Row */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center"><i className="ph-duotone ph-package text-xl text-brand-600"></i></div>
          <div><p className="text-xs text-slate-400">Total Produk</p><p className="text-lg font-display font-extrabold text-slate-900">{products.length}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center"><i className="ph-duotone ph-check-circle text-xl text-green-600"></i></div>
          <div><p className="text-xs text-slate-400">Aktif</p><p className="text-lg font-display font-extrabold text-slate-900">{products.filter(p => p.status === "active").length}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-red-50 flex items-center justify-center"><i className="ph-duotone ph-x-circle text-xl text-red-500"></i></div>
          <div><p className="text-xs text-slate-400">Stok Habis</p><p className="text-lg font-display font-extrabold text-slate-900">{products.filter(p => p.stock === 0).length}</p></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center"><i className="ph-duotone ph-shopping-bag text-xl text-amber-600"></i></div>
          <div><p className="text-xs text-slate-400">Total Terjual</p><p className="text-lg font-display font-extrabold text-slate-900">{products.reduce((a, b) => a + b.sold, 0).toLocaleString("id-ID")}</p></div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 border-b border-slate-100">
          <div className="relative flex-1 max-w-md">
            <i className="ph-duotone ph-magnifying-glass text-lg text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            <input type="text" placeholder="Cari produk..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Produk</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Kategori</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Harga Jual</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Stok</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Terjual</th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Status</th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => {
                const st = statusLabel(product.status);
                return (
                  <tr key={product.id} className="table-row border-b border-slate-50 last:border-0">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${product.gradient} flex items-center justify-center flex-shrink-0`}><i className={`ph-duotone ${product.icon} text-lg text-white`}></i></div>
                        <p className="text-sm font-semibold text-slate-900">{product.name}</p>
                      </div>
                    </td>
                    <td className="px-5 py-4"><span className="badge-purple text-xs font-semibold px-2.5 py-1 rounded-lg">{product.categories?.name || product.category_slug}</span></td>
                    <td className="px-5 py-4">
                      <p className="text-sm font-bold text-slate-900">Rp {product.price.toLocaleString("id-ID")}</p>
                      <p className="text-xs text-red-400 line-through">Rp {product.original_price.toLocaleString("id-ID")}</p>
                    </td>
                    <td className="px-5 py-4"><span className={`text-sm font-bold ${product.stock > 10 ? "text-slate-900" : product.stock > 0 ? "text-amber-600" : "text-red-500"}`}>{product.stock}</span></td>
                    <td className="px-5 py-4 text-sm font-semibold text-slate-600">{product.sold}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${st.class}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${product.status === "active" ? "bg-green-500" : product.status === "out_of_stock" ? "bg-red-500" : "bg-blue-500"}`}></span>
                        {st.text}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => handleDeleteProduct(product.id)} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Hapus">
                        <i className="ph-duotone ph-trash text-base"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="p-5 border-t border-slate-100">
          <p className="text-sm text-slate-500">Menampilkan <span className="font-semibold text-slate-900">{filteredProducts.length}</span> dari {products.length} produk</p>
        </div>
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)}></div>
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-display font-bold text-lg text-slate-900">Tambah Produk Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all"><i className="ph-duotone ph-x text-xl"></i></button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Produk</label>
                <input type="text" placeholder="Contoh: ChatGPT Plus" value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Kategori</label>
                  <select value={newProduct.category_slug} onChange={(e) => setNewProduct({...newProduct, category_slug: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 bg-white">
                    <option value="ai-chat">AI Chatbot</option>
                    <option value="design">Desain & Kreatif</option>
                    <option value="productivity">Produktivitas</option>
                    <option value="coding">Coding & Dev</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Stok</label>
                  <input type="number" value={newProduct.stock} onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Harga Asli (Rp)</label>
                  <input type="number" value={newProduct.original_price} onChange={(e) => setNewProduct({...newProduct, original_price: Number(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Harga Jual (Rp)</label>
                  <input type="number" value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi</label>
                <textarea rows={3} placeholder="Deskripsi singkat produk..." value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 resize-none"></textarea>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
              <button onClick={() => setShowAddModal(false)} className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all">Batal</button>
              <button onClick={handleAddProduct} className="btn-primary px-5 py-2.5 text-sm font-semibold text-white rounded-xl flex items-center gap-2">
                <i className="ph-duotone ph-check text-base"></i>
                Simpan Produk
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
