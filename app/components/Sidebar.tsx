"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { setAuthFeedback } from "@/lib/auth-feedback";
import { adminFetch } from "@/lib/api/adminFetch";
import { createClient } from "@/lib/supabase/client";
import {
  ADMIN_ORDER_POLL_INTERVAL_MS,
  countUnreadOrders,
  getLastSeenOrdersAt,
  markOrdersAsSeen,
} from "@/app/lib/adminOrders";

type SidebarItem = {
  label: string;
  href: string;
  icon: string;
  badge?: string;
};

type SidebarSection = {
  section: string;
  items: SidebarItem[];
};

const menuItems: SidebarSection[] = [
  {
    section: "UTAMA",
    items: [
      { label: "Dashboard", href: "/admin", icon: "ph-squares-four" },
      { label: "Pesanan", href: "/admin/orders", icon: "ph-receipt" },
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

interface SidebarProps {
  userEmail: string;
}

export default function Sidebar({ userEmail }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [unreadOrdersCount, setUnreadOrdersCount] = useState(0);

  const userLabel = useMemo(() => userEmail.split("@")[0] || "Admin", [userEmail]);
  const userInitial = useMemo(() => userLabel.charAt(0).toUpperCase(), [userLabel]);

  useEffect(() => {
    let active = true;

    const syncUnreadOrders = async () => {
      if (pathname?.startsWith("/admin/orders")) {
        markOrdersAsSeen();

        if (active) {
          setUnreadOrdersCount(0);
        }

        return;
      }

      try {
        const json = await adminFetch<{ success: boolean; data?: { created_at?: string | null }[] }>("/api/orders");

        if (!json.success || !active) {
          return;
        }

        const unreadCount = countUnreadOrders(json.data || [], getLastSeenOrdersAt());
        setUnreadOrdersCount(unreadCount);
      } catch (error) {
        console.error("Failed to load unread order count:", error);
      }
    };

    void syncUnreadOrders();

    const timer = window.setInterval(() => {
      void syncUnreadOrders();
    }, ADMIN_ORDER_POLL_INTERVAL_MS);

    return () => {
      active = false;
      window.clearInterval(timer);
    };
  }, [pathname]);

  const menuSections = useMemo(
    () =>
      menuItems.map((section) => ({
        ...section,
        items: section.items.map((item) =>
          item.href === "/admin/orders"
            ? {
                ...item,
                badge:
                  unreadOrdersCount > 0
                    ? unreadOrdersCount > 99
                      ? "99+"
                      : String(unreadOrdersCount)
                    : undefined,
              }
            : item
        ),
      })),
    [unreadOrdersCount]
  );

  async function handleLogout() {
    setIsSigningOut(true);

    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setAuthFeedback({
        type: "success",
        title: "Logout berhasil",
        message: "Sesi admin telah diakhiri.",
      });
      router.push("/admin/login");
      router.refresh();
    } catch (error) {
      toast.error("Logout gagal", {
        description:
          error instanceof Error ? error.message : "Terjadi kesalahan saat logout.",
      });
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <aside
      className={`fixed left-0 top-0 bottom-0 z-40 bg-sidebar-bg border-r border-sidebar-border flex flex-col transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-64"
      }`}
    >
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

      <nav className="flex-1 overflow-y-auto py-4 px-3">
        {menuSections.map((section) => (
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

      <div className="border-t border-sidebar-border p-3 flex-shrink-0 space-y-3">
        <div
          className={`flex items-center gap-3 p-2.5 rounded-xl bg-sidebar-hover/60 ${
            collapsed ? "justify-center" : ""
          }`}
        >
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
            {userInitial}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{userLabel}</p>
              <p className="text-xs text-slate-500 truncate">{userEmail}</p>
            </div>
          )}
        </div>

        <button
          onClick={handleLogout}
          disabled={isSigningOut}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-sidebar-hover transition-all disabled:opacity-60 ${
            collapsed ? "justify-center" : ""
          }`}
          title={collapsed ? "Logout" : undefined}
        >
          <i className="ph-duotone ph-sign-out text-xl"></i>
          {!collapsed && <span>{isSigningOut ? "Keluar..." : "Logout"}</span>}
        </button>
      </div>
    </aside>
  );
}
