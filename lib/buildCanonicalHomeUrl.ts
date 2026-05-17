import { getFirstQueryValue } from "./getFirstQueryValue";
import { getMetadataBaseOrigin } from "./siteOrigin";

export type HomeSearchParamsRecord = {
  city?: string | string[];
  meteoSegreto?: string | string[];
  preview?: string | string[];
};

export const buildCanonicalHomeUrl = (query: HomeSearchParamsRecord): string => {
  const baseOrigin = getMetadataBaseOrigin();
  const url = new URL("/", baseOrigin);
  const city = getFirstQueryValue(query.city);
  const preview = getFirstQueryValue(query.preview);
  const secret = getFirstQueryValue(query.meteoSegreto);

  if (city) {
    url.searchParams.set("city", city);
  }
  if (preview) {
    url.searchParams.set("preview", preview);
  }
  if (secret) {
    url.searchParams.set("meteoSegreto", secret);
  }

  return url.href;
};
