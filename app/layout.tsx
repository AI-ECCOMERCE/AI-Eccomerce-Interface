import type { Metadata } from "next";
import { Inter, Outfit, Geist } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { cn } from "@/lib/utils";

const geist = Geist({ subsets: ["latin"], variable: "--font-sans" });

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

export const metadata: Metadata = {
  title: "Poinstore — Marketplace AI Premium Terpercaya",
  description:
    "Poinstore adalah marketplace AI premium terpercaya untuk para profesional. Dapatkan akun ChatGPT, Gemini, Canva Pro, Notion AI, dan tools AI terpilih dengan harga kompetitif, pengiriman instan, dan garansi resmi.",
  keywords:
    "poinstore, marketplace ai, akun ai premium, akun chatgpt, akun gemini pro, canva pro, notion ai, tools ai profesional, beli akun ai terpercaya",
  icons: {
    icon: "/logo2.png",
    shortcut: "/logo2.png",
    apple: "/logo2.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={cn("scroll-smooth", inter.variable, outfit.variable, "font-sans", geist.variable)}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/duotone/style.css"
        />
        <link rel="icon" href="/logo2.png" type="image/png" />
        <link rel="shortcut icon" href="/logo2.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo2.png" />
      </head>
      <body className="bg-white text-slate-800 antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
