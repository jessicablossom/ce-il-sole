import type { WeatherCondition } from "@/types/weather";

type WeatherCodeGroup = {
  condition: WeatherCondition;
  codes: readonly number[];
};

export const WEATHER_CODE_GROUPS = [
  { condition: "sunny", codes: [0, 1] },
  { condition: "partly-cloudy", codes: [2] },
  { condition: "cloudy", codes: [3] },
  { condition: "foggy", codes: [45, 48] },
  { condition: "drizzle", codes: [51, 53, 55, 56, 57] },
  { condition: "rainy", codes: [61, 63, 65, 66, 67, 80, 81, 82] },
  { condition: "snowy", codes: [71, 73, 75, 77, 85, 86] },
  { condition: "stormy", codes: [95, 96, 99] },
] as const satisfies readonly WeatherCodeGroup[];

export const NEGATIVE_WEATHER_CONDITIONS = [
  "drizzle",
  "rainy",
  "snowy",
  "stormy",
] as const satisfies readonly WeatherCondition[];

const WEATHER_CODE_DESCRIPTIONS: Readonly<Record<number, string>> = {
  0: "Clear sky",
  1: "Mainly clear",
  2: "Partly cloudy",
  3: "Overcast",
  45: "Fog",
  48: "Depositing rime fog",
  51: "Light drizzle",
  53: "Moderate drizzle",
  55: "Dense drizzle",
  56: "Light freezing drizzle",
  57: "Dense freezing drizzle",
  61: "Slight rain",
  63: "Moderate rain",
  65: "Heavy rain",
  66: "Light freezing rain",
  67: "Heavy freezing rain",
  71: "Slight snow fall",
  73: "Moderate snow fall",
  75: "Heavy snow fall",
  77: "Snow grains",
  80: "Slight rain showers",
  81: "Moderate rain showers",
  82: "Violent rain showers",
  85: "Slight snow showers",
  86: "Heavy snow showers",
  95: "Thunderstorm",
  96: "Thunderstorm with slight hail",
  99: "Thunderstorm with heavy hail",
} as const;

const WEATHER_CONDITION_BY_CODE = new Map<number, WeatherCondition>(
  WEATHER_CODE_GROUPS.flatMap(({ codes, condition }) =>
    codes.map((code) => [code, condition] as const),
  ),
);

export function getWeatherConditionFromCode(
  weatherCode: number | null | undefined,
): WeatherCondition {
  if (weatherCode === undefined || weatherCode === null) {
    return "unknown";
  }

  return WEATHER_CONDITION_BY_CODE.get(weatherCode) ?? "cloudy";
}

export function isSunnyWeatherCode(weatherCode: number): boolean {
  return getWeatherConditionFromCode(weatherCode) === "sunny";
}

export function getWeatherCodeDescription(weatherCode: number | null | undefined): string {
  if (weatherCode === undefined || weatherCode === null) {
    return "No weather code";
  }

  return WEATHER_CODE_DESCRIPTIONS[weatherCode] ?? "Unknown WMO weather code";
}

export function isNegativeWeatherCondition(
  condition: WeatherCondition,
): condition is (typeof NEGATIVE_WEATHER_CONDITIONS)[number] {
  return NEGATIVE_WEATHER_CONDITIONS.includes(
    condition as (typeof NEGATIVE_WEATHER_CONDITIONS)[number],
  );
}
