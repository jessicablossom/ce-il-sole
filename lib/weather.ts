import axios, { isAxiosError } from "axios";
import type {
  City,
  DailyWeather,
  HourWeatherSnapshot,
  WeatherMood,
  WeatherReport,
} from "@/types/weather";
import { tallyArchiveSansSole } from "./archiveWithoutSun";
import {
  parseOpenMeteoHourlyPayload,
  resolveCurrentHourlyIndex,
} from "./openMeteoHourly";
import { getWeatherConditionFromCode, isSunnyWeatherCode } from "./weatherCodes";
import { getWeatherMoodCopy } from "./weatherCopy";
import { addDaysToIsoDate, getIsoDateInTimeZone, getYearStartIsoDate } from "./utils";

const FORECAST_ENDPOINT = "https://api.open-meteo.com/v1/forecast";
const ARCHIVE_ENDPOINT = "https://archive-api.open-meteo.com/v1/archive";
const ARCHIVE_DATA_DELAY_DAYS = 5;
const FORECAST_DAYS_WINDOW = 3;

type OpenMeteoDailyEnvelope = {
  daily?: {
    time?: unknown;
    weather_code?: unknown;
  };
};

const isStringArray = (value: unknown): value is string[] =>
  Array.isArray(value) && value.every((item) => typeof item === "string");

const isNumberArray = (value: unknown): value is number[] =>
  Array.isArray(value) && value.every((item) => typeof item === "number");

const parseForecastEnvelope = (
  data: unknown,
): OpenMeteoDailyEnvelope & { hourly?: unknown } => {
  if (data === undefined || typeof data !== "object" || data === null || Array.isArray(data)) {
    throw new Error("Unexpected Open‑Meteo forecast payload");
  }

  return data as OpenMeteoDailyEnvelope & { hourly?: unknown };
};

const buildForecastUrl = (city: City): string => {
  const url = new URL(FORECAST_ENDPOINT);
  url.searchParams.set("latitude", String(city.latitude));
  url.searchParams.set("longitude", String(city.longitude));
  url.searchParams.set("timezone", city.timeZone);
  url.searchParams.set("forecast_days", String(FORECAST_DAYS_WINDOW));
  url.searchParams.set("daily", "weather_code");
  url.searchParams.set("hourly", "weather_code,is_day");

  return url.toString();
};

const buildArchiveUrl = (city: City, startDate: string, endDate: string): string => {
  const url = new URL(ARCHIVE_ENDPOINT);
  url.searchParams.set("latitude", String(city.latitude));
  url.searchParams.set("longitude", String(city.longitude));
  url.searchParams.set("start_date", startDate);
  url.searchParams.set("end_date", endDate);
  url.searchParams.set("daily", "weather_code");
  url.searchParams.set("timezone", city.timeZone);

  return url.toString();
};

type HourlyTripleNonNull = NonNullable<ReturnType<typeof parseOpenMeteoHourlyPayload>>;

const buildHourWeatherSnapshot = (
  triple: HourlyTripleNonNull,
  index: number,
): HourWeatherSnapshot | null => {
  const time = triple.times[index];
  const weatherCode = triple.weatherCodes[index];
  const isDayRaw = triple.isDayFlags[index];

  if (time === undefined || weatherCode === undefined || isDayRaw === undefined) {
    return null;
  }

  const isDay: HourWeatherSnapshot["isDay"] = isDayRaw === 1 ? 1 : 0;

  return { isDay, time, weatherCode };
};

export const parseDailyWeatherResponse = (data: OpenMeteoDailyEnvelope): DailyWeather[] => {
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
    weatherCode: weatherCodes[index] as number,
  }));
};

const fetchDailyWeather = async (url: string): Promise<DailyWeather[]> => {
  try {
    const response = await axios.get<OpenMeteoDailyEnvelope>(url);
    return parseDailyWeatherResponse(response.data);
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(`Open-Meteo request failed with status ${error.response.status}`);
    }

    throw error;
  }
};

const fetchForecastPayload = async (
  city: City,
  now: Date,
): Promise<{
  currentHour: HourWeatherSnapshot | null;
  nextHour: HourWeatherSnapshot | null;
  today: DailyWeather | null;
}> => {
  let responseBody: unknown;

  try {
    const response = await axios.get<unknown>(buildForecastUrl(city));
    responseBody = response.data;
  } catch (error) {
    if (isAxiosError(error) && error.response) {
      throw new Error(`Open-Meteo request failed with status ${error.response.status}`);
    }

    throw error;
  }

  const payload = parseForecastEnvelope(responseBody);
  const todayIsoDate = getIsoDateInTimeZone(now, city.timeZone);
  const forecastDays = parseDailyWeatherResponse(payload);

  const today =
    forecastDays.find((day) => day.date === todayIsoDate) ?? forecastDays[0] ?? null;

  const triple = parseOpenMeteoHourlyPayload(payload.hourly);
  let currentHour: HourWeatherSnapshot | null = null;
  let nextHour: HourWeatherSnapshot | null = null;

  if (triple) {
    const index = resolveCurrentHourlyIndex(triple.times, now, city.timeZone);

    if (index !== null) {
      currentHour = buildHourWeatherSnapshot(triple, index);
      nextHour =
        index + 1 < triple.times.length ? buildHourWeatherSnapshot(triple, index + 1) : null;
    }
  }

  return { currentHour, nextHour, today };
};

export const getWeatherReport = async (
  city: City,
  now = new Date(),
): Promise<WeatherReport> => {
  const todayIsoDate = getIsoDateInTimeZone(now, city.timeZone);
  const yearStartIsoDate = getYearStartIsoDate(todayIsoDate);
  const archiveEndIsoDate = addDaysToIsoDate(todayIsoDate, -ARCHIVE_DATA_DELAY_DAYS);

  const [forecast, archiveDays] = await Promise.all([
    fetchForecastPayload(city, now),
    archiveEndIsoDate >= yearStartIsoDate
      ? fetchDailyWeather(buildArchiveUrl(city, yearStartIsoDate, archiveEndIsoDate))
      : Promise.resolve([]),
  ]);

  const sunnyArchiveDays = archiveDays.filter((day) => isSunnyWeatherCode(day.weatherCode));

  if (process.env.NODE_ENV !== "production") {
    console.log(
      `[ce-il-sole] giorni di sole (archive WMO 0–1): ${city.name} · intervallo ${yearStartIsoDate} → ${archiveEndIsoDate} · conteggio ${sunnyArchiveDays.length}`,
      sunnyArchiveDays.map((day) => ({ data: day.date, codice: day.weatherCode })),
    );
  }

  return {
    city,
    currentHour: forecast.currentHour,
    nextHour: forecast.nextHour,
    sansSoleBucketsThisYear: tallyArchiveSansSole(archiveDays),
    today: forecast.today,
    sunnyDaysThisYear: sunnyArchiveDays.length,
    lastSunnyDay: sunnyArchiveDays.at(-1)?.date ?? null,
  };
};

export const getWeatherMood = (
  weatherCode: number | null | undefined,
  city?: City,
): WeatherMood => {
  const condition = getWeatherConditionFromCode(weatherCode);

  return getWeatherMoodCopy({
    city,
    condition,
    weatherCode: weatherCode ?? -1,
  });
};

export { getWeatherConditionFromCode, isSunnyWeatherCode };
