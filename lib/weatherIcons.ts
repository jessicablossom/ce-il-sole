import type { WeatherCondition, WeatherMood } from "@/types/weather";

const WEATHER_ICONS = {
  cloudy: "☁️",
  drizzle: "🌧️",
  foggy: "☁️",
  "partly-cloudy": "🌤️",
  rainy: "🌧️",
  snowy: "❄️",
  stormy: "⛈️",
  sunny: "☀️",
  unknown: "☁️",
} as const satisfies Record<WeatherCondition, WeatherMood["icon"]>;

export const getWeatherIconForCondition = (condition: WeatherCondition): WeatherMood["icon"] =>
  WEATHER_ICONS[condition];
