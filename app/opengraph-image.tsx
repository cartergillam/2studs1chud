import { ImageResponse } from "next/og";

export const alt = "2 Studs 1 Chud — Spin the Boys";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        background: "#090909",
        border: "28px solid #f4e900",
        fontFamily: "Arial Black, sans-serif",
      }}
    >
      <div style={{ fontSize: 30, letterSpacing: 7, color: "#f4e900" }}>THE STUD/CHUD SELECTION AUTHORITY</div>
      <div style={{ display: "flex", alignItems: "center", gap: 28, fontSize: 112, fontWeight: 900 }}>
        <span>2 STUDS</span><span style={{ color: "#f4e900" }}>1</span><span style={{ color: "#ff2b2b" }}>CHUD</span>
      </div>
      <div style={{ fontSize: 42, marginTop: 30 }}>SPIN THE BOYS.</div>
    </div>,
    size,
  );
}
