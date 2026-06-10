import { ImageResponse } from "next/og";
import { getPortfolioCached } from "@/lib/portfolio-service";

export const runtime = "nodejs";
export const alt = "Muhammed Ijlan — Portfolio";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpengraphImage() {
  const { about, settings } = await getPortfolioCached();

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "100%",
          height: "100%",
          padding: 80,
          justifyContent: "center",
          background: "linear-gradient(135deg, #04060a 0%, #0b1020 60%, #131a33 100%)",
          color: "#EDF0F5",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 28, letterSpacing: 6, textTransform: "uppercase", color: "#22D3EE" }}>
          {about.role}
        </div>
        <div style={{ fontSize: 88, fontWeight: 700, marginTop: 18, lineHeight: 1.02 }}>{about.name}</div>
        <div style={{ fontSize: 34, color: "#9AA3B2", marginTop: 26, maxWidth: 920 }}>{settings.tagline}</div>
        <div style={{ display: "flex", marginTop: 52 }}>
          <div style={{ height: 10, width: 160, borderRadius: 8, background: "linear-gradient(90deg, #22D3EE, #7C3AED)" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
