import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

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
  title: "DesignAI Store — Premium AI Account Marketplace",
  description:
    "DesignAI Store — Marketplace terpercaya untuk akun premium AI. Dapatkan akun ChatGPT, Gemini, Canva Pro, dan tools AI lainnya dengan harga terjangkau.",
  keywords:
    "akun chatgpt, akun gemini, akun canva pro, marketplace ai, tools ai premium",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${outfit.variable} scroll-smooth`}>
      <head>
        <link
          rel="stylesheet"
          href="https://unpkg.com/@phosphor-icons/web@2.1.1/src/duotone/style.css"
        />
      </head>
      <body className="bg-white text-slate-800 antialiased">{children}</body>
    </html>
  );
}
