import type { City } from "@/types/weather";
import { resolveFeaturedCities } from "./featuredCityIds";

export const normalizeCityName = (value: string): string =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();

const sortCitiesItalian = (list: readonly City[]): City[] =>
  [...list].sort((left, right) => left.name.localeCompare(right.name, "it"));

export const filterCitiesByQuery = (
  cities: readonly City[],
  query: string,
): readonly City[] => {
  const normalizedQuery = normalizeCityName(query.trim());

  if (normalizedQuery.length === 0) {
    return cities;
  }

  return cities.filter((city) => normalizeCityName(city.name).startsWith(normalizedQuery));
};

export type SelectorCityBuckets = {
  pinned: readonly City[];
  rest: readonly City[];
};

/**
 * Liste per il combobox: le città in evidenza sempre per prime (ordine alfabetico nome),
 * poi il resto filtrato e alfabetizzato. Query vuota → tutto il catalogo dopo i pin.
 */
export const bucketCitiesForSelector = (
  cities: readonly City[],
  query: string,
): SelectorCityBuckets => {
  const featuredSorted = sortCitiesItalian(resolveFeaturedCities());
  const featuredIds = new Set(featuredSorted.map((city) => city.id));
  const normalizedQuery = normalizeCityName(query.trim());

  if (normalizedQuery.length === 0) {
    const restSorted = sortCitiesItalian(cities.filter((city) => !featuredIds.has(city.id)));

    return { pinned: featuredSorted, rest: restSorted };
  }

  const pinnedMatches = featuredSorted.filter((city) =>
    normalizeCityName(city.name).startsWith(normalizedQuery),
  );

  const restMatches = sortCitiesItalian(
    cities.filter(
      (city) =>
        !featuredIds.has(city.id) && normalizeCityName(city.name).startsWith(normalizedQuery),
    ),
  );

  return { pinned: pinnedMatches, rest: restMatches };
};

export const getNextActiveCityId = ({
  activeCityId,
  cities,
  direction,
}: {
  activeCityId: string | null;
  cities: readonly City[];
  direction: "next" | "previous";
}): string | null => {
  if (cities.length === 0) {
    return null;
  }

  const currentIndex = cities.findIndex((city) => city.id === activeCityId);

  if (currentIndex === -1) {
    return direction === "next" ? cities[0].id : cities[cities.length - 1].id;
  }

  const offset = direction === "next" ? 1 : -1;
  const nextIndex = (currentIndex + offset + cities.length) % cities.length;

  return cities[nextIndex].id;
};
