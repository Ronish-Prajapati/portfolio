import { ImageResponse } from "next/og";
import { siteConfig } from "@/lib/site";

export const runtime = "edge";
export const alt = siteConfig.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "linear-gradient(135deg, #102a52 0%, #1e3a8a 100%)",
          color: "white",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, color: "#fbbf24", marginBottom: 12, letterSpacing: 2 }}>
          PORTFOLIO
        </div>
        <div style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.1 }}>{siteConfig.name}</div>
        <div style={{ fontSize: 40, color: "#bfdbfe", marginTop: 16 }}>Frontend Developer</div>
        <div style={{ fontSize: 26, color: "#93c5fd", marginTop: 40 }}>
          React · TypeScript · Next.js
        </div>
      </div>
    ),
    { ...size },
  );
}
