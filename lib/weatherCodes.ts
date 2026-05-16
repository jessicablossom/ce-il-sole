import type { WeatherCondition } from "@/types/weather";

type WeatherCodeGroup = {
  condition: WeatherCondition;
  codes: readonly number[];
};

export const WEATHER_CODE_GROUPS = [
  { condition: "sunny", codes: [0, 1] },
  { condition: "cloudy", codes: [2, 3] },
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

export function isNegativeWeatherCondition(
  condition: WeatherCondition,
): condition is (typeof NEGATIVE_WEATHER_CONDITIONS)[number] {
  return NEGATIVE_WEATHER_CONDITIONS.includes(
    condition as (typeof NEGATIVE_WEATHER_CONDITIONS)[number],
  );
}
