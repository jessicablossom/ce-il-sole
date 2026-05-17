import type { ArchiveWithoutSunBuckets, DailyWeather } from "@/types/weather";
import { getWeatherConditionFromCode } from "./weatherCodes";

/** Counts archived days grouped as “without sun”. Sunny days are excluded; each archived day increments exactly one bucket. */
export const tallyArchiveSansSole = (
  days: readonly DailyWeather[],
): ArchiveWithoutSunBuckets => {
  let partlyCloudy = 0;
  let overcast = 0;
  let fog = 0;
  let precipitation = 0;
  let snow = 0;

  for (const row of days) {
    switch (getWeatherConditionFromCode(row.weatherCode)) {
      case "cloudy":
      case "unknown":
        overcast++;
        break;
      case "drizzle":
      case "rainy":
      case "stormy":
        precipitation++;
        break;
      case "foggy":
        fog++;
        break;
      case "partly-cloudy":
        partlyCloudy++;
        break;
      case "snowy":
        snow++;
        break;
      case "sunny":
        break;
    }
  }

  return { fog, overcast, partlyCloudy, precipitation, snow };
};

export const totalSansSoleDays = (buckets: ArchiveWithoutSunBuckets): number =>
  buckets.partlyCloudy + buckets.overcast + buckets.fog + buckets.precipitation + buckets.snow;
