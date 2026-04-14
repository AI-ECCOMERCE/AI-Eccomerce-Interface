export default function HeroSection() {
  return (
    <section
      id="home"
      className="hero-bg relative min-h-screen flex items-center pt-20 pb-16 lg:pb-24 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative">
        {/* Decorative elements moved to background */}
        <div className="absolute top-10 left-1/4 w-32 h-32 bg-brand-200/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-10 right-1/4 w-40 h-40 bg-purple-200/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>
        
        <div className="flex flex-col items-center justify-center relative z-10 text-center mx-auto max-w-4xl">
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight tracking-tight animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <span className="text-slate-900">Akses Semua</span>
            <br className="hidden sm:block" />
            <span className="gradient-text mx-2">Tools AI Premium</span>
            <br className="hidden sm:block" />
            <span className="text-slate-900">Dalam Sekejap</span>
          </h1>

          <p
            className="mt-6 text-base sm:text-lg text-slate-500 leading-relaxed max-w-2xl mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            Dapatkan akun premium ChatGPT, Gemini, Canva Pro, dan berbagai
            tools AI terbaik dengan harga terjangkau. Proses cepat, aman, dan
            bergaransi.
          </p>

          <div
            className="mt-8 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <a
              href="#products"
              className="btn-primary px-8 py-4 text-base font-semibold text-white rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-brand-500/25 w-full sm:w-auto hover:-translate-y-1 transition-transform"
            >
              Jelajahi Produk
              <i className="ph-duotone ph-arrow-right text-xl"></i>
            </a>
            <a
              href="#features"
              className="px-8 py-4 text-base font-semibold text-slate-700 bg-white border-2 border-slate-200 rounded-2xl hover:border-brand-300 hover:text-brand-600 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
            >
              <i className="ph-duotone ph-play-circle text-xl"></i>
              Pelajari Lebih
            </a>
          </div>

          {/* Trust badges */}
          <div
            className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-8 animate-fade-in-up bg-white/60 backdrop-blur-sm p-4 rounded-2xl border border-white/40 shadow-sm inline-flex"
            style={{ animationDelay: "0.6s" }}
          >
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                <i className="ph-duotone ph-shield-check text-lg text-green-600"></i>
              </div>
              <span className="text-sm sm:text-base text-slate-700 font-semibold">
                100% Aman
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center">
                <i className="ph-duotone ph-lightning text-lg text-amber-600"></i>
              </div>
              <span className="text-sm sm:text-base text-slate-700 font-semibold">
                Instan Delivery
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center">
                <i className="ph-duotone ph-headset text-lg text-brand-600"></i>
              </div>
              <span className="text-sm sm:text-base text-slate-700 font-semibold">
                24/7 Support
              </span>
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
