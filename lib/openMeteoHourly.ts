/**
 * Helpers for aligning Open‑Meteo hourly series (timezone‑local ISO strings without offset)
 * with the application's "now".
 */

export function getOpenMeteoLocalHourFloorIso(now: Date, timeZone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    month: "2-digit",
    timeZone,
    year: "numeric",
  }).formatToParts(now);

  const rawYear = parts.find((part) => part.type === "year")?.value;
  const rawMonth = parts.find((part) => part.type === "month")?.value;
  const rawDay = parts.find((part) => part.type === "day")?.value;
  const rawHour = parts.find((part) => part.type === "hour")?.value;

  if (!rawYear || !rawMonth || !rawDay || !rawHour) {
    throw new Error("Incomplete local time parts for Open‑Meteo hour alignment");
  }

  if (!/^(\d|\d\d)$/.test(rawMonth) || !/^(\d|\d\d)$/.test(rawDay) || !/^(\d|\d\d)$/.test(rawHour)) {
    throw new Error("Unexpected local numeric parts for Open‑Meteo hour alignment");
  }

  const year = rawYear.padStart(4, "0");
  const month = rawMonth.padStart(2, "0");
  const day = rawDay.padStart(2, "0");
  const hour = rawHour.padStart(2, "0");

  return `${year}-${month}-${day}T${hour}:00`;
}

export function resolveCurrentHourlyIndex(
  hourlyTimes: readonly string[],
  now: Date,
  timeZone: string,
): number | null {
  const floorHourIsoLocal = getOpenMeteoLocalHourFloorIso(now, timeZone);

  return findHourlySeriesIndex(hourlyTimes, floorHourIsoLocal);
}

export function findHourlySeriesIndex(
  hourlyTimes: readonly string[],
  floorHourIsoLocal: string,
): number | null {
  if (hourlyTimes.length === 0) {
    return null;
  }

  let lastAtOrBelow = -1;

  for (let index = 0; index < hourlyTimes.length; index++) {
    const slot = hourlyTimes[index];

    if (slot === undefined) {
      continue;
    }

    if (slot <= floorHourIsoLocal) {
      lastAtOrBelow = index;
    }
  }

  if (lastAtOrBelow !== -1) {
    return lastAtOrBelow;
  }

  const firstUpcomingIndex = hourlyTimes.findIndex((slot) => slot >= floorHourIsoLocal);

  if (firstUpcomingIndex !== -1) {
    return firstUpcomingIndex;
  }

  return 0;
}

type HourlyTriple = {
  isDayFlags: number[];
  times: string[];
  weatherCodes: number[];
};

export function parseOpenMeteoHourlyPayload(hourly: unknown): HourlyTriple | null {
  if (
    hourly === undefined ||
    typeof hourly !== "object" ||
    hourly === null ||
    Array.isArray(hourly)
  ) {
    return null;
  }

  const { time: timesRaw, weather_code: weatherCodesRaw, is_day: isDayRaw } = hourly as Record<
    string,
    unknown
  >;

  if (!isStringArray(timesRaw) || !isNumberArray(weatherCodesRaw) || !isNumberArray(isDayRaw)) {
    return null;
  }

  if (timesRaw.length !== weatherCodesRaw.length || timesRaw.length !== isDayRaw.length) {
    return null;
  }

  return {
    isDayFlags: isDayRaw,
    times: timesRaw,
    weatherCodes: weatherCodesRaw,
  };
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === "number");
}
