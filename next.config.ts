import type { NextConfig } from "next";

// Basis-Sicherheitsheader. Bewusst ohne Content-Security-Policy: Next.js
// braucht Inline-Scripts, eine CSP müsste mit Nonces sauber eingerichtet werden.
const securityHeaders = [
  { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  agentRules: false,
  // Fotos mit höherer Qualität ausliefern als der Standard (75), sonst
  // entstehen in Himmel und Laub sichtbare Kompressionsspuren.
  images: { qualities: [85] },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
