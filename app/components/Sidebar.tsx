"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const menuItems = [
  {
    section: "UTAMA",
    items: [
      { label: "Dashboard", href: "/admin", icon: "ph-squares-four" },
      { label: "Pesanan", href: "/admin/orders", icon: "ph-receipt", badge: "12" },
    ],
  },
  {
    section: "KATALOG",
    items: [
      { label: "Produk", href: "/admin/products", icon: "ph-package" },
      { label: "Inventori Akun", href: "/admin/accounts", icon: "ph-key" },
      { label: "Kategori", href: "/admin/categories", icon: "ph-tag" },
      { label: "Bundle", href: "/admin/bundles", icon: "ph-gift" },
    ],
  },
  {
    section: "LAPORAN",
    items: [
      { label: "Penjualan", href: "/admin/sales", icon: "ph-chart-line-up" },
      { label: "Pelanggan", href: "/admin/customers", icon: "ph-users-three" },
    ],
  },
  {
    section: "SISTEM",
    items: [
      { label: "Pengaturan", href: "/admin/settings", icon: "ph-gear-six" },
    ],
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 bottom-0 z-40 bg-sidebar-bg border-r border-sidebar-border flex flex-col transition-all duration-300 ${
          collapsed ? "w-[72px]" : "w-64"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 h-16 border-b border-sidebar-border flex-shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2.5">
              <Image
                src="/ailogo.png"
                alt="DesignAI"
                width={100}
                height={28}
                className="h-7 w-auto object-contain brightness-0 invert"
              />
              <span className="text-[10px] font-bold text-brand-400 bg-brand-400/10 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                Admin
              </span>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-sidebar-hover transition-all"
          >
            <i
              className={`ph-duotone ${
                collapsed ? "ph-arrow-line-right" : "ph-arrow-line-left"
              } text-lg`}
            ></i>
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {menuItems.map((section) => (
            <div key={section.section} className="mb-5">
              {!collapsed && (
                <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em]">
                  {section.section}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/admin" && pathname?.startsWith(item.href));
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`sidebar-link flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium group ${
                        isActive
                          ? "bg-brand-600/15 text-brand-400 border-r-0"
                          : "text-slate-400 hover:text-slate-200"
                      } ${collapsed ? "justify-center" : ""}`}
                      title={collapsed ? item.label : undefined}
                    >
                      <i
                        className={`ph-duotone ${item.icon} text-xl ${
                          isActive
                            ? "text-brand-400"
                            : "text-slate-500 group-hover:text-slate-300"
                        }`}
                      ></i>
                      {!collapsed && (
                        <>
                          <span className="flex-1">{item.label}</span>
                          {item.badge && (
                            <span className="w-5 h-5 rounded-md bg-brand-600 text-white text-[10px] font-bold flex items-center justify-center">
                              {item.badge}
                            </span>
                          )}
                        </>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Profile */}
        <div className="border-t border-sidebar-border p-3 flex-shrink-0">
          <div
            className={`flex items-center gap-3 p-2.5 rounded-xl hover:bg-sidebar-hover cursor-pointer transition-all ${
              collapsed ? "justify-center" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
              A
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  Admin
                </p>
                <p className="text-xs text-slate-500 truncate">
                  admin@designai.store
                </p>
              </div>
            )}
          </div>
        </div>
      </aside>
    </>
  );
}
