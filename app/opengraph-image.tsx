import { ImageResponse } from "next/og";
import { fetchNotoColorEmojiFont, NOTO_COLOR_EMOJI_FAMILY } from "@/lib/fetchNotoColorEmojiFont";
import { OG_SUNNY_GLASS_THEME } from "@/lib/ogSunnyGlassTheme";
import { getWeatherIconForCondition } from "@/lib/weatherIcons";

export const runtime = "edge";

export const alt = "C’è il sole?";

export const size = {
  width: 1200,
  height: 630,
} as const;

export const contentType = "image/png";

const PANEL_INSET = 48;
const PANEL_RADIUS = 64;

const SUN_ICON = getWeatherIconForCondition("sunny");

const OpenGraphImage = async () => {
  const notoColorEmoji = await fetchNotoColorEmojiFont();
  const t = OG_SUNNY_GLASS_THEME;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            display: "flex",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(145deg, ${t.backgroundStart} 0%, ${t.backgroundEnd} 100%)`,
          }}
        />

        <div
          style={{
            position: "absolute",
            display: "flex",
            top: -72,
            right: -48,
            width: 380,
            height: 380,
            borderRadius: 190,
            background: t.lightOrb,
          }}
        />
        <div
          style={{
            position: "absolute",
            display: "flex",
            bottom: -100,
            left: -80,
            width: 340,
            height: 340,
            borderRadius: 170,
            background: t.accentOrb,
          }}
        />

        <div
          style={{
            position: "relative",
            display: "flex",
            width: "100%",
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
            padding: PANEL_INSET,
          }}
        >
          <div
            style={{
              display: "flex",
              width: size.width - PANEL_INSET * 2,
              height: size.height - PANEL_INSET * 2,
              borderRadius: PANEL_RADIUS,
              background: t.glassFill,
              border: `3px solid ${t.glassStroke}`,
              boxShadow: `0 32px 90px ${t.panelShadow}`,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 280,
                lineHeight: 1,
                fontFamily: NOTO_COLOR_EMOJI_FAMILY,
              }}
            >
              {SUN_ICON}
            </div>
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

export default OpenGraphImage;
