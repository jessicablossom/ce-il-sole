"use client";

import { useState } from "react";
import type { WeatherMood } from "@/types/weather";

const STORY_WIDTH = 1080;
const STORY_HEIGHT = 1920;
const STORY_PADDING = 92;
const APP_SIGNATURE = "C'è il sole?";
const GLASS_CARD = {
  x: 74,
  y: 252,
  width: 932,
  height: 1258,
  radius: 64,
} as const;

type SharePalette = {
  accent: string;
  backgroundEnd: string;
  backgroundStart: string;
  foreground: string;
  glassFill: string;
  glassStroke: string;
  muted: string;
  orb: string;
  shadow: string;
};

type ShareCardButtonProps = {
  cityName: string;
  mood: WeatherMood;
};

export function ShareCardButton({ cityName, mood }: ShareCardButtonProps) {
  const [isGenerating, setIsGenerating] = useState(false);

  function handleDownload() {
    setIsGenerating(true);

    try {
      const canvas = document.createElement("canvas");
      canvas.width = STORY_WIDTH;
      canvas.height = STORY_HEIGHT;

      const context = canvas.getContext("2d");

      if (!context) {
        return;
      }

      const palette = getSharePalette(mood.condition);

      drawGradientBackground(context, palette);
      drawSoftOrb(context, palette.orb, 820, 252, 620);
      drawSoftOrb(context, palette.accent, 108, 1450, 520);
      drawGlassCard(context, palette);

      context.fillStyle = palette.foreground;
      context.textAlign = "center";
      context.textBaseline = "top";

      context.font = '600 34px "IBM Plex Sans", Arial, sans-serif';
      context.letterSpacing = "8px";
      context.fillText(cityName.toUpperCase(), STORY_WIDTH / 2, GLASS_CARD.y + 86);

      context.font = '400 292px "Apple Color Emoji", "Segoe UI Emoji", sans-serif';
      context.letterSpacing = "0px";
      context.fillText(mood.icon, STORY_WIDTH / 2, GLASS_CARD.y + 246);

      context.font = '500 78px "Bodoni Moda", Georgia, serif';
      drawWrappedText({
        context,
        lineHeight: 96,
        maxWidth: GLASS_CARD.width - 176,
        text: mood.aside,
        x: STORY_WIDTH / 2,
        y: GLASS_CARD.y + 650,
      });

      context.fillStyle = palette.accent;
      context.font = '600 36px "IBM Plex Sans", Arial, sans-serif';
      context.letterSpacing = "0px";
      context.fillText(mood.answer, STORY_WIDTH / 2, GLASS_CARD.y + 1080);

      context.fillStyle = palette.foreground;
      context.font = '600 30px "IBM Plex Sans", Arial, sans-serif';
      context.letterSpacing = "6px";
      context.fillText(APP_SIGNATURE.toUpperCase(), STORY_WIDTH / 2, STORY_HEIGHT - 210);

      context.fillStyle = palette.muted;
      context.font = '500 28px "IBM Plex Sans", Arial, sans-serif';
      context.letterSpacing = "0px";
      context.fillText("la previsione più inutile d'Italia", STORY_WIDTH / 2, STORY_HEIGHT - 152);

      downloadCanvas(canvas, `ce-il-sole-${slugify(cityName)}.png`);
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <button
      className="mt-6 border-b border-[var(--line)]/35 pb-1 text-xs font-semibold uppercase tracking-widest text-[var(--foreground)] transition hover:border-[var(--line)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--line)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] disabled:cursor-wait disabled:opacity-60"
      disabled={isGenerating}
      onClick={handleDownload}
      type="button"
    >
      {isGenerating ? "Preparazione card..." : "Salva card IG"}
    </button>
  );
}

function getSharePalette(condition: WeatherMood["condition"]): SharePalette {
  const palettes = {
    cloudy: {
      accent: "#3f5666",
      backgroundEnd: "#d7dde2",
      backgroundStart: "#f4f6f8",
      foreground: "#1e2428",
      glassFill: "rgba(255, 255, 255, 0.42)",
      glassStroke: "rgba(255, 255, 255, 0.62)",
      muted: "rgba(30, 36, 40, 0.58)",
      orb: "rgba(124, 140, 153, 0.34)",
      shadow: "rgba(63, 86, 102, 0.22)",
    },
    drizzle: {
      accent: "#4f7489",
      backgroundEnd: "#cbd9e2",
      backgroundStart: "#eef4f7",
      foreground: "#1e2428",
      glassFill: "rgba(255, 255, 255, 0.38)",
      glassStroke: "rgba(255, 255, 255, 0.58)",
      muted: "rgba(30, 36, 40, 0.56)",
      orb: "rgba(79, 116, 137, 0.32)",
      shadow: "rgba(63, 86, 102, 0.24)",
    },
    foggy: {
      accent: "#65747d",
      backgroundEnd: "#dce5e9",
      backgroundStart: "#f7fafb",
      foreground: "#1e2428",
      glassFill: "rgba(255, 255, 255, 0.46)",
      glassStroke: "rgba(255, 255, 255, 0.68)",
      muted: "rgba(30, 36, 40, 0.52)",
      orb: "rgba(150, 163, 171, 0.36)",
      shadow: "rgba(63, 86, 102, 0.18)",
    },
    rainy: {
      accent: "#315d78",
      backgroundEnd: "#b9ccd7",
      backgroundStart: "#e8f0f4",
      foreground: "#1e2428",
      glassFill: "rgba(255, 255, 255, 0.36)",
      glassStroke: "rgba(255, 255, 255, 0.56)",
      muted: "rgba(30, 36, 40, 0.58)",
      orb: "rgba(49, 93, 120, 0.34)",
      shadow: "rgba(49, 93, 120, 0.25)",
    },
    snowy: {
      accent: "#5d8295",
      backgroundEnd: "#e5eef2",
      backgroundStart: "#fbfdfe",
      foreground: "#1e2428",
      glassFill: "rgba(255, 255, 255, 0.52)",
      glassStroke: "rgba(255, 255, 255, 0.74)",
      muted: "rgba(30, 36, 40, 0.5)",
      orb: "rgba(181, 207, 219, 0.5)",
      shadow: "rgba(63, 86, 102, 0.16)",
    },
    stormy: {
      accent: "#263d50",
      backgroundEnd: "#8295a1",
      backgroundStart: "#d7e0e5",
      foreground: "#172026",
      glassFill: "rgba(255, 255, 255, 0.34)",
      glassStroke: "rgba(255, 255, 255, 0.5)",
      muted: "rgba(23, 32, 38, 0.58)",
      orb: "rgba(38, 61, 80, 0.36)",
      shadow: "rgba(38, 61, 80, 0.28)",
    },
    sunny: {
      accent: "#d99f1f",
      backgroundEnd: "#f0c45f",
      backgroundStart: "#fff3c9",
      foreground: "#1e2428",
      glassFill: "rgba(255, 255, 255, 0.38)",
      glassStroke: "rgba(255, 255, 255, 0.64)",
      muted: "rgba(30, 36, 40, 0.56)",
      orb: "rgba(255, 255, 255, 0.48)",
      shadow: "rgba(157, 111, 26, 0.22)",
    },
    unknown: {
      accent: "#66717a",
      backgroundEnd: "#d8dee2",
      backgroundStart: "#f1f4f6",
      foreground: "#1e2428",
      glassFill: "rgba(255, 255, 255, 0.4)",
      glassStroke: "rgba(255, 255, 255, 0.62)",
      muted: "rgba(30, 36, 40, 0.56)",
      orb: "rgba(102, 113, 122, 0.32)",
      shadow: "rgba(63, 86, 102, 0.2)",
    },
  } as const satisfies Record<WeatherMood["condition"], SharePalette>;

  return palettes[condition];
}

function drawGradientBackground(context: CanvasRenderingContext2D, palette: SharePalette) {
  const gradient = context.createLinearGradient(0, 0, STORY_WIDTH, STORY_HEIGHT);
  gradient.addColorStop(0, palette.backgroundStart);
  gradient.addColorStop(1, palette.backgroundEnd);

  context.fillStyle = gradient;
  context.fillRect(0, 0, STORY_WIDTH, STORY_HEIGHT);
}

function drawSoftOrb(
  context: CanvasRenderingContext2D,
  color: string,
  x: number,
  y: number,
  radius: number,
) {
  const gradient = context.createRadialGradient(x, y, 0, x, y, radius);
  gradient.addColorStop(0, color);
  gradient.addColorStop(1, "rgba(255, 255, 255, 0)");

  context.fillStyle = gradient;
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
}

function drawGlassCard(context: CanvasRenderingContext2D, palette: SharePalette) {
  context.save();
  context.shadowColor = palette.shadow;
  context.shadowBlur = 64;
  context.shadowOffsetY = 38;
  drawRoundedRect(context, GLASS_CARD.x, GLASS_CARD.y, GLASS_CARD.width, GLASS_CARD.height, GLASS_CARD.radius);
  context.fillStyle = palette.glassFill;
  context.fill();
  context.restore();

  drawRoundedRect(context, GLASS_CARD.x, GLASS_CARD.y, GLASS_CARD.width, GLASS_CARD.height, GLASS_CARD.radius);
  context.strokeStyle = palette.glassStroke;
  context.lineWidth = 3;
  context.stroke();
}

function drawRoundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
) {
  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();
}

function drawWrappedText({
  context,
  lineHeight,
  maxWidth,
  text,
  x,
  y,
}: {
  context: CanvasRenderingContext2D;
  lineHeight: number;
  maxWidth: number;
  text: string;
  x: number;
  y: number;
}) {
  const words = text.split(" ");
  const lines: string[] = [];
  let currentLine = "";

  words.forEach((word) => {
    const nextLine = currentLine ? `${currentLine} ${word}` : word;

    if (context.measureText(nextLine).width > maxWidth && currentLine) {
      lines.push(currentLine);
      currentLine = word;
      return;
    }

    currentLine = nextLine;
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  lines.forEach((line, index) => {
    context.fillText(line, x, y + index * lineHeight);
  });
}

function downloadCanvas(canvas: HTMLCanvasElement, fileName: string) {
  const link = document.createElement("a");
  link.download = fileName;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
