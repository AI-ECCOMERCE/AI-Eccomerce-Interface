import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main footer */}
        <div className="py-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-5">
              <Image
                src="/logo1.png"
                alt="DesignAI Store Logo"
                width={140}
                height={38}
                className="h-7 sm:h-8 w-auto object-contain brightness-0 invert"
              />
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-6">
              Marketplace terpercaya untuk akun premium AI dan tools
              produktivitas. Harga terjangkau, garansi penuh, pengiriman instan.
            </p>
            <div className="flex gap-3">
              <a
                href="https://twitter.com/poinstore"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ikuti Poinstore di Twitter/X"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-brand-600 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
              </a>
              <a
                href="https://instagram.com/poinstore"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ikuti Poinstore di Instagram"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-brand-600 flex items-center justify-center transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
              </a>
              <a
                href="https://tiktok.com/@poinstore"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Ikuti Poinstore di TikTok"
                className="w-10 h-10 rounded-xl bg-slate-800 hover:bg-brand-600 flex items-center justify-center transition-colors"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.75a8.23 8.23 0 004.79 1.53V6.84a4.86 4.86 0 01-1.03-.15z" /></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-display font-bold text-white mb-5">Menu</h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-slate-400 hover:text-brand-400 text-sm transition-colors">
                  Beranda
                </a>
              </li>
              <li>
                <a href="#products" className="text-slate-400 hover:text-brand-400 text-sm transition-colors">
                  Produk
                </a>
              </li>
              <li>
                <a href="#features" className="text-slate-400 hover:text-brand-400 text-sm transition-colors">
                  Keunggulan
                </a>
              </li>
              <li>
                <a href="#testimonials" className="text-slate-400 hover:text-brand-400 text-sm transition-colors">
                  Testimoni
                </a>
              </li>
              <li>
                <a href="#faq" className="text-slate-400 hover:text-brand-400 text-sm transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-display font-bold text-white mb-5">Produk</h3>
            <ul className="space-y-3">
              <li>
                <a href="#products" className="text-slate-400 hover:text-brand-400 text-sm transition-colors">
                  ChatGPT Plus
                </a>
              </li>
              <li>
                <a href="#products" className="text-slate-400 hover:text-brand-400 text-sm transition-colors">
                  Gemini Advanced
                </a>
              </li>
              <li>
                <a href="#products" className="text-slate-400 hover:text-brand-400 text-sm transition-colors">
                  Canva Pro
                </a>
              </li>
              <li>
                <a href="#products" className="text-slate-400 hover:text-brand-400 text-sm transition-colors">
                  GitHub Copilot
                </a>
              </li>
              <li>
                <a href="#products" className="text-slate-400 hover:text-brand-400 text-sm transition-colors">
                  Midjourney
                </a>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-display font-bold text-white mb-5">
              Hubungi Kami
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <i className="ph-duotone ph-envelope-simple text-xl text-brand-400 mt-0.5 flex-shrink-0"></i>
                <span className="text-slate-400 text-sm">
                  support@designai.store
                </span>
              </li>
              <li className="flex items-start gap-3">
                <i className="ph-duotone ph-phone text-xl text-brand-400 mt-0.5 flex-shrink-0"></i>
                <span className="text-slate-400 text-sm">
                  +62 812-3456-7890
                </span>
              </li>
              <li className="flex items-start gap-3">
                <i className="ph-duotone ph-clock text-xl text-brand-400 mt-0.5 flex-shrink-0"></i>
                <span className="text-slate-400 text-sm">
                  24/7 Online Support
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="py-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; 2026 DesignAI Store. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="text-slate-500 hover:text-brand-400 text-sm transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="text-slate-500 hover:text-brand-400 text-sm transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
