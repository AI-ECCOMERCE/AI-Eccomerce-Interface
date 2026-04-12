import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const SITE_URL = "https://www.poinstore.com";
const SITE_NAME = "Poinstore";
const OG_IMAGE = `${SITE_URL}/logo1.png`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: "Poinstore — Marketplace AI Premium Terpercaya",
    template: "%s | Poinstore",
  },
  description:
    "Poinstore adalah marketplace AI premium terpercaya di Indonesia. Beli akun ChatGPT Plus, Gemini Pro, Canva Pro, Notion AI & tools AI profesional lainnya. Pengiriman otomatis, harga terbaik, garansi 7 hari.",

  keywords: [
    "poinstore",
    "marketplace ai indonesia",
    "beli akun chatgpt plus",
    "akun gemini pro murah",
    "akun canva pro",
    "akun notion ai",
    "jual akun ai premium",
    "tools ai profesional",
    "akun ai terpercaya",
    "beli akun ai murah",
    "akun midjourney",
    "akun claude ai",
    "akun copilot microsoft",
    "marketplace digital product indonesia",
    "akun premium ai indonesia",
    "toko akun ai",
    "akun ai original",
    "ai subscription murah",
    "jual akun chatgpt",
    "jual akun canva pro",
  ],

  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
      "max-video-preview": -1,
    },
  },

  alternates: {
    canonical: SITE_URL,
    languages: {
      "id-ID": SITE_URL,
    },
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "Poinstore — Marketplace AI Premium Terpercaya",
    description:
      "Beli akun AI premium dengan aman dan mudah. ChatGPT Plus, Gemini Pro, Canva Pro, dan 20+ tools AI lainnya. Pengiriman instan, harga terbaik, garansi 7 hari.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Poinstore — Marketplace AI Premium Terpercaya",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Poinstore — Marketplace AI Premium Terpercaya",
    description:
      "Beli akun AI premium dengan aman. ChatGPT Plus, Gemini Pro, Canva Pro & lebih banyak tools AI. Pengiriman instan & garansi 7 hari.",
    images: [OG_IMAGE],
    creator: "@poinstore",
    site: "@poinstore",
  },

  icons: {
    icon: "/logo2.png",
    shortcut: "/logo2.png",
    apple: "/logo2.png",
  },

  category: "technology",
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: OG_IMAGE,
      },
      description:
        "Marketplace AI premium terpercaya di Indonesia. Menyediakan akun ChatGPT, Gemini, Canva Pro, dan tools AI profesional lainnya.",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        availableLanguage: "Indonesian",
      },
      sameAs: ["https://www.instagram.com/poinstore"],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      description: "Marketplace AI premium terpercaya di Indonesia",
      publisher: { "@id": `${SITE_URL}/#organization` },
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/?q={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
      inLanguage: "id-ID",
    },
    {
      "@type": "WebPage",
      "@id": `${SITE_URL}/#webpage`,
      url: SITE_URL,
      name: "Poinstore — Marketplace AI Premium Terpercaya",
      isPartOf: { "@id": `${SITE_URL}/#website` },
      about: { "@id": `${SITE_URL}/#organization` },
      description:
        "Beli akun AI premium dengan aman dan mudah di Poinstore. ChatGPT Plus, Gemini Pro, Canva Pro, dan tools AI lainnya.",
      inLanguage: "id-ID",
      potentialAction: {
        "@type": "ReadAction",
        target: [SITE_URL],
      },
    },
    {
      "@type": "Store",
      "@id": `${SITE_URL}/#store`,
      name: SITE_NAME,
      url: SITE_URL,
      image: OG_IMAGE,
      description:
        "Marketplace digital menyediakan akun AI premium: ChatGPT Plus, Gemini Pro, Canva Pro, Notion AI, Midjourney, dan tools AI profesional lainnya.",
      priceRange: "Rp",
      currenciesAccepted: "IDR",
      paymentAccepted: "QRIS, Transfer Bank",
      areaServed: "ID",
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="id"
      className={cn(
        "scroll-smooth",
        inter.variable,
        outfit.variable,
        "font-sans"
      )}
    >
      <head>
        {/* Preconnect to CDN origins to reduce connection latency */}
        <link rel="preconnect" href="https://unpkg.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://unpkg.com" />

        {/* Preload Phosphor icon font to avoid render-blocking */}
        <link
          rel="preload"
          href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/duotone/Phosphor-Duotone.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />

        {/* Load Phosphor icon stylesheet non-render-blocking */}
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="preload"
          href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/duotone/style.css"
          as="style"
          // @ts-expect-error onLoad with string is valid for progressive CSS loading
          onLoad="this.onload=null;this.rel='stylesheet'"
        />
        <noscript>
          <link
            rel="stylesheet"
            href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/duotone/style.css"
          />
        </noscript>

        <link rel="icon" href="/logo2.png" type="image/png" />
        <link rel="shortcut icon" href="/logo2.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo2.png" />
        <meta name="geo.region" content="ID" />
        <meta name="geo.country" content="Indonesia" />
        <meta name="language" content="Indonesian" />
        <Script
          id="json-ld-schema"
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="bg-white text-slate-800 antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
