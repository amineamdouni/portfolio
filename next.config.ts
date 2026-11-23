import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import createNextIntlPlugin from "next-intl/plugin";
import { projects } from "./content/projects";

const origins = (urls: Array<string | null | undefined>) => [
  ...new Set(urls.filter((u): u is string => !!u).map((u) => new URL(u).origin)),
];

// Read from the project data, so a new demo is allowed as soon as it is listed.
const backends = origins(projects.map((p) => p.healthUrl)); // LiveDemoButton: fetch + image ping
const framedDemos = origins(projects.filter((p) => p.category === "mobile").map((p) => p.demoUrl)); // PhoneFrame

// Pages are static, so inline scripts (Next's own, next-themes) can't carry a per-request nonce:
// script-src keeps 'unsafe-inline' and the policy limits where anything can load from or connect to.
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${process.env.NODE_ENV === "development" ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  ["img-src 'self' data: blob:", ...backends].join(" "),
  "font-src 'self'",
  ["connect-src 'self'", ...backends].join(" "),
  ["frame-src", ...framedDemos].join(" "),
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'self'",
].join("; ");

const nextConfig: NextConfig = {
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
      // Not on PDFs: the browser's PDF viewer is a plugin document and object-src 'none' can block it.
      { source: "/((?!.*\\.pdf$).*)", headers: [{ key: "Content-Security-Policy", value: csp }] },
    ];
  },
  // The contact page was removed; contact details live on Home and in the footer.
  async redirects() {
    return [{ source: "/:locale(en|fr)/contact", destination: "/:locale#contact", permanent: true }];
  },
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

const withMDX = createMDX({});
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

export default withNextIntl(withMDX(nextConfig));
