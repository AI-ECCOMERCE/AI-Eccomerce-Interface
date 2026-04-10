"use client";

export default function SettingsPage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900">Pengaturan</h1>
        <p className="text-sm text-slate-500 mt-1">Konfigurasi toko dan integrasi pembayaran.</p>
      </div>

      <div className="max-w-3xl space-y-6">
        {/* Store Info */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <i className="ph-duotone ph-storefront text-xl text-brand-600"></i>
              Informasi Toko
            </h3>
          </div>
          <div className="p-5 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nama Toko</label>
              <input type="text" defaultValue="DesignAI Store" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Deskripsi</label>
              <textarea defaultValue="Marketplace terpercaya untuk akun premium AI dan tools produktivitas." rows={2} className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 resize-none"></textarea>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">WhatsApp Admin</label>
                <input type="text" defaultValue="081234567890" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Email Support</label>
                <input type="email" defaultValue="support@designai.store" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Payment */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <i className="ph-duotone ph-credit-card text-xl text-brand-600"></i>
              Pembayaran (Pakasir QRIS)
            </h3>
          </div>
          <div className="p-5 space-y-4">
            <div className="bg-brand-50/50 border border-brand-100 rounded-xl p-4 flex items-start gap-3">
              <i className="ph-duotone ph-info text-lg text-brand-600 mt-0.5"></i>
              <div>
                <p className="text-sm font-semibold text-brand-800">Integrasi Pakasir</p>
                <p className="text-xs text-brand-600 mt-0.5">Masukkan API key dan Merchant ID dari dashboard Pakasir untuk mengaktifkan pembayaran QRIS.</p>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Merchant ID</label>
              <input type="text" placeholder="Masukkan Merchant ID Pakasir" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">API Key</label>
              <input type="password" placeholder="Masukkan API Key Pakasir" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Callback URL</label>
              <input type="text" defaultValue="https://yourdomain.com/api/payment/callback" className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm bg-slate-50" readOnly />
            </div>
          </div>
        </div>

        {/* Notification */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h3 className="font-display font-bold text-lg text-slate-900 flex items-center gap-2">
              <i className="ph-duotone ph-bell-ringing text-xl text-brand-600"></i>
              Notifikasi
            </h3>
          </div>
          <div className="p-5 space-y-4">
            {[
              { label: "Notifikasi pesanan baru via WhatsApp", description: "Terima pesan otomatis saat ada pesanan masuk", checked: true },
              { label: "Notifikasi pembayaran berhasil", description: "Terima konfirmasi saat pembayaran terverifikasi", checked: true },
              { label: "Laporan harian via email", description: "Ringkasan penjualan dikirim setiap pagi", checked: false },
            ].map((item, idx) => (
              <div key={idx} className="flex items-start justify-between p-4 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-semibold text-slate-900">{item.label}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{item.description}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                  <div className="w-10 h-5 bg-slate-200 rounded-full peer peer-checked:bg-brand-600 transition-all after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex justify-end">
          <button className="btn-primary px-8 py-3 text-sm font-semibold text-white rounded-xl flex items-center gap-2">
            <i className="ph-duotone ph-floppy-disk text-lg"></i>
            Simpan Pengaturan
          </button>
        </div>
      </div>
    </div>
  );
}
