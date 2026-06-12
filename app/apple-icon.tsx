import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fc167e 0%, #f95e51 50%, #fbb336 100%)",
          color: "#fff",
          fontSize: 105,
          fontWeight: 600,
          letterSpacing: "-0.06em",
          paddingBottom: 14,
        }}
      >
        ij
      </div>
    ),
    { ...size }
  );
}
