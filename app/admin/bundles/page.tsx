"use client";

const bundles = [
  { id: 1, name: "Starter Pack", items: ["ChatGPT Plus", "Canva Pro"], price: 60000, originalPrice: 70000, sold: 89, status: "active" },
  { id: 2, name: "Pro Pack", items: ["ChatGPT Plus", "Gemini Advanced", "Canva Pro"], price: 95000, originalPrice: 110000, sold: 134, status: "active" },
  { id: 3, name: "Developer Pack", items: ["ChatGPT Plus", "GitHub Copilot", "Notion AI"], price: 85000, originalPrice: 100000, sold: 67, status: "active" },
  { id: 4, name: "Ultimate Pack", items: ["ChatGPT Plus", "Gemini Advanced", "Canva Pro", "Claude Pro"], price: 140000, originalPrice: 160000, sold: 45, status: "draft" },
];

export default function BundlesPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900">Bundle Paket</h1>
          <p className="text-sm text-slate-500 mt-1">Kelola paket bundle hemat untuk pelanggan.</p>
        </div>
        <button className="btn-primary px-5 py-2.5 text-sm font-semibold text-white rounded-xl flex items-center gap-2">
          <i className="ph-duotone ph-plus text-lg"></i>
          Buat Bundle
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-5">
        {bundles.map(bundle => {
          const discount = Math.round((1 - bundle.price / bundle.originalPrice) * 100);
          return (
            <div key={bundle.id} className="bg-white rounded-2xl border border-slate-100 overflow-hidden stat-card">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center">
                      <i className="ph-duotone ph-gift text-xl text-white"></i>
                    </div>
                    <div>
                      <h3 className="font-display font-bold text-lg text-slate-900">{bundle.name}</h3>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${bundle.status === "active" ? "badge-success" : "badge-info"}`}>
                        {bundle.status === "active" ? "Aktif" : "Draft"}
                      </span>
                    </div>
                  </div>
                  <span className="px-2 py-1 rounded-lg bg-red-50 text-red-500 text-xs font-bold">-{discount}%</span>
                </div>
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {bundle.items.map(item => (
                    <span key={item} className="badge-purple text-xs font-medium px-2.5 py-1 rounded-lg">{item}</span>
                  ))}
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs text-slate-400 line-through">Rp {bundle.originalPrice.toLocaleString("id-ID")}</p>
                    <p className="text-xl font-display font-extrabold text-slate-900">Rp {bundle.price.toLocaleString("id-ID")}</p>
                  </div>
                  <p className="text-xs text-slate-400">{bundle.sold} terjual</p>
                </div>
              </div>
              <div className="px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end gap-2">
                <button className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all flex items-center gap-1">
                  <i className="ph-duotone ph-pencil-simple text-sm"></i> Edit
                </button>
                <button className="px-3 py-1.5 text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all flex items-center gap-1">
                  <i className="ph-duotone ph-trash text-sm"></i> Hapus
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
