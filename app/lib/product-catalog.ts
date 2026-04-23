export interface ProductCatalogInfo {
  systemType: string;
  systemIcon: string;
  systemColor: string;
  detailDescription: string;
  highlights: { icon: string; text: string }[];
  rules: string[];
}

const catalog: Record<string, ProductCatalogInfo> = {
  "openai-chatgpt": {
    systemType: "Upgrade Akun Sendiri",
    systemIcon: "ph-user-circle-gear",
    systemColor: "bg-blue-50 text-blue-700 border-blue-100",
    detailDescription:
      "Nikmati akses AI tercanggih dari OpenAI tanpa kehilangan riwayat chat Anda. Kami melakukan upgrade langsung pada akun pribadi Anda, sehingga semua data dan percakapan tetap aman. 100% Private dan terjamin keamanannya.",
    highlights: [
      { icon: "ph-lock-key", text: "100% Private — menggunakan akun pribadi Anda sendiri" },
      { icon: "ph-chat-circle-dots", text: "Riwayat chat & data tetap aman sepenuhnya" },
      { icon: "ph-rocket-launch", text: "Akses GPT-4o, DALL-E, Advanced Data Analysis" },
      { icon: "ph-shield-check", text: "Proses upgrade aman tanpa risiko kehilangan data" },
    ],
    rules: [
      "Akun yang diupgrade adalah akun pribadi milik pembeli sendiri.",
      "Privasi dan data Anda 100% aman selama proses upgrade/penautan.",
      "Jangan mengubah password akun selama masa langganan aktif.",
    ],
  },
  "ChatGPT Plus": {
    systemType: "Upgrade Akun Sendiri",
    systemIcon: "ph-user-circle-gear",
    systemColor: "bg-blue-50 text-blue-700 border-blue-100",
    detailDescription:
      "Nikmati akses AI tercanggih dari OpenAI tanpa kehilangan riwayat chat Anda. Kami melakukan upgrade langsung pada akun pribadi Anda, sehingga semua data dan percakapan tetap aman. 100% Private dan terjamin keamanannya.",
    highlights: [
      { icon: "ph-lock-key", text: "100% Private — menggunakan akun pribadi Anda sendiri" },
      { icon: "ph-chat-circle-dots", text: "Riwayat chat & data tetap aman sepenuhnya" },
      { icon: "ph-rocket-launch", text: "Akses GPT-4o, DALL-E, Advanced Data Analysis" },
      { icon: "ph-shield-check", text: "Proses upgrade aman tanpa risiko kehilangan data" },
    ],
    rules: [
      "Akun yang diupgrade adalah akun pribadi milik pembeli sendiri.",
      "Privasi dan data Anda 100% aman selama proses upgrade/penautan.",
      "Jangan mengubah password akun selama masa langganan aktif.",
    ],
  },
  "google-gemini": {
    systemType: "Upgrade Akun Sendiri",
    systemIcon: "ph-user-circle-gear",
    systemColor: "bg-blue-50 text-blue-700 border-blue-100",
    detailDescription:
      "Dapatkan akses penuh ke Gemini Advanced dari Google dengan upgrade langsung di akun Google Anda. Nikmati kemampuan AI multimodal terdepan tanpa kehilangan data apapun. 100% Private dan aman.",
    highlights: [
      { icon: "ph-lock-key", text: "100% Private — menggunakan akun Google Anda sendiri" },
      { icon: "ph-database", text: "Semua data & riwayat percakapan tetap utuh" },
      { icon: "ph-brain", text: "Akses Gemini Ultra, analisis gambar & dokumen" },
      { icon: "ph-google-logo", text: "Terintegrasi penuh dengan ekosistem Google" },
    ],
    rules: [
      "Akun yang diupgrade adalah akun Google pribadi milik pembeli.",
      "Privasi dan data Anda 100% aman selama proses penautan.",
      "Jangan mengubah password akun Google selama masa langganan aktif.",
    ],
  },
  "Gemini Advanced": {
    systemType: "Upgrade Akun Sendiri",
    systemIcon: "ph-user-circle-gear",
    systemColor: "bg-blue-50 text-blue-700 border-blue-100",
    detailDescription:
      "Dapatkan akses penuh ke Gemini Advanced dari Google dengan upgrade langsung di akun Google Anda. Nikmati kemampuan AI multimodal terdepan tanpa kehilangan data apapun. 100% Private dan aman.",
    highlights: [
      { icon: "ph-lock-key", text: "100% Private — menggunakan akun Google Anda sendiri" },
      { icon: "ph-database", text: "Semua data & riwayat percakapan tetap utuh" },
      { icon: "ph-brain", text: "Akses Gemini Ultra, analisis gambar & dokumen" },
      { icon: "ph-google-logo", text: "Terintegrasi penuh dengan ekosistem Google" },
    ],
    rules: [
      "Akun yang diupgrade adalah akun Google pribadi milik pembeli.",
      "Privasi dan data Anda 100% aman selama proses penautan.",
      "Jangan mengubah password akun Google selama masa langganan aktif.",
    ],
  },
  "canva": {
    systemType: "Invite Link via Email",
    systemIcon: "ph-envelope-simple",
    systemColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
    detailDescription:
      "Cukup cantumkan alamat email Anda yang terdaftar di Canva, kami akan mengirimkan undangan ke tim Pro. Setelah bergabung, Anda langsung menikmati seluruh fitur Canva Pro — desain bebas watermark dengan akses aset premium tanpa batas!",
    highlights: [
      { icon: "ph-envelope-open", text: "Sistem undangan via email — cukup berikan email Canva Anda" },
      { icon: "ph-paint-brush-broad", text: "Akses 100+ juta template, foto, video & elemen premium" },
      { icon: "ph-magic-wand", text: "Background Remover, Magic Resize & fitur Pro lainnya" },
      { icon: "ph-prohibit", text: "Desain bebas watermark — hasil profesional tanpa batas" },
    ],
    rules: [
      "Pastikan email yang diberikan aktif dan sudah terdaftar di Canva.",
      "Email tidak boleh sedang terkunci di tim Canva Pro lain.",
      "Jangan keluar dari tim Canva Pro yang sudah di-invite selama masa langganan.",
    ],
  },
  "Canva Pro": {
    systemType: "Invite Link via Email",
    systemIcon: "ph-envelope-simple",
    systemColor: "bg-emerald-50 text-emerald-700 border-emerald-100",
    detailDescription:
      "Cukup cantumkan alamat email Anda yang terdaftar di Canva, kami akan mengirimkan undangan ke tim Pro. Setelah bergabung, Anda langsung menikmati seluruh fitur Canva Pro — desain bebas watermark dengan akses aset premium tanpa batas!",
    highlights: [
      { icon: "ph-envelope-open", text: "Sistem undangan via email — cukup berikan email Canva Anda" },
      { icon: "ph-paint-brush-broad", text: "Akses 100+ juta template, foto, video & elemen premium" },
      { icon: "ph-magic-wand", text: "Background Remover, Magic Resize & fitur Pro lainnya" },
      { icon: "ph-prohibit", text: "Desain bebas watermark — hasil profesional tanpa batas" },
    ],
    rules: [
      "Pastikan email yang diberikan aktif dan sudah terdaftar di Canva.",
      "Email tidak boleh sedang terkunci di tim Canva Pro lain.",
      "Jangan keluar dari tim Canva Pro yang sudah di-invite selama masa langganan.",
    ],
  },
  "capcut": {
    systemType: "Akun Disediakan Admin",
    systemIcon: "ph-user-switch",
    systemColor: "bg-amber-50 text-amber-700 border-amber-100",
    detailDescription:
      "Anda akan menerima detail login (Email & Password) dari kami. Tinggal login dan nikmati seluruh fitur editing Pro — efek eksklusif, template premium, dan ekspor kualitas tinggi tanpa watermark!",
    highlights: [
      { icon: "ph-sign-in", text: "Akun siap pakai — langsung login dengan detail yang diberikan" },
      { icon: "ph-video-camera", text: "Akses semua efek, transisi & template eksklusif Pro" },
      { icon: "ph-export", text: "Ekspor video kualitas tinggi tanpa watermark" },
      { icon: "ph-film-strip", text: "Editing profesional di mobile maupun desktop" },
    ],
    rules: [
      "Dilarang keras mengubah email, password, atau profil pada akun yang diberikan.",
      "Pelanggaran terhadap aturan ini akan membuat garansi hangus seketika.",
      "Gunakan akun hanya untuk keperluan editing pribadi.",
    ],
  },
  "CapCut Pro": {
    systemType: "Akun Disediakan Admin",
    systemIcon: "ph-user-switch",
    systemColor: "bg-amber-50 text-amber-700 border-amber-100",
    detailDescription:
      "Anda akan menerima detail login (Email & Password) dari kami. Tinggal login dan nikmati seluruh fitur editing Pro — efek eksklusif, template premium, dan ekspor kualitas tinggi tanpa watermark!",
    highlights: [
      { icon: "ph-sign-in", text: "Akun siap pakai — langsung login dengan detail yang diberikan" },
      { icon: "ph-video-camera", text: "Akses semua efek, transisi & template eksklusif Pro" },
      { icon: "ph-export", text: "Ekspor video kualitas tinggi tanpa watermark" },
      { icon: "ph-film-strip", text: "Editing profesional di mobile maupun desktop" },
    ],
    rules: [
      "Dilarang keras mengubah email, password, atau profil pada akun yang diberikan.",
      "Pelanggaran terhadap aturan ini akan membuat garansi hangus seketika.",
      "Gunakan akun hanya untuk keperluan editing pribadi.",
    ],
  },
};

