import { DEFAULT_CITY_ID } from "./cities";
import { getFirstQueryValue } from "./getFirstQueryValue";
import { getMetadataBaseOrigin } from "./siteOrigin";

export type HomeSearchParamsRecord = {
  city?: string | string[];
  meteoSegreto?: string | string[];
  preview?: string | string[];
};

export const toCanonicalCityParam = (
  resolvedCityId: string,
): string | undefined =>
  resolvedCityId !== DEFAULT_CITY_ID ? resolvedCityId : undefined;

export const canonicalHomeRecord = (input: {
  resolvedCityId: string;
  preview?: string | string[];
  meteoSegreto?: string | string[];
}): HomeSearchParamsRecord => {
  const city = toCanonicalCityParam(input.resolvedCityId);

  const record: HomeSearchParamsRecord = {
    ...(city !== undefined ? { city } : {}),
    ...(input.preview !== undefined ? { preview: input.preview } : {}),
    ...(input.meteoSegreto !== undefined ? { meteoSegreto: input.meteoSegreto } : {}),
  };

  return record;
};

export const serializeHomeRelativeUrlPath = (record: HomeSearchParamsRecord): string => {
  const cityRaw = pickOptionalCity(record);
  const citySegment =
    cityRaw === null || cityRaw === DEFAULT_CITY_ID ? undefined : cityRaw;

  const path = citySegment !== undefined ? `/${encodeURIComponent(citySegment)}` : "/";
  const preview =
    typeof record.preview === "undefined" ? undefined : getFirstQueryValue(record.preview);
  const secret =
    typeof record.meteoSegreto === "undefined"
      ? undefined
      : getFirstQueryValue(record.meteoSegreto);

  const search = new URLSearchParams();
  if (preview != null && preview.length > 0) {
    search.set("preview", preview);
  }
  if (secret != null && secret.length > 0) {
    search.set("meteoSegreto", secret);
  }

  const query = search.toString();
  return query.length > 0 ? `${path}?${query}` : path;
};

/** Canonical assoluto: slug catalogo eccetto Bologna (`/`). Solo record legacy `/?.`. */
export const buildCanonicalHomeUrlFromLegacyHomeRecord = (
  record: HomeSearchParamsRecord,
): string => {
  const relative = serializeHomeRelativeUrlPath(record);
  return new URL(relative, getMetadataBaseOrigin()).href;
};

const pickOptionalCity = (
  query: Pick<HomeSearchParamsRecord, "city">,
): string | null => getFirstQueryValue(query.city);
