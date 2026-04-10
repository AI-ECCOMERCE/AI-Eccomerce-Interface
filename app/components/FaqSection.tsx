"use client";

import { useEffect, useRef, useState } from "react";

const faqItems = [
  {
    question: "Apakah akun yang dijual original?",
    answer:
      "Ya, semua akun yang kami jual 100% original dan berlisensi resmi. Kami bekerja sama dengan provider premium untuk menjamin keaslian setiap akun. Setiap pembelian juga disertai garansi penuh.",
  },
  {
    question: "Berapa lama proses pengiriman akun?",
    answer:
      "Proses pengiriman sangat cepat! Setelah pembayaran dikonfirmasi, akun akan dikirim dalam waktu 1-5 menit melalui WhatsApp atau email. Untuk metode otomatis, akun langsung terkirim secara instan.",
  },
  {
    question: "Bagaimana jika akun bermasalah?",
    answer:
      "Kami menyediakan garansi full replace. Jika akun mengalami masalah dalam masa garansi, kami akan langsung mengganti dengan akun baru tanpa biaya tambahan. Cukup hubungi support kami melalui WhatsApp.",
  },
  {
    question: "Metode pembayaran apa saja yang tersedia?",
    answer:
      "Kami menerima berbagai metode pembayaran: Transfer Bank (BCA, BNI, BRI, Mandiri), e-Wallet (Dana, GoPay, OVO, ShopeePay), dan QRIS. Pilih metode yang paling mudah dan nyaman untukmu.",
  },
  {
    question: "Apakah bisa perpanjang langganan?",
    answer:
      "Tentu saja! Kamu bisa perpanjang langganan akun premium kapan saja sebelum masa aktif habis. Cukup hubungi admin melalui WhatsApp untuk proses perpanjangan dengan harga yang sama.",
  },
];

export default function FaqSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

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

  const toggleFaq = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="py-20 lg:py-28 bg-white"
      ref={sectionRef}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16 reveal">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            Pertanyaan <span className="gradient-text">Umum</span>
          </h2>
          <p className="mt-4 text-slate-500 text-base lg:text-lg">
            Temukan jawaban dari pertanyaan yang sering ditanyakan.
          </p>
        </div>

        <div className="space-y-4 reveal">
          {faqItems.map((item, index) => (
            <div
              key={index}
              className="faq-item border border-slate-200 rounded-2xl overflow-hidden bg-white hover:border-brand-200 transition-colors"
            >
              <button
                onClick={() => toggleFaq(index)}
                className="w-full flex items-center justify-between p-6 text-left"
              >
                <span className="font-semibold text-slate-900 pr-4">
                  {item.question}
                </span>
                <i
                  className="ph-duotone ph-caret-down text-xl text-slate-400 transition-transform duration-300 flex-shrink-0 faq-chevron"
                  style={{
                    transform:
                      openIndex === index ? "rotate(180deg)" : "rotate(0deg)",
                  }}
                ></i>
              </button>
              <div
                className={`faq-answer px-6 ${
                  openIndex === index ? "open" : ""
                }`}
              >
                <p className="text-sm text-slate-500 leading-relaxed pb-6">
                  {item.answer}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