const defaultCatalog: ProductCatalogInfo = {
  systemType: "Akun Premium",
  systemIcon: "ph-star",
  systemColor: "bg-brand-50 text-brand-700 border-brand-100",
  detailDescription:
    "Nikmati akses penuh ke semua fitur premium. Akun original dengan garansi penuh dari Poinstore — proses cepat, aman, dan terpercaya.",
  highlights: [
    { icon: "ph-seal-check", text: "Akun 100% original dan legal" },
    { icon: "ph-lightning", text: "Proses pengiriman cepat 5-15 menit" },
    { icon: "ph-shield-check", text: "Garansi penuh sesuai durasi langganan" },
    { icon: "ph-headset", text: "Support 24/7 siap membantu" },
  ],
  rules: [
    "Ikuti instruksi penggunaan yang diberikan oleh admin.",
    "Jangan mengubah kredensial akun tanpa konfirmasi admin.",
  ],
};

export const generalTerms: string[] = [
  "Pesanan diproses dalam waktu 5–15 menit selama jam operasional admin.",
  "Garansi berlaku penuh sesuai durasi langganan yang dibeli.",
  "Pembeli wajib memberikan ulasan positif (Bintang 5) maksimal 1x24 jam setelah pesanan diterima untuk mengaktifkan garansi.",
  "Tidak ada pengembalian dana (refund) jika terjadi kelalaian dari pihak pembeli yang melanggar aturan toko.",
  "Membeli berarti menyetujui seluruh syarat & ketentuan yang berlaku.",
];

export function getProductCatalog(productIcon: string, productName: string): ProductCatalogInfo {
  return catalog[productIcon] || catalog[productName] || defaultCatalog;
}
