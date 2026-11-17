import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen icon: the "AA" monogram from icon.svg, design-system colours. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#211F1A",
          color: "#FAF7F0",
        }}
      >
        <div style={{ display: "flex", fontSize: 84, fontWeight: 700, letterSpacing: -3 }}>AA</div>
        <div style={{ display: "flex", width: 88, height: 10, borderRadius: 5, background: "#6E8BFF", marginTop: 6 }} />
      </div>
    ),
    size,
  );
}
