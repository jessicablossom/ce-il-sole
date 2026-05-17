import { ImageResponse } from "next/og";
import { fetchNotoColorEmojiFont, NOTO_COLOR_EMOJI_FAMILY } from "@/lib/fetchNotoColorEmojiFont";
import { OG_SUNNY_GLASS_THEME } from "@/lib/ogSunnyGlassTheme";
import { getWeatherIconForCondition } from "@/lib/weatherIcons";

export const runtime = "edge";

export const size = {
  width: 32,
  height: 32,
} as const;

export const contentType = "image/png";

const SUN_ICON = getWeatherIconForCondition("sunny");

const Icon = async () => {
  const notoColorEmoji = await fetchNotoColorEmojiFont();
  const t = OG_SUNNY_GLASS_THEME;

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
          <div
            style={{
              display: "flex",
              fontSize: 17,
              lineHeight: 1,
              fontFamily: NOTO_COLOR_EMOJI_FAMILY,
            }}
          >
            {SUN_ICON}
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [{ name: NOTO_COLOR_EMOJI_FAMILY, data: notoColorEmoji, style: "normal", weight: 400 }],
    },
  );
};

export default Icon;
