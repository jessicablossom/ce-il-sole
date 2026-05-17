import type { Metadata } from "next";
import { buildCanonicalHomeUrl } from "@/lib/buildCanonicalHomeUrl";
import { canonicalHomeRecord } from "@/lib/homeUrlRecord";
import { getCityById } from "@/lib/cities";
import { resolveRawHomeCityId } from "@/lib/resolveHomeCityId";

type HomeSlice = {
  city?: string | string[];
  meteoSegreto?: string | string[];
  preview?: string | string[];
};

export const buildHomeAlternateMetadata = async ({
  searchParamsPromise,
  pathSlug,
}: {
  searchParamsPromise: Promise<HomeSlice>;
  pathSlug?: string | undefined;
}): Promise<Pick<Metadata, "alternates" | "openGraph">> => {
  const query = await searchParamsPromise;
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
