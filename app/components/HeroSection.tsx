"use client";

import { ChatGPTIcon, GeminiIcon, CanvaIcon } from "./BrandIcons";

export default function HeroSection() {
  return (
    <section
      id="home"
      className="hero-bg relative min-h-screen flex items-center pt-20 pb-16 lg:pb-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div className="relative z-10 text-center lg:text-left">
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight animate-fade-in-up">
              <span className="text-slate-900">Akses Semua</span>
              <br />
              <span className="gradient-text">Tools AI Premium</span>
              <br />
              <span className="text-slate-900">Dalam Sekejap</span>
            </h1>

            <p
              className="mt-6 text-base sm:text-lg text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0 animate-fade-in-up"
              style={{ animationDelay: "0.2s" }}
            >
              Dapatkan akun premium ChatGPT, Gemini, Canva Pro, dan berbagai
              tools AI terbaik dengan harga terjangkau. Proses cepat, aman, dan
              bergaransi.
            </p>

            <div
              className="mt-8 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up"
              style={{ animationDelay: "0.4s" }}
            >
              <a
                href="#products"
                className="btn-primary px-8 py-4 text-base font-semibold text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25"
              >
                Jelajahi Produk
                <i className="ph-duotone ph-arrow-right text-xl"></i>
              </a>
              <a
                href="#features"
                className="px-8 py-4 text-base font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-2xl hover:border-brand-300 hover:text-brand-600 transition-all flex items-center justify-center gap-2"
              >
                <i className="ph-duotone ph-play-circle text-xl"></i>
                Pelajari Lebih
              </a>
            </div>

            {/* Trust badges */}
            <div
              className="mt-10 flex items-center gap-6 justify-center lg:justify-start animate-fade-in-up"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="flex items-center gap-2">
                <i className="ph-duotone ph-shield-check text-xl text-green-500"></i>
                <span className="text-sm text-slate-500 font-medium">
                  100% Aman
                </span>
              </div>
              <div className="flex items-center gap-2">
                <i className="ph-duotone ph-lightning text-xl text-amber-500"></i>
                <span className="text-sm text-slate-500 font-medium">
                  Instan Delivery
                </span>
              </div>
              <div className="flex items-center gap-2">
                <i className="ph-duotone ph-headset text-xl text-brand-500"></i>
                <span className="text-sm text-slate-500 font-medium">
                  24/7 Support
                </span>
              </div>
            </div>
          </div>

          {/* Right Content - Floating Cards */}
          <div className="relative hidden lg:block">
            <div className="relative w-full h-[500px]">
              {/* Main Card */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 animate-float">
                <div className="bg-white rounded-3xl p-6 shadow-2xl shadow-brand-500/10 border border-brand-100/50">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
                    <ChatGPTIcon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-slate-900">
                    ChatGPT Plus
                  </h3>
                  <p className="text-sm text-slate-500 mt-1">
                    Akses GPT-4o &amp; DALL-E
                  </p>
                  <div className="mt-4 flex items-end gap-1">
                    <span className="text-3xl font-display font-extrabold text-slate-900">
                      Rp 45K
                    </span>
                    <span className="text-sm text-slate-400 mb-1">/bulan</span>
                  </div>
                  <div className="mt-4 h-1 bg-brand-100 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-gradient-to-r from-brand-500 to-brand-400 rounded-full"></div>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Stok tersedia: 75%
                  </p>
                </div>
              </div>

              {/* Floating Card 2 */}
              <div className="absolute top-4 right-4 animate-float-delay">
                <div className="bg-white rounded-2xl px-5 py-4 shadow-xl shadow-slate-200/50 border border-slate-100/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center">
                    <GeminiIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Gemini Advanced
                    </p>
                    <p className="text-xs text-slate-400">Best Seller ⭐</p>
                  </div>
                </div>
              </div>

              {/* Floating Card 3 */}
              <div
                className="absolute bottom-8 left-0 animate-float"
                style={{ animationDelay: "1s" }}
              >
                <div className="bg-white rounded-2xl px-5 py-4 shadow-xl shadow-slate-200/50 border border-slate-100/80 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-400 to-purple-500 flex items-center justify-center">
                    <CanvaIcon className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Canva Pro
                    </p>
                    <div className="flex gap-0.5 mt-0.5">
                      <span className="star text-xs">★</span>
                      <span className="star text-xs">★</span>
                      <span className="star text-xs">★</span>
                      <span className="star text-xs">★</span>
                      <span className="star text-xs">★</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div className="absolute top-16 left-12 w-20 h-20 bg-brand-200/30 rounded-full blur-2xl"></div>
              <div className="absolute bottom-24 right-16 w-32 h-32 bg-purple-200/20 rounded-full blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 80" fill="none">
          <path
            d="M0 40L60 35C120 30 240 20 360 22C480 24 600 38 720 44C840 50 960 48 1080 42C1200 36 1320 26 1380 21L1440 16V80H1380C1320 80 1200 80 1080 80C960 80 840 80 720 80C600 80 480 80 360 80C240 80 120 80 60 80H0V40Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
