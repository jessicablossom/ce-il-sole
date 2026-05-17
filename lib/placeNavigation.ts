import { DEFAULT_CITY_ID } from "./cities";
import { getFirstQueryValue } from "./getFirstQueryValue";
import { getMetadataBaseOrigin } from "./siteOrigin";

export const isLikelyGeoNumericCityId = (value: string): boolean => /^[1-9]\d+$/.test(value.trim());

export type PreviewSliceInput = {
  meteoSegreto?: string | string[];
  preview?: string | string[];
};

export type PlaceNavigationCatalog = PreviewSliceInput & {
  variant: "catalog";
  catalogCityId: string;
};

export type PlaceNavigationGeo = PreviewSliceInput & {
  variant: "geo";
  geoNumericId: string;
};

export type PlaceNavigationRecord =
  | PlaceNavigationCatalog
  | PlaceNavigationGeo;

const appendPreviewToSearchParams = (
  params: URLSearchParams,
  record: PreviewSliceInput,
): void => {
  const preview =
    typeof record.preview === "undefined" ? undefined : getFirstQueryValue(record.preview);
  const secret =
    typeof record.meteoSegreto === "undefined"
      ? undefined
      : getFirstQueryValue(record.meteoSegreto);

  if (preview != null && preview.length > 0) {
    params.set("preview", preview);
  }

  if (secret != null && secret.length > 0) {
    params.set("meteoSegreto", secret);
  }
};

export const serializePlaceNavigationPath = (record: PlaceNavigationRecord): string => {
  const searchParams = new URLSearchParams();

  appendPreviewToSearchParams(searchParams, record);

  let pathname: string;

  if (record.variant === "catalog") {
    const id = record.catalogCityId.trim();
    pathname = id !== "" && id !== DEFAULT_CITY_ID ? `/${encodeURIComponent(id)}` : "/";
  } else {
    pathname = `/g/${encodeURIComponent(record.geoNumericId.trim())}`;
  }

  const querySuffix = searchParams.toString();

  return querySuffix.length > 0 ? `${pathname}?${querySuffix}` : pathname;
};

export const buildRelativePlaceHref = (record: PlaceNavigationRecord): string =>
  serializePlaceNavigationPath(record);

export const buildCanonicalNavigationUrlFromRecord = (
  record: PlaceNavigationRecord,
): string => {
  const relative = serializePlaceNavigationPath(record);
  return new URL(relative, getMetadataBaseOrigin()).href;
};

export const buildNavigationFromResolvedCityIdAndPreviewInputs = ({
  preview,
  meteoSegreto,
  resolvedCityOrGeoStringId,
}: PreviewSliceInput & {
  resolvedCityOrGeoStringId: string;
}): PlaceNavigationRecord => {
  if (isLikelyGeoNumericCityId(resolvedCityOrGeoStringId)) {
    return {
      variant: "geo",
      geoNumericId: resolvedCityOrGeoStringId.trim(),
      ...(preview !== undefined ? { preview } : {}),
      ...(meteoSegreto !== undefined ? { meteoSegreto } : {}),
    };
  }

  return {
    variant: "catalog",
    catalogCityId: resolvedCityOrGeoStringId,
    ...(preview !== undefined ? { preview } : {}),
    ...(meteoSegreto !== undefined ? { meteoSegreto } : {}),
  };
};
