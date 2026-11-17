import type { ReactNode } from "react";
import "./globals.css";

// The real root layout (<html>, <body>) is app/[locale]/layout.tsx.
// This pass-through exists so app/not-found.tsx can render for paths outside a locale.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children;
}
