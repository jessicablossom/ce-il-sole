import type { WeatherCondition } from "@/types/weather";
import {
  getWeatherConditionFromCode,
  isNegativeWeatherCondition,
} from "./weatherCodes";

function isBrightSky(condition: WeatherCondition): boolean {
  return condition === "sunny" || condition === "partly-cloudy";
}

/**
 * One-line ironic note when the outlook for the following hour differs.
 */
export function getNextHourOutlookNote(currentCode: number, nextCode: number): string | null {
  if (!Number.isFinite(currentCode) || !Number.isFinite(nextCode)) {
    return null;
  }

  const current = getWeatherConditionFromCode(currentCode);
  const next = getWeatherConditionFromCode(nextCode);

  if (current === next) {
    return null;
  }

  const brightNow = isBrightSky(current);
  const brightNext = isBrightSky(next);
  const roughNext = isNegativeWeatherCondition(next);

  if (brightNow && roughNext) {
    return "Tra un’ora peggiora. Il cielo non sorprende quasi mai.";
  }

  if (brightNow && !brightNext) {
    return "Tra un’ora il cielo pare meno illuminista.";
  }

  if (!brightNow && roughNext && !isNegativeWeatherCondition(current)) {
    return "Tra un’ora arriva anche la parte drammatica.";
  }

  if (!brightNow && brightNext && !roughNext) {
    return "Tra un’ora c’è un barlume. Restiamo scettici comunque.";
  }

  return "Tra un’ora si aggiornano le previsioni. E l’umorismo.";
}
