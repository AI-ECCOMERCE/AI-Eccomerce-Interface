import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  compress: true,
  poweredByHeader: false,

  async headers() {
    return [
      {
        // Cache static assets aggressively (images, fonts, etc.)
        source: "/:path*.(ico|png|jpg|jpeg|gif|svg|webp|woff|woff2|ttf|otf)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      // NOTE: Do NOT set Cache-Control on /_next/static/:path*
      // Next.js manages those headers internally; overriding them breaks HMR in dev.
    ];
  },
};

export default nextConfig;
