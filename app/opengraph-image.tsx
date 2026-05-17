import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "C’è il sole? — La previsione più inutile d’Italia.";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #fff3c9 0%, #f0c45f 42%, #e9edf0 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "48px 64px",
            borderRadius: "32px",
            background: "rgba(255, 255, 255, 0.42)",
            border: "3px solid rgba(255, 255, 255, 0.65)",
            boxShadow: "0 28px 80px rgba(63, 86, 102, 0.2)",
          }}
        >
          <div style={{ fontSize: 120, lineHeight: 1 }}>☀️</div>
          <div
            style={{
              marginTop: 12,
              fontSize: 76,
              fontWeight: 700,
              color: "#1e2428",
              letterSpacing: -3,
              fontFamily: "Georgia, 'Times New Roman', serif",
            }}
          >
            C’è il sole?
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 26,
              fontWeight: 600,
              color: "#66717a",
              letterSpacing: 3,
              textTransform: "uppercase",
              fontFamily: "system-ui, -apple-system, sans-serif",
            }}
          >
            La previsione più inutile d’Italia
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
