import type { City } from "@/types/weather";

export function filterCitiesByQuery(cities: readonly City[], query: string): readonly City[] {
  const normalizedQuery = normalizeCityName(query.trim());

  if (normalizedQuery.length === 0) {
    return cities;
  }

  return cities.filter((city) => normalizeCityName(city.name).startsWith(normalizedQuery));
}

export function getNextActiveCityId({
  activeCityId,
  cities,
  direction,
}: {
  activeCityId: string | null;
  cities: readonly City[];
  direction: "next" | "previous";
}): string | null {
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
}

export function normalizeCityName(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}
