import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { HomePage } from "@/components/HomePage";
import { DEFAULT_CITY_ID } from "@/lib/cities";
import { buildRelativeHomeHref } from "@/lib/buildHomeHref";
import { canonicalHomeRecord } from "@/lib/homeUrlRecord";
import { buildHomeAlternateMetadata } from "@/lib/generateHomeMetadata";
import { isRegisteredCityId } from "@/lib/isRegisteredCityId";

type CitySlugPageProps = {
  params: Promise<{ citySlug: string }>;
  searchParams: Promise<{
    city?: string | string[];
    meteoSegreto?: string | string[];
    preview?: string | string[];
  }>;
};

export const generateMetadata = async ({
  params,
  searchParams,
}: CitySlugPageProps): Promise<Metadata> => {
  const { citySlug } = await params;

  if (!isRegisteredCityId(citySlug)) {
    return {};
  }

  return buildHomeAlternateMetadata({
    searchParamsPromise: searchParams,
    pathSlug: citySlug,
  });
};

const CitySlugPage = async ({ params, searchParams }: CitySlugPageProps) => {
  const [{ citySlug }, query] = await Promise.all([params, searchParams]);

  if (!isRegisteredCityId(citySlug)) {
    notFound();
  }

  if (citySlug === DEFAULT_CITY_ID) {
    permanentRedirect(
      buildRelativeHomeHref(
        canonicalHomeRecord({
          resolvedCityId: DEFAULT_CITY_ID,
          preview: query.preview,
          meteoSegreto: query.meteoSegreto,
        }),
      ),
    );
  }

  return <HomePage pathCitySlug={citySlug} searchParams={searchParams} />;
};

export default CitySlugPage;
