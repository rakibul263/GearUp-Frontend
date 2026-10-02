import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "nodejs";

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 20,
          background: "linear-gradient(135deg, #2563eb, #1e40af, #0f172a)",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          borderRadius: 8,
          border: "1.5px solid rgba(255, 255, 255, 0.4)",
          fontWeight: 900,
          boxShadow: "0 4px 10px rgba(37, 99, 235, 0.4)",
        }}
      >
        <span style={{ color: "#ffffff", marginRight: 1 }}>G</span>
        <span style={{ color: "#38bdf8" }}>▲</span>
      </div>
    ),
    {
      ...size,
    }
  );
}
