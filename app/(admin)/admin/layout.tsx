import { redirect } from "next/navigation";
import Sidebar from "@/app/components/Sidebar";
import { createClient } from "@/lib/supabase/server";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar userEmail={user.email ?? "admin@designai.store"} />
      <main className="flex-1 ml-64 min-h-screen">{children}</main>
    </div>
  );
}
