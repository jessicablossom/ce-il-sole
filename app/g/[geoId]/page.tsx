import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage } from "@/components/HomePage";
import { buildHomeAlternateMetadata } from "@/lib/generateHomeMetadata";
import { normalizeGeoIdParam } from "@/lib/openMeteoGeocode";

type GeoIdPageProps = {
  params: Promise<{ geoId: string }>;
  searchParams: Promise<{
    meteoSegreto?: string | string[];
    preview?: string | string[];
  }>;
};

export const generateMetadata = async ({
  params,
  searchParams,
}: GeoIdPageProps): Promise<Metadata> => {
  const { geoId } = await params;
  const validatedId = normalizeGeoIdParam(geoId);

  if ("error" in validatedId) {
    return {};
  }

  return buildHomeAlternateMetadata({
    searchParamsPromise: searchParams,
    geoNumericId: validatedId.value,
  });
};

const GeoIdPage = async ({ params, searchParams }: GeoIdPageProps) => {
  const { geoId } = await params;
  const validatedId = normalizeGeoIdParam(geoId);

  if ("error" in validatedId) {
    notFound();
  }

  return (
    <HomePage
      geoNumericId={validatedId.value}
      searchParams={searchParams}
    />
  );
};

export default GeoIdPage;
