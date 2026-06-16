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
          background: "linear-gradient(135deg, #07080b 0%, #120a12 55%, #1c1118 100%)",
          color: "#f5f7fa",
          fontFamily: "sans-serif",
        }}
      >
        {/* ij ligature mark */}
        <svg width="128" height="128" viewBox="0 0 128 128" fill="none">
          <defs>
            <linearGradient id="og" x1="40" y1="22" x2="92" y2="110" gradientUnits="userSpaceOnUse">
              <stop offset="0" stopColor="#fc167e" />
              <stop offset="0.5" stopColor="#f95e51" />
              <stop offset="1" stopColor="#fbb336" />
            </linearGradient>
          </defs>
          <g stroke="url(#og)" strokeWidth="15" strokeLinecap="round" strokeLinejoin="round">
            <path d="M 47 50 V 82" />
            <path d="M 81 50 V 88 Q 81 104 65 104 L 51 104" />
          </g>
          <g fill="url(#og)">
            <circle cx="47" cy="29" r="8.5" />
            <circle cx="81" cy="29" r="8.5" />
          </g>
        </svg>

        <div style={{ fontSize: 26, letterSpacing: 6, textTransform: "uppercase", color: "#fbb336", marginTop: 40 }}>
          {about.role}
        </div>
        <div style={{ fontSize: 84, fontWeight: 700, marginTop: 14, lineHeight: 1.02 }}>{about.name}</div>
        <div style={{ fontSize: 32, color: "#8b93a1", marginTop: 24, maxWidth: 920 }}>{settings.tagline}</div>
        <div style={{ display: "flex", marginTop: 48 }}>
          <div style={{ height: 10, width: 180, borderRadius: 8, background: "linear-gradient(100deg, #fc167e, #f95e51 52%, #fbb336)" }} />
        </div>
      </div>
    ),
    { ...size }
  );
}
