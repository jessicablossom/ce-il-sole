import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
};

export const contentType = "image/png";

const Icon = () =>
  new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(145deg, #fff3c9 0%, #f0c45f 100%)",
        }}
      >
        <div
          style={{
            width: 22,
            height: 22,
            borderRadius: 11,
            background: "linear-gradient(145deg, #ffef9e 0%, #f5c518 55%, #e6a010 100%)",
            boxShadow: "0 0 10px rgba(245, 197, 24, 0.75)",
          }}
        />
      </div>
    ),
    { ...size },
  );

export default Icon;
