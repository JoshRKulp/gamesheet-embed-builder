import { ImageResponse } from "next/og";

export const runtime = "edge";

export default function Image() {
  return new ImageResponse(
    <div style={{ background: "#111315", color: "#f2f4f2", width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: "70px 80px", fontFamily: "sans-serif" }}>
      <div style={{ color: "#f9c308", fontSize: 28, letterSpacing: 2 }}>⌘ embed-gamesheet.dev</div>
      <div style={{ marginTop: 100, fontSize: 76, lineHeight: 1.05, fontWeight: 700 }}>Gamesheet<br /><span style={{ color: "#55d69a" }}>Embed Builder</span></div>
      <div style={{ marginTop: 32, color: "#899397", fontSize: 28 }}>Create custom scores, schedule, standings & stats iframes.</div>
    </div>,
    { width: 1200, height: 630 },
  );
}
