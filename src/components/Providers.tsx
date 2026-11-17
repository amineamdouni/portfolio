"use client";

import type { ReactNode } from "react";
import { ThemeProvider } from "next-themes";

/** System theme by default; the header toggle stores an explicit choice. */
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
      {children}
    </ThemeProvider>
  );
}
