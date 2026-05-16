import type { WeatherCondition, WeatherMood } from "@/types/weather";

const WEATHER_ICONS = {
  cloudy: "☁️",
  drizzle: "🌧️",
  foggy: "☁️",
  rainy: "🌧️",
  snowy: "❄️",
  stormy: "⛈️",
  sunny: "☀️",
  unknown: "☁️",
} as const satisfies Record<WeatherCondition, WeatherMood["icon"]>;

export function getWeatherIconForCondition(condition: WeatherCondition): WeatherMood["icon"] {
  return WEATHER_ICONS[condition];
}
