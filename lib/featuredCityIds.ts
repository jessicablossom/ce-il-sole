import type { City } from "@/types/weather";
import { CITIES, type CityId } from "./cities";

export const FEATURED_CITY_IDS = [
  "bologna",
  "milano",
  "roma",
  "napoli",
  "firenze",
] as const satisfies readonly CityId[];

export const resolveFeaturedCities = (): readonly City[] => {
  const resolved: City[] = [];

  for (const id of FEATURED_CITY_IDS) {
    const city = CITIES.find((candidate) => candidate.id === id);

    if (city !== undefined) {
      resolved.push(city);
    }
  }

  return resolved;
};
