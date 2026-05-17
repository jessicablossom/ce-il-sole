import { ImageResponse } from "next/og";
import { OG_SUNNY_GLASS_THEME } from "@/lib/ogSunnyGlassTheme";
import { getOgSunPngAbsoluteUrl } from "@/lib/ogSunAssetUrl";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
} as const;

export const contentType = "image/png";

const Icon = () => {
  const t = OG_SUNNY_GLASS_THEME;
  const sunSrc = getOgSunPngAbsoluteUrl();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 8,
          background: `linear-gradient(145deg, ${t.backgroundStart} 0%, ${t.backgroundEnd} 100%)`,
        }}
      >
        <div
          style={{
            display: "flex",
            width: 26,
            height: 26,
            borderRadius: 8,
            background: t.glassFill,
            border: `1.5px solid ${t.glassStroke}`,
            boxShadow: `0 2px 8px ${t.panelShadow}`,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <img alt="" height={18} src={sunSrc} style={{ display: "flex" }} width={18} />
        </div>
      </div>
    ),
    { ...size },
  );
};

export default Icon;
