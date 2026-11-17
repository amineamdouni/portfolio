import { ImageResponse } from "next/og";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/**
 * Shared Open Graph card: flat, warm neutral background, one accent rule.
 * Uses the built-in font of next/og (no network fetch at build time).
 */
export function ogImage({ eyebrow, title, footer }: { eyebrow: string; title: string; footer: string }) {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#FAF7F0",
          color: "#211F1A",
          padding: "72px 80px",
          borderBottom: "12px solid #2448C4",
        }}
      >
        <div style={{ display: "flex", fontSize: 26, letterSpacing: 2, color: "#6B6555", textTransform: "uppercase" }}>
          {eyebrow}
        </div>
        <div style={{ display: "flex", fontSize: 76, fontWeight: 600, lineHeight: 1.08, letterSpacing: -2, maxWidth: 1000 }}>
          {title}
        </div>
        <div style={{ display: "flex", fontSize: 28, color: "#4F4A3D" }}>{footer}</div>
      </div>
    ),
    ogSize,
  );
}
