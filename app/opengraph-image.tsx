import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "C’è il sole?";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

const OpenGraphImage = () =>
  new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #fff3c9 0%, #f0c45f 45%, #e9edf0 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 380,
            height: 380,
            borderRadius: 48,
            background: "rgba(255, 255, 255, 0.42)",
            border: "3px solid rgba(255, 255, 255, 0.65)",
            boxShadow: "0 32px 90px rgba(63, 86, 102, 0.22)",
          }}
        >
          {/* Pure CSS “sun”: emoji often renders blank in Satori, breaking OG previews. */}
          <div
            style={{
              width: 200,
              height: 200,
              borderRadius: 100,
              background: "linear-gradient(145deg, #ffef9e 0%, #f5c518 45%, #e6a010 100%)",
              boxShadow:
                "0 0 0 14px rgba(245, 197, 24, 0.4), 0 0 0 36px rgba(245, 197, 24, 0.15), 0 28px 72px rgba(180, 120, 20, 0.35)",
            }}
          />
        </div>
      </div>
    ),
    { ...size },
  );

export default OpenGraphImage;
