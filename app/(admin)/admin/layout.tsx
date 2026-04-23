import { redirect } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import AdminTopProgressBar from "@/app/components/admin/AdminTopProgressBar";
import { AdminNavigationProvider } from "@/app/components/admin/AdminNavigationProvider";
import { createClient } from "@/lib/supabase/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

async function verifyServerAdminAccess(token: string) {
  try {
    const response = await fetch(`${API_URL}/api/orders/summary`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (response.ok) {
      return { isAdmin: true, shouldRedirect: false };
    }

    if (response.status === 401 || response.status === 403) {
      return { isAdmin: false, shouldRedirect: true };
    }

    return { isAdmin: false, shouldRedirect: false };
  } catch {
    return { isAdmin: false, shouldRedirect: false };
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!user || !token) {
    redirect("/admin/login");
  }

  const adminAccess = await verifyServerAdminAccess(token);

  if (adminAccess.shouldRedirect && !adminAccess.isAdmin) {
    redirect("/admin/login");
  }

  return (
    <AdminNavigationProvider>
      <div className="flex min-h-screen bg-slate-50">
        <AdminTopProgressBar />
        <Sidebar userEmail={user.email ?? "admin@designai.store"} />
        <main className="flex-1 ml-64 min-h-screen">{children}</main>
      </div>
    </AdminNavigationProvider>
  );
}
