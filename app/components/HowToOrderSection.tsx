"use client";

import { useEffect, useRef } from "react";

const steps = [
  {
    number: "1",
    title: "Pilih Produk",
    description: "Pilih akun premium yang kamu butuhkan dari katalog kami.",
    showConnector: true,
  },
  {
    number: "2",
    title: "Bayar",
    description: "Lakukan pembayaran dengan metode yang tersedia (QRIS, Transfer, e-Wallet).",
    showConnector: true,
  },
  {
    number: "3",
    title: "Terima Email",
    description: "Anda akan menerima email setelah pesanan Anda berhasil dikonfirmasi.",
    showConnector: true,
  },
  {
    number: "4",
    title: "Dihubungi Admin",
    description: "Setelah pesanan sudah berhasil, Anda akan dihubungi oleh admin untuk memproses upgrade ke akun Anda.",
    showConnector: false,
  },
];

export default function HowToOrderSection() {
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
    <section id="how-to-order" className="py-20 lg:py-28 bg-white" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 reveal">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            Mudah &amp; <span className="gradient-text">Cepat</span>
          </h2>
          <p className="mt-4 text-slate-500 text-base lg:text-lg">
            Hanya 4 langkah mudah untuk mendapatkan akun premium.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative text-center reveal">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-500 to-brand-600 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-brand-500/25">
                <span className="text-2xl font-display font-extrabold text-white">
                  {step.number}
                </span>
              </div>
              <h3 className="font-display font-bold text-lg text-slate-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-slate-500 leading-relaxed">
                {step.description}
              </p>
              {/* Connector line (hidden on mobile) */}
              {step.showConnector && (
                <div className="hidden lg:block absolute top-8 left-[60%] w-[80%] h-[2px] bg-gradient-to-r from-brand-300 to-brand-200"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
