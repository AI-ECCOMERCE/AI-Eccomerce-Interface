"use client";

import { useEffect, useMemo, useState } from "react";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

interface Product {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  status: string;
  stock: number;
}

interface AssignedOrder {
  id: string;
  order_id: string;
}

interface ProductAccount {
  id: string;
  product_id: string;
  account_name: string;
  login_email: string;
  login_password: string;
  account_notes: string;
  status: "available" | "reserved" | "delivered" | "disabled";
  created_at: string;
  updated_at: string;
  products?: Product | null;
  assigned_order?: AssignedOrder | null;
}

interface AccountForm {
  product_id: string;
  account_name: string;
  login_email: string;
  login_password: string;
  account_notes: string;
  status: "available" | "disabled";
}

const defaultForm: AccountForm = {
  product_id: "",
  account_name: "",
  login_email: "",
  login_password: "",
  account_notes: "",
  status: "available",
};

export default function AccountsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [accounts, setAccounts] = useState<ProductAccount[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [productFilter, setProductFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [inventoryError, setInventoryError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState<AccountForm>(defaultForm);
  const [editingAccount, setEditingAccount] = useState<ProductAccount | null>(null);

  const fetchInventory = async () => {
    try {
      setInventoryError("");

      const [productsRes, accountsRes] = await Promise.all([
        fetch(`${API_URL}/api/products`),
        fetch(`${API_URL}/api/product-accounts`),
      ]);

      const [productsJson, accountsJson] = await Promise.all([
        productsRes.json(),
        accountsRes.json(),
      ]);

      if (productsJson.success) {
        setProducts(productsJson.data);
      }

      if (accountsJson.success) {
        setAccounts(accountsJson.data);
      } else {
        setAccounts([]);
        setInventoryError(
          accountsJson.error || "Gagal memuat inventori akun dari server."
        );
      }
    } catch (error) {
      console.error("Failed to fetch account inventory:", error);
      setInventoryError("Tidak dapat terhubung ke API inventori akun.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  useEffect(() => {
    if (!form.product_id && products.length > 0) {
      setForm((current) => ({
        ...current,
        product_id: products[0].id,
      }));
    }
  }, [products, form.product_id]);

  const filteredAccounts = useMemo(() => {
    return accounts.filter((account) => {
      const keyword = searchQuery.trim().toLowerCase();
      const matchesSearch =
        !keyword ||
        account.login_email.toLowerCase().includes(keyword) ||
        (account.account_name || "").toLowerCase().includes(keyword) ||
        (account.account_notes || "").toLowerCase().includes(keyword) ||
        (account.products?.name || "").toLowerCase().includes(keyword);
      const matchesProduct =
        productFilter === "all" || account.product_id === productFilter;
      const matchesStatus =
        statusFilter === "all" || account.status === statusFilter;

      return matchesSearch && matchesProduct && matchesStatus;
    });
  }, [accounts, productFilter, searchQuery, statusFilter]);

  const availableCount = accounts.filter((account) => account.status === "available").length;
  const reservedCount = accounts.filter((account) => account.status === "reserved").length;
  const deliveredCount = accounts.filter((account) => account.status === "delivered").length;

  const resetForm = () => {
    setForm({
      ...defaultForm,
      product_id: products[0]?.id || "",
    });
  };

  const handleOpenAddModal = () => {
    resetForm();
    setShowAddModal(true);
  };

  const handleAddAccount = async () => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_URL}/api/product-accounts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const json = await response.json();

      if (!json.success) {
        alert(json.error || "Gagal menambahkan akun.");
        return;
      }

      setShowAddModal(false);
      resetForm();
      fetchInventory();
    } catch (error) {
      console.error("Failed to add account:", error);
      alert("Terjadi kesalahan jaringan saat menambah akun.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditClick = (account: ProductAccount) => {
    setEditingAccount(account);
    setForm({
      product_id: account.product_id,
      account_name: account.account_name || "",
      login_email: account.login_email,
      login_password: account.login_password,
      account_notes: account.account_notes || "",
      status: account.status === "disabled" ? "disabled" : "available",
    });
    setShowEditModal(true);
  };

  const handleUpdateAccount = async () => {
    if (!editingAccount) {
      return;
    }

    setIsUpdating(true);

    try {
      const response = await fetch(
        `${API_URL}/api/product-accounts/${editingAccount.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const json = await response.json();

      if (!json.success) {
        alert(json.error || "Gagal memperbarui akun.");
        return;
      }

      setShowEditModal(false);
      setEditingAccount(null);
      resetForm();
      fetchInventory();
    } catch (error) {
      console.error("Failed to update account:", error);
      alert("Terjadi kesalahan jaringan saat memperbarui akun.");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteAccount = async (account: ProductAccount) => {
    if (
      !confirm(
        `Yakin mau menghapus akun ${account.login_email}? Tindakan ini tidak bisa dibatalkan.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/product-accounts/${account.id}`,
        {
          method: "DELETE",
        }
      );

      const json = await response.json();

      if (!json.success) {
        alert(json.error || "Gagal menghapus akun.");
        return;
      }

      fetchInventory();
    } catch (error) {
      console.error("Failed to delete account:", error);
      alert("Terjadi kesalahan jaringan saat menghapus akun.");
    }
  };

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(value));

  const getStatusConfig = (status: ProductAccount["status"]) => {
    switch (status) {
      case "available":
        return { label: "Siap Pakai", className: "badge-success", dotColor: "bg-green-500" };
      case "reserved":
        return { label: "Dipesan", className: "badge-warning", dotColor: "bg-amber-500" };
      case "delivered":
        return { label: "Terkirim", className: "badge-info", dotColor: "bg-blue-500" };
      case "disabled":
        return { label: "Nonaktif", className: "badge-danger", dotColor: "bg-red-500" };
      default:
        return { label: status, className: "badge-info", dotColor: "bg-slate-500" };
    }
  };

  const canMutateAccount = (status: ProductAccount["status"]) =>
    status === "available" || status === "disabled";

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400">Memuat inventori akun...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl lg:text-3xl font-extrabold text-slate-900">
            Inventori Akun
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola stok akun digital yang akan dikirim otomatis setelah pembayaran berhasil.
          </p>
        </div>
        <button
          onClick={handleOpenAddModal}
          disabled={products.length === 0}
          className="btn-primary px-5 py-2.5 text-sm font-semibold text-white rounded-xl flex items-center gap-2 disabled:opacity-60"
        >
          <i className="ph-duotone ph-plus text-lg"></i>
          Tambah Akun
        </button>
      </div>

      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
            <i className="ph-duotone ph-key text-xl text-brand-600"></i>
          </div>
          <div>
            <p className="text-xs text-slate-400">Total Akun</p>
            <p className="text-lg font-display font-extrabold text-slate-900">{accounts.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
            <i className="ph-duotone ph-check-circle text-xl text-green-600"></i>
          </div>
          <div>
            <p className="text-xs text-slate-400">Siap Dikirim</p>
            <p className="text-lg font-display font-extrabold text-slate-900">{availableCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center">
            <i className="ph-duotone ph-hourglass-medium text-xl text-amber-600"></i>
          </div>
          <div>
            <p className="text-xs text-slate-400">Sedang Terkunci</p>
            <p className="text-lg font-display font-extrabold text-slate-900">{reservedCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-slate-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
            <i className="ph-duotone ph-paper-plane-tilt text-xl text-blue-600"></i>
          </div>
          <div>
            <p className="text-xs text-slate-400">Sudah Terkirim</p>
            <p className="text-lg font-display font-extrabold text-slate-900">{deliveredCount}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        <div className="flex flex-col xl:flex-row xl:items-center gap-3 p-5 border-b border-slate-100">
          <div className="relative flex-1">
            <i className="ph-duotone ph-magnifying-glass text-lg text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2"></i>
            <input
              type="text"
              placeholder="Cari email login, nama akun, catatan, atau produk..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 transition-all"
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xl:w-auto">
            <select
              value={productFilter}
              onChange={(event) => setProductFilter(event.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 bg-white"
            >
              <option value="all">Semua Produk</option>
              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 bg-white"
            >
              <option value="all">Semua Status</option>
              <option value="available">Siap Pakai</option>
              <option value="reserved">Dipesan</option>
              <option value="delivered">Terkirim</option>
              <option value="disabled">Nonaktif</option>
            </select>
          </div>
        </div>

        {products.length === 0 && (
          <div className="px-5 py-4 border-b border-amber-100 bg-amber-50 text-sm text-amber-700">
            Tambahkan minimal satu produk aktif terlebih dahulu sebelum mengisi inventori akun.
          </div>
        )}

        {inventoryError && (
          <div className="px-5 py-4 border-b border-red-100 bg-red-50 text-sm text-red-700">
            {inventoryError}
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-50 bg-slate-50/50">
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                  Produk
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                  Kredensial
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                  Status
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                  Terkait Pesanan
                </th>
                <th className="text-left text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                  Update
                </th>
                <th className="text-right text-xs font-semibold text-slate-400 uppercase tracking-wider px-5 py-3">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-12 text-center text-sm text-slate-400">
                    Belum ada akun yang cocok dengan filter ini.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((account) => {
                  const status = getStatusConfig(account.status);

                  return (
                    <tr key={account.id} className="table-row border-b border-slate-50 last:border-0">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-10 h-10 rounded-xl bg-gradient-to-br ${
                              account.products?.gradient || "from-slate-400 to-slate-500"
                            } flex items-center justify-center flex-shrink-0`}
                          >
                            <i
                              className={`ph-duotone ${
                                account.products?.icon || "ph-key"
                              } text-lg text-white`}
                            ></i>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">
                              {account.products?.name || "Produk tidak ditemukan"}
                            </p>
                            <p className="text-xs text-slate-400">
                              {account.account_name || "Tanpa label akun"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <div className="space-y-1">
                          <p className="text-sm font-semibold text-slate-900">{account.login_email}</p>
                          <p className="text-xs font-mono text-slate-500 bg-slate-100 rounded-lg px-2 py-1 inline-flex">
                            {account.login_password}
                          </p>
                          {account.account_notes && (
                            <p className="text-xs text-slate-400 max-w-[280px] line-clamp-2">
                              {account.account_notes}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${status.className}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${status.dotColor}`}></span>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        {account.assigned_order?.order_id ? (
                          <div>
                            <p className="text-sm font-mono font-bold text-brand-600">
                              {account.assigned_order.order_id}
                            </p>
                            <p className="text-xs text-slate-400">Terhubung ke pesanan</p>
                          </div>
                        ) : (
                          <p className="text-sm text-slate-400">Belum dipakai</p>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div>
                          <p className="text-sm text-slate-700">{formatDate(account.updated_at)}</p>
                          <p className="text-xs text-slate-400">Terakhir diperbarui</p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => handleEditClick(account)}
                            disabled={!canMutateAccount(account.status)}
                            className="p-2 text-slate-400 hover:text-brand-600 hover:bg-brand-50 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            title={
                              canMutateAccount(account.status)
                                ? "Edit akun"
                                : "Akun yang sedang dipakai tidak bisa diedit"
                            }
                          >
                            <i className="ph-duotone ph-pencil-simple text-base"></i>
                          </button>
                          <button
                            onClick={() => handleDeleteAccount(account)}
                            disabled={!canMutateAccount(account.status)}
                            className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                            title={
                              canMutateAccount(account.status)
                                ? "Hapus akun"
                                : "Akun yang sedang dipakai tidak bisa dihapus"
                            }
                          >
                            <i className="ph-duotone ph-trash text-base"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-5 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <p className="text-sm text-slate-500">
            Menampilkan <span className="font-semibold text-slate-900">{filteredAccounts.length}</span> dari{" "}
            {accounts.length} akun.
          </p>
          <p className="text-xs text-slate-400">
            Akun berstatus dipesan atau terkirim dikunci agar tidak berubah setelah order masuk.
          </p>
        </div>
      </div>

      {(showAddModal || showEditModal) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => {
              setShowAddModal(false);
              setShowEditModal(false);
              setEditingAccount(null);
            }}
          ></div>
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h3 className="font-display font-bold text-lg text-slate-900">
                {showEditModal ? "Edit Inventori Akun" : "Tambah Inventori Akun"}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setEditingAccount(null);
                }}
                className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-50 transition-all"
              >
                <i className="ph-duotone ph-x text-xl"></i>
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Produk</label>
                  <select
                    value={form.product_id}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, product_id: event.target.value }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 bg-white"
                  >
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Status
                  </label>
                  <select
                    value={form.status}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        status: event.target.value as AccountForm["status"],
                      }))
                    }
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 bg-white"
                  >
                    <option value="available">Siap Pakai</option>
                    <option value="disabled">Nonaktif</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                  Label Akun
                </label>
                <input
                  type="text"
                  value={form.account_name}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, account_name: event.target.value }))
                  }
                  placeholder="Contoh: Seat 01 atau Batch April"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Email Login
                  </label>
                  <input
                    type="email"
                    value={form.login_email}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, login_email: event.target.value }))
                    }
                    placeholder="akun@provider.com"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                    Password Login
                  </label>
                  <input
                    type="text"
                    value={form.login_password}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, login_password: event.target.value }))
                    }
                    placeholder="Masukkan password akun"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Catatan</label>
                <textarea
                  rows={4}
                  value={form.account_notes}
                  onChange={(event) =>
                    setForm((current) => ({ ...current, account_notes: event.target.value }))
                  }
                  placeholder="Contoh: wajib ganti password setelah login pertama, seat berlaku 30 hari, dll."
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400 resize-none"
                ></textarea>
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-100">
              <button
                disabled={isSubmitting || isUpdating}
                onClick={() => {
                  setShowAddModal(false);
                  setShowEditModal(false);
                  setEditingAccount(null);
                }}
                className="px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                Batal
              </button>
              <button
                disabled={isSubmitting || isUpdating}
                onClick={showEditModal ? handleUpdateAccount : handleAddAccount}
                className="btn-primary px-5 py-2.5 text-sm font-semibold text-white rounded-xl flex items-center gap-2 disabled:opacity-70"
              >
                {isSubmitting || isUpdating ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    {showEditModal ? "Menyimpan..." : "Menambahkan..."}
                  </>
                ) : (
                  <>
                    <i className="ph-duotone ph-check text-base"></i>
                    {showEditModal ? "Simpan Perubahan" : "Simpan Akun"}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
