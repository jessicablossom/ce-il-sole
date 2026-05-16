"use client";

import { useEffect } from "react";
import { getWeatherIconForCondition } from "@/lib/weatherIcons";
import type { WeatherCondition } from "@/types/weather";

type WeatherFaviconProps = {
  condition: WeatherCondition;
};

export function WeatherFavicon({ condition }: WeatherFaviconProps) {
  useEffect(() => {
    const icon = getWeatherIconForCondition(condition);
    const link = getOrCreateFaviconLink();
    const svg = [
      '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">',
      '<text x="50" y="72" text-anchor="middle" font-size="82">',
      icon,
      "</text>",
      "</svg>",
    ].join("");

    link.href = `data:image/svg+xml,${encodeURIComponent(svg)}`;
  }, [condition]);

  return null;
}

function getOrCreateFaviconLink(): HTMLLinkElement {
  const existingLink = document.querySelector<HTMLLinkElement>(
    'link[rel="icon"][data-weather-favicon="true"]',
  );

  if (existingLink) {
    return existingLink;
  }

  const link = document.createElement("link");
  link.dataset.weatherFavicon = "true";
  link.rel = "icon";
  link.type = "image/svg+xml";
  document.head.appendChild(link);

  return link;
}
