import type { City, DailyWeather, WeatherMood, WeatherReport } from "@/types/weather";
import { getWeatherConditionFromCode, isSunnyWeatherCode } from "./weatherCodes";
import { getWeatherMoodCopy } from "./weatherCopy";
import { addDaysToIsoDate, getIsoDateInTimeZone, getYearStartIsoDate } from "./utils";

const FORECAST_ENDPOINT = "https://api.open-meteo.com/v1/forecast";
const ARCHIVE_ENDPOINT = "https://archive-api.open-meteo.com/v1/archive";
const ARCHIVE_DATA_DELAY_DAYS = 5;

type OpenMeteoDailyResponse = {
  daily?: {
    time?: unknown;
    weather_code?: unknown;
  };
};

export async function getWeatherReport(city: City, now = new Date()): Promise<WeatherReport> {
  const todayIsoDate = getIsoDateInTimeZone(now, city.timeZone);
  const yearStartIsoDate = getYearStartIsoDate(todayIsoDate);
  const archiveEndIsoDate = addDaysToIsoDate(todayIsoDate, -ARCHIVE_DATA_DELAY_DAYS);

  const [forecastDays, archiveDays] = await Promise.all([
    fetchDailyWeather(buildForecastUrl(city)),
    archiveEndIsoDate >= yearStartIsoDate
      ? fetchDailyWeather(buildArchiveUrl(city, yearStartIsoDate, archiveEndIsoDate))
      : Promise.resolve([]),
  ]);

  const today = forecastDays.find((day) => day.date === todayIsoDate) ?? forecastDays[0] ?? null;
  const sunnyArchiveDays = archiveDays.filter((day) => isSunnyWeatherCode(day.weatherCode));

  return {
    city,
    today,
    sunnyDaysThisYear: sunnyArchiveDays.length,
    lastSunnyDay: sunnyArchiveDays.at(-1)?.date ?? null,
  };
}

export function getWeatherMood(
  weatherCode: number | null | undefined,
  city?: City,
): WeatherMood {
  const condition = getWeatherConditionFromCode(weatherCode);
  return getWeatherMoodCopy({
    city,
    condition,
    weatherCode: weatherCode ?? -1,
  });
}

export function parseDailyWeatherResponse(data: OpenMeteoDailyResponse): DailyWeather[] {
  const times = data.daily?.time;
  const weatherCodes = data.daily?.weather_code;

  if (!isStringArray(times) || !isNumberArray(weatherCodes)) {
    throw new Error("Unexpected Open-Meteo daily weather response");
  }

  if (times.length !== weatherCodes.length) {
    throw new Error("Open-Meteo daily weather response length mismatch");
  }

  return times.map((date, index) => ({
    date,
    weatherCode: weatherCodes[index],
  }));
}

function buildForecastUrl(city: City): string {
  const url = new URL(FORECAST_ENDPOINT);
  url.searchParams.set("latitude", String(city.latitude));
  url.searchParams.set("longitude", String(city.longitude));
  url.searchParams.set("daily", "weather_code");
  url.searchParams.set("timezone", "auto");
  url.searchParams.set("forecast_days", "1");

  return url.toString();
}

function buildArchiveUrl(city: City, startDate: string, endDate: string): string {
  const url = new URL(ARCHIVE_ENDPOINT);
  url.searchParams.set("latitude", String(city.latitude));
  url.searchParams.set("longitude", String(city.longitude));
  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", endDate);
  url.searchParams.set("daily", "weather_code");
  url.searchParams.set("timezone", "auto");

  return url.toString();
}

async function fetchDailyWeather(url: string): Promise<DailyWeather[]> {
  const response = await fetch(url, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Open-Meteo request failed with status ${response.status}`);
  }

  return parseDailyWeatherResponse((await response.json()) as OpenMeteoDailyResponse);
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === "number");
}

export { getWeatherConditionFromCode, isSunnyWeatherCode };
