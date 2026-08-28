import { ImageResponse } from "next/og";

export const alt = "Vo Huy — Software Engineer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#0a0a0b",
          color: "#f5f5f5",
          padding: 56,
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            right: 24,
            bottom: 24,
            border: "1px solid rgba(255, 255, 255, 0.14)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: 48,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 22,
              letterSpacing: 6,
              color: "#8a8a8a",
            }}
          >
            <span>WISTFY / SYSTEM</span>
            <span style={{ color: "#4d8dff" }}>CORE ACTIVE</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <div
              style={{
                display: "flex",
                fontSize: 132,
                fontWeight: 700,
                letterSpacing: -4,
                lineHeight: 1,
              }}
            >
              VO HUY
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 28,
                fontSize: 30,
                letterSpacing: 8,
                color: "#4d8dff",
              }}
            >
              SOFTWARE ENGINEER
            </div>
            <div
              style={{
                display: "flex",
                marginTop: 24,
                fontSize: 26,
                lineHeight: 1.4,
                color: "#8a8a8a",
                maxWidth: 720,
              }}
            >
              Engineering systems, products and ideas.
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontSize: 22,
              letterSpacing: 3,
              color: "#8a8a8a",
            }}
          >
            <span>hello@wistfy.dev</span>
            <span>VIETNAM · GMT+7</span>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
