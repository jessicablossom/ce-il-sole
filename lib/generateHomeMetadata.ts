import type { Metadata } from "next";
import { buildCanonicalHomeUrl } from "@/lib/buildCanonicalHomeUrl";
import { getCityById } from "@/lib/cities";
import { canonicalHomeRecord } from "@/lib/homeUrlRecord";
import { normalizeGeoIdParam } from "@/lib/openMeteoGeocode";
import { buildCanonicalNavigationUrlFromRecord } from "@/lib/placeNavigation";
import { resolveRawHomeCityId } from "@/lib/resolveHomeCityId";

type HomeSlice = {
  city?: string | string[];
  meteoSegreto?: string | string[];
  preview?: string | string[];
};

export const buildHomeAlternateMetadata = async ({
  searchParamsPromise,
  pathSlug,
  geoNumericId,
}: {
  searchParamsPromise: Promise<HomeSlice>;
  pathSlug?: string | undefined;
  geoNumericId?: string | undefined;
}): Promise<Pick<Metadata, "alternates" | "openGraph">> => {
  const query = await searchParamsPromise;

  if (typeof geoNumericId === "string" && geoNumericId.trim().length > 0) {
    const validated = normalizeGeoIdParam(geoNumericId);

    if ("error" in validated) {
      return {};
    }

    const canonical = buildCanonicalNavigationUrlFromRecord({
      variant: "geo",
      geoNumericId: validated.value,
      preview: query.preview,
      meteoSegreto: query.meteoSegreto,
    });

    return {
      alternates: { canonical },
      openGraph: { url: canonical },
    };
  }

  const resolvedCityId = resolveRawHomeCityId({
    cityFromPath: pathSlug,
    rawSearchCity: query.city,
  });
  const city = getCityById(resolvedCityId);

  const canonical = buildCanonicalHomeUrl(
    canonicalHomeRecord({
      resolvedCityId: city.id,
      preview: query.preview,
      meteoSegreto: query.meteoSegreto,
    }),
  );

  return {
    alternates: { canonical },
    openGraph: { url: canonical },
  };
};
