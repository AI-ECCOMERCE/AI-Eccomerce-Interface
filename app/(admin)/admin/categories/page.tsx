"use client";

import { useState, useEffect } from "react";
import { adminFetch, showSuccessToast } from "@/lib/api/adminFetch";

interface Category {
  id: string;
  name: string;
  slug: string;
  icon: string;
  color: string;
  products?: { count: number }[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    try {
      const json = await adminFetch<{ success: boolean; data: Category[] }>("/api/categories");
      if (json.success) setCategories(json.data);
    } catch (err) {
      console.error("Failed to fetch categories:", err);
      setErrorMessage(err instanceof Error ? err.message : "Gagal memuat kategori admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Yakin mau hapus kategori ini?")) return;
    try {
      await adminFetch(`/api/categories/${id}`, { method: "DELETE" });
      showSuccessToast("Kategori dihapus", "Kategori berhasil dihapus.");
      fetchCategories();
    } catch (err) {
      console.error("Failed to delete:", err);
      setErrorMessage(err instanceof Error ? err.message : "Gagal menghapus kategori.");
    }
  };

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400">Memuat kategori...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900">Kategori</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola kategori produk di marketplace.</p>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {errorMessage}
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {categories.length === 0 ? (
          <p className="col-span-4 text-center text-sm text-slate-400 py-12">Belum ada kategori</p>
        ) : (
          categories.map((cat) => {
            const productCount = cat.products?.[0]?.count || 0;
            return (
              <div key={cat.id} className="bg-white rounded-2xl border border-slate-100 p-6 stat-card">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center mb-4`}>
                  <i className={`ph-duotone ${cat.icon} text-2xl text-white`}></i>
                </div>
                <h3 className="font-display font-bold text-lg text-slate-900">{cat.name}</h3>
                <p className="text-sm text-slate-400 mt-1">{productCount} produk</p>
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-400">/{cat.slug}</span>
                  <button onClick={() => handleDelete(cat.id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                    <i className="ph-duotone ph-trash text-sm"></i>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
