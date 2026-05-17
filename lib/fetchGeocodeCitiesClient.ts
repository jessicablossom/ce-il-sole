import { readGeocodeCitiesPayload } from "@/lib/readGeocodeCitiesPayload";
import type { City } from "@/types/weather";

export const GEOCODE_CLIENT_API_PATH = "/api/geocode";

export async function fetchGeocodeCitiesClient(
  query: string,
  init?: { signal?: AbortSignal },
): Promise<readonly City[] | null> {
  const response = await fetch(
    `${GEOCODE_CLIENT_API_PATH}?q=${encodeURIComponent(query.trim())}`,
    { signal: init?.signal },
  );

  const bodyUnknown: unknown = await response.json();

  if (!response.ok) {
    return null;
  }

  return readGeocodeCitiesPayload(bodyUnknown);
}
