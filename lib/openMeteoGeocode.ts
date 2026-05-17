import axios from "axios";

const GEOCODING_SEARCH = "https://geocoding-api.open-meteo.com/v1/search";
const GEOCODING_GET = "https://geocoding-api.open-meteo.com/v1/get";
export const GEOCODE_REQUEST_TIMEOUT_MS = 8_000;
const ITALY_COUNTRY_CODE = "IT";

export type GeocodeSearchHit = {
  admin1?: string;
  country_code: string;
  id: number;
  latitude: number;
  longitude: number;
  name: string;
  timezone?: string;
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export const parseSearchHit = (value: unknown): GeocodeSearchHit | null => {
  if (value === undefined || typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  const row = value as Record<string, unknown>;

  const id = row.id;
  const latitude = row.latitude;
  const longitude = row.longitude;
  const name = row.name;

  if (!isFiniteNumber(id) || !isFiniteNumber(latitude) || !isFiniteNumber(longitude)) {
    return null;
  }

  if (typeof name !== "string" || name.trim() === "") {
    return null;
  }

  const country_code = typeof row.country_code === "string" ? row.country_code.toUpperCase() : "";

  if (country_code !== ITALY_COUNTRY_CODE) {
    return null;
  }

  return {
    id: Math.trunc(id),
    latitude,
    longitude,
    name,
    ...(typeof row.admin1 === "string" && row.admin1.length > 0 ? { admin1: row.admin1 } : {}),
    ...(typeof row.timezone === "string" && row.timezone.length > 0
      ? { timezone: row.timezone }
      : {}),
    country_code,
  };
};

export const parseGeocodeSearchEnvelope = (payload: unknown): readonly GeocodeSearchHit[] => {
  if (payload === undefined || typeof payload !== "object" || payload === null) {
    return [];
  }

  const record = payload as Record<string, unknown>;
  const rawResults = record.results;

  if (!Array.isArray(rawResults)) {
    return [];
  }

  return rawResults.flatMap((item) => {
    const hit = parseSearchHit(item);
    return hit ? [hit] : [];
  });
};

export const parseGeocodeGetEnvelope = (payload: unknown): GeocodeSearchHit | null => {
  const hit = parseSearchHit(payload);
  return hit;
};

export type GeocodeValidationErrorKind = "SEARCH_QUERY_LENGTH" | "GEO_ID_UNSUPPORTED";

export const normalizeGeocodeSearchQueryInput = (
  raw: string,
): { error: GeocodeValidationErrorKind } | { value: string } => {
  const trimmed = raw.trim();

  if (trimmed.length < 2 || trimmed.length > 96) {
    return { error: "SEARCH_QUERY_LENGTH" };
  }

  return { value: trimmed };
};

export const normalizeGeoIdParam = (
  raw: string | undefined | null,
): { error: GeocodeValidationErrorKind } | { value: string } => {
  if (raw === undefined || raw === null || raw.trim() === "") {
    return { error: "GEO_ID_UNSUPPORTED" };
  }

  const trimmed = raw.trim();

  if (!/^[1-9]\d+$/.test(trimmed) || trimmed.length > 14) {
    return { error: "GEO_ID_UNSUPPORTED" };
  }

  return { value: trimmed };
};

export async function fetchGeocodeSearchItalyServer(
  name: string,
  count: number,
): Promise<readonly GeocodeSearchHit[]> {
  const url = new URL(GEOCODING_SEARCH);
  url.searchParams.set("name", name);
  url.searchParams.set("countryCode", ITALY_COUNTRY_CODE);
  url.searchParams.set("language", "it");
  url.searchParams.set("count", String(Math.min(Math.max(count, 1), 40)));

  try {
    const { data } = await axios.get<unknown>(url.toString(), {
      timeout: GEOCODE_REQUEST_TIMEOUT_MS,
      validateStatus: (status) => status >= 200 && status < 500,
      responseType: "json",
      transitional: { clarifyTimeoutError: true },
    });

    return parseGeocodeSearchEnvelope(data);
  } catch {
    return [];
  }
}

export async function fetchGeocodeGetItalyByIdParam(
  idParam: string,
): Promise<GeocodeSearchHit | null> {
  const validated = normalizeGeoIdParam(idParam);

  if ("error" in validated) {
    return null;
  }

  const url = new URL(GEOCODING_GET);
  url.searchParams.set("id", validated.value);

  try {
    const { data } = await axios.get<unknown>(url.toString(), {
      timeout: GEOCODE_REQUEST_TIMEOUT_MS,
      validateStatus: (status) => status === 200,
      responseType: "json",
      transitional: { clarifyTimeoutError: true },
    });

    const hit = parseGeocodeGetEnvelope(data);

    if (hit === null) {
      return null;
    }

    if (hit.country_code !== ITALY_COUNTRY_CODE) {
      return null;
    }

    return hit;
  } catch {
    return null;
  }
}
