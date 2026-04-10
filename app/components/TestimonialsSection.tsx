"use client";

import { useEffect, useRef } from "react";

const testimonials = [
  {
    name: "Rizky Ananda",
    role: "Content Creator",
    initials: "RA",
    gradientClass: "from-blue-400 to-indigo-500",
    text: '"Mantap banget! Akun ChatGPT Plus langsung aktif kurang dari 3 menit setelah bayar. Support juga sangat responsif dan ramah. Highly recommended!"',
  },
  {
    name: "Sari Fitria",
    role: "Freelance Designer",
    initials: "SF",
    gradientClass: "from-pink-400 to-rose-500",
    text: '"Sudah 6 bulan langganan Canva Pro di sini, tidak pernah ada masalah. Harga jauh lebih murah dan ada garansi. Pokoknya the best!"',
  },
  {
    name: "Budi Wicaksono",
    role: "Software Developer",
    initials: "BW",
    gradientClass: "from-emerald-400 to-teal-500",
    text: '"GitHub Copilot sangat membantu pekerjaan coding saya. Prosesnya mudah dan aman. Sekarang saya juga beli Gemini Advanced di sini!"',
  },
  {
    name: "Dina Nuraini",
    role: "Digital Marketer",
    initials: "DN",
    gradientClass: "from-violet-400 to-purple-500",
    text: '"Awalnya ragu, tapi setelah coba beli akun Gemini Advanced, langsung puas! Pengiriman super cepat dan garansi terpercaya."',
  },
  {
    name: "Ahmad Hidayat",
    role: "Mahasiswa",
    initials: "AH",
    gradientClass: "from-amber-400 to-orange-500",
    text: '"Saya beli paket bundle ChatGPT + Canva Pro, harganya sangat worth it! Kualitas akun premium semua, ga ada masalah sama sekali."',
  },
  {
    name: "Maya Rahmawati",
    role: "Entrepreneur",
    initials: "MR",
    gradientClass: "from-cyan-400 to-blue-500",
    text: '"Pelayanan sangat profesional. Saya order jam 11 malam dan tetap direspon dengan cepat. Akun Notion AI langsung aktif. TOP!"',
  },
];

export default function TestimonialsSection() {
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
      id="testimonials"
      className="py-20 lg:py-28 bg-slate-50 relative"
      ref={sectionRef}
    >
      <div className="absolute inset-0 dot-pattern opacity-30"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16 reveal">
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
            Testimoni <span className="gradient-text">Kami</span>
          </h2>
          <p className="mt-4 text-slate-500 text-base lg:text-lg">
            Dengarkan langsung cerita dari pelanggan puas kami.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="testimonial-card bg-white rounded-3xl p-8 border border-slate-100 shadow-sm reveal"
            >
              <div className="flex gap-0.5 mb-4">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
              </div>
              <p className="text-slate-600 text-sm leading-relaxed mb-6">
                {testimonial.text}
              </p>
              <div className="flex items-center gap-3">
                <div
                  className={`w-11 h-11 rounded-full bg-gradient-to-br ${testimonial.gradientClass} flex items-center justify-center text-white font-bold text-sm`}
                >
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-sm text-slate-900">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
