import type { DayPeriod } from "@/types/dayPeriod";

export const CENTRAL_EUROPEAN_TIME_ZONE = "Europe/Rome";
export const NIGHT_START_HOUR = 20;
export const NIGHT_END_HOUR = 6;

export function getDayPeriodInCentralEurope(date: Date): DayPeriod {
  return isNightInCentralEurope(date) ? "night" : "day";
}

export function isNightInCentralEurope(date: Date): boolean {
  const hour = getHourInTimeZone(date, CENTRAL_EUROPEAN_TIME_ZONE);

  return hour >= NIGHT_START_HOUR || hour < NIGHT_END_HOUR;
}

function getHourInTimeZone(date: Date, timeZone: string): number {
  const hour = new Intl.DateTimeFormat("it-IT", {
    hour: "2-digit",
    hour12: false,
    timeZone,
  }).format(date);

  return Number(hour);
}
