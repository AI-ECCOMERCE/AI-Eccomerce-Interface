import { setAuthFeedback, type AuthFeedback } from "@/lib/auth-feedback";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const LOGIN_PATH = "/admin/login";

function redirectToLogin(feedback: AuthFeedback) {
  setAuthFeedback(feedback);

  if (typeof window !== "undefined") {
    window.location.assign(LOGIN_PATH);
  }
}

function getErrorMessage(payload: any, fallback: string) {
  return payload?.error || fallback;
}

function showErrorToast(title: string, message: string) {
  toast.error(title, { description: message });
}

export function showSuccessToast(title: string, message: string) {
  toast.success(title, { description: message });
}

export async function adminFetch<T = any>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const token = session?.access_token;

  if (!token) {
    const message = "Sesi admin tidak ditemukan. Silakan login kembali.";
    await supabase.auth.signOut();
    redirectToLogin({
      type: "warning",
      title: "Perlu login ulang",
      message,
    });
    throw new Error(message);
  }

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${token}`);

  if (init.body && !(init.body instanceof FormData) && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const contentType = response.headers.get("content-type") || "";
  const payload = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (response.status === 401) {
    const message = getErrorMessage(payload, "Sesi admin berakhir. Silakan login kembali.");
    await supabase.auth.signOut();
    redirectToLogin({
      type: "warning",
      title: "Sesi berakhir",
      message,
    });
    throw new Error(message);
  }

  if (response.status === 403) {
    const message = getErrorMessage(payload, "Akun ini tidak memiliki akses admin.");
    await supabase.auth.signOut();
    redirectToLogin({
      type: "error",
      title: "Akses admin ditolak",
      message,
    });
    throw new Error(message);
  }

  if (!response.ok) {
    const message = getErrorMessage(payload, "Permintaan admin gagal diproses.");
    showErrorToast("Permintaan gagal", message);
    throw new Error(message);
  }

  return payload as T;
}
