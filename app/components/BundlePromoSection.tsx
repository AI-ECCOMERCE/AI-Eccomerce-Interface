"use client";

import { useEffect, useRef, useState, useCallback } from "react";

export default function BundlePromoSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [timeLeft, setTimeLeft] = useState({ days: "07", hours: "12", minutes: "45", seconds: "30" });

  const updateCountdown = useCallback(() => {
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7);

    const update = () => {
      const now = new Date();
      const diff = endDate.getTime() - now.getTime();
      if (diff <= 0) return;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({
        days: String(days).padStart(2, "0"),
        hours: String(hours).padStart(2, "0"),
        minutes: String(minutes).padStart(2, "0"),
        seconds: String(seconds).padStart(2, "0"),
      });
    };

    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const cleanup = updateCountdown();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("visible");
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
    );

    const reveals = sectionRef.current?.querySelectorAll(".reveal");
    reveals?.forEach((el) => observer.observe(el));

    return () => {
      cleanup?.();
      observer.disconnect();
    };
  }, [updateCountdown]);

  return (
    <section
      ref={sectionRef}
      className="py-20 bg-gradient-to-br from-brand-600 via-brand-700 to-purple-800 relative overflow-hidden"
    >
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="reveal">
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight">
              Paket Bundle Hemat
              <br />
              <span className="text-brand-200">Diskon Hingga 90%</span>
            </h2>
            <p className="mt-6 text-brand-100/80 text-base lg:text-lg leading-relaxed max-w-lg">
              Gabungkan beberapa akun premium sekaligus dan dapatkan harga
              spesial. Hemat lebih banyak dengan paket bundle eksklusif kami.
            </p>

            <div className="mt-8 grid sm:grid-cols-2 gap-4">
              <div className="glass-dark rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-400/20 flex items-center justify-center">
                    <i className="ph-duotone ph-crown text-xl text-amber-400"></i>
                  </div>
                  <h4 className="font-display font-bold text-white">
                    Starter Pack
                  </h4>
                </div>
                <p className="text-sm text-brand-200/70 mb-3">
                  ChatGPT + Canva Pro
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-display font-extrabold text-white">
                    Rp 60K
                  </span>
                  <span className="text-sm text-brand-300 line-through">
                    Rp 70K
                  </span>
                </div>
              </div>
              <div className="glass-dark rounded-2xl p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-400/20 flex items-center justify-center">
                    <i className="ph-duotone ph-diamond text-xl text-rose-400"></i>
                  </div>
                  <h4 className="font-display font-bold text-white">
                    Pro Pack
                  </h4>
                </div>
                <p className="text-sm text-brand-200/70 mb-3">
                  ChatGPT + Gemini + Canva
                </p>
                <div className="flex items-end gap-2">
                  <span className="text-2xl font-display font-extrabold text-white">
                    Rp 95K
                  </span>
                  <span className="text-sm text-brand-300 line-through">
                    Rp 110K
                  </span>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/6281234567890?text=Halo, saya tertarik dengan paket bundle!"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-700 font-bold rounded-2xl hover:bg-brand-50 transition-all shadow-lg hover:shadow-xl"
            >
              <i className="ph-duotone ph-package text-xl"></i>
              Lihat Semua Bundle
            </a>
          </div>

          {/* Timer / Urgency */}
          <div className="reveal">
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center mx-auto mb-6">
                <i className="ph-duotone ph-clock-countdown text-5xl text-white"></i>
              </div>
              <h3 className="font-display text-2xl font-bold text-white mb-2">
                Promo Terbatas!
              </h3>
              <p className="text-brand-200/70 text-sm mb-8">
                Penawaran berakhir dalam:
              </p>

              <div className="flex justify-center gap-4" id="countdown">
                {[
                  { value: timeLeft.days, label: "Hari" },
                  { value: timeLeft.hours, label: "Jam" },
                  { value: timeLeft.minutes, label: "Menit" },
                  { value: timeLeft.seconds, label: "Detik" },
                ].map((item) => (
                  <div className="text-center" key={item.label}>
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                      <span className="text-2xl sm:text-3xl font-display font-extrabold text-white">
                        {item.value}
                      </span>
                    </div>
                    <span className="text-xs text-brand-200/70 mt-2 block">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex items-center justify-center gap-6 text-brand-200/60 text-sm">
                <div className="flex items-center gap-2">
                  <i className="ph-duotone ph-shield-check text-base"></i>
                  Garansi Penuh
                </div>
                <div className="flex items-center gap-2">
                  <i className="ph-duotone ph-arrows-clockwise text-base"></i>
                  Bisa Refund
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
