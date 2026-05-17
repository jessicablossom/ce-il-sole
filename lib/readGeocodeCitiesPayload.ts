import type { City } from "@/types/weather";

export const readGeocodeCitiesPayload = (value: unknown): readonly City[] | null => {
  if (typeof value !== "object" || value === null || !("cities" in value)) {
    return null;
  }

  const wrapped = value as { cities?: unknown };

  return Array.isArray(wrapped.cities) ? (wrapped.cities as City[]) : null;
};
