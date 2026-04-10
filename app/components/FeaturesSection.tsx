"use client";

import { useEffect, useRef } from "react";

const features = [
  {
    icon: "ph-lightning",
    title: "Pengiriman Instan",
    description:
      "Akun dikirim otomatis setelah pembayaran dikonfirmasi. Proses kurang dari 5 menit, langsung bisa digunakan.",
  },
  {
    icon: "ph-shield-check",
    title: "Garansi Full Replace",
    description:
      "Setiap pembelian dilengkapi garansi penuh. Jika ada masalah, kami langsung ganti tanpa ribet.",
  },
  {
    icon: "ph-headset",
    title: "Support 24/7",
    description:
      "Tim support kami siap membantu kapan saja melalui WhatsApp. Respon cepat dan solutif.",
  },
  {
    icon: "ph-seal-check",
    title: "Akun 100% Original",
    description:
      "Semua akun yang kami jual adalah akun original dengan lisensi resmi, bukan crack atau bajakan.",
  },
  {
    icon: "ph-wallet",
    title: "Harga Terjangkau",
    description:
      "Nikmati layanan premium dengan harga yang jauh lebih murah. Hemat hingga 90% dari harga resmi.",
  },
  {
    icon: "ph-credit-card",
    title: "Pembayaran Fleksibel",
    description:
      "Berbagai metode pembayaran tersedia: QRIS, Transfer Bank, e-Wallet (Dana, GoPay, OVO).",
  },
];

export default function FeaturesSection() {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="features"
      className="py-20 lg:py-28 bg-slate-50 relative"
      ref={sectionRef}
    >
      <div className="absolute inset-0 dot-pattern opacity-40"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 reveal">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            Keunggulan <span className="gradient-text">DesignAI Store</span>
          </h2>
          <p className="mt-4 text-slate-500 text-base lg:text-lg">
            Kami menjamin pengalaman terbaik dalam membeli akun premium AI.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="feature-card bg-white rounded-3xl p-8 border border-slate-100 shadow-sm reveal"
            >
              <div className="feature-icon-wrap w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center mb-6 transition-all duration-300">
                <i
                  className={`ph-duotone ${feature.icon} text-[28px] text-brand-600`}
                ></i>
              </div>
              <h3 className="font-display font-bold text-xl text-slate-900 mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-500 text-sm leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
