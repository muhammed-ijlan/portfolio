import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

export default function Icon() {
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
          borderRadius: 96,
          color: "#fff",
          fontSize: 300,
          fontWeight: 600,
          letterSpacing: "-0.06em",
          paddingBottom: 40,
        }}
      >
        ij
      </div>
    ),
    { ...size }
  );
}
