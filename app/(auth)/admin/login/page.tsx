"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { consumeAuthFeedback } from "@/lib/auth-feedback";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  useEffect(() => {
    const feedback = consumeAuthFeedback();
    if (feedback) {
      toast[feedback.type](feedback.title, { description: feedback.message });
      if (feedback.type === "error" || feedback.type === "warning") {
        setErrorMessage(feedback.message);
      }
    }

    async function checkSession() {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        router.replace("/admin");
        router.refresh();
        return;
      }

      setIsCheckingSession(false);
    }

    checkSession();
  }, [router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMessage(error.message);
      toast.error("Login gagal", { description: error.message });
      setIsSubmitting(false);
      return;
    }

    toast.success("Login berhasil", {
      description: "Selamat datang kembali di area admin.",
    });
    router.push("/admin");
    router.refresh();
  }

  if (isCheckingSession) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-slate-400">Memeriksa sesi admin...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-brand-50/30 px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-white border border-slate-100 rounded-3xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 text-white flex items-center justify-center shadow-lg shadow-brand-500/25">
              <i className="ph-duotone ph-lock-key text-2xl"></i>
            </div>
            <p className="text-xs font-bold text-brand-600 uppercase tracking-[0.2em] mb-2">
              Admin Access
            </p>
            <h1 className="font-display text-3xl font-extrabold text-slate-900">
              Login Admin
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Masuk dengan akun Supabase yang sudah punya role admin.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="admin@designai.store"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Masukkan password"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-400"
                required
              />
            </div>

            {errorMessage && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn-primary py-3.5 text-sm font-semibold text-white rounded-2xl flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
                  Memproses...
                </>
              ) : (
                <>
                  <i className="ph-duotone ph-sign-in text-lg"></i>
                  Masuk ke Admin
                </>
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-slate-100 text-center">
            <Link href="/" className="text-sm font-semibold text-slate-500 hover:text-brand-600 transition-colors">
              Kembali ke beranda
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
