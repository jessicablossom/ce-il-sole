import { NextResponse, type NextRequest } from "next/server";
import { geocodeSearchHitToCity } from "@/lib/geocodeHitToCity";
import type { GeocodeValidationErrorKind } from "@/lib/openMeteoGeocode";
import {
  fetchGeocodeSearchItalyServer,
  normalizeGeocodeSearchQueryInput,
} from "@/lib/openMeteoGeocode";
import type { City } from "@/types/weather";

type OkBody = {
  cities: readonly City[];
};

type ErrorBody = {
  error: GeocodeValidationErrorKind;
};

export async function GET(request: NextRequest): Promise<NextResponse<OkBody | ErrorBody>> {
  const rawQuery = request.nextUrl.searchParams.get("q");

  if (rawQuery === null) {
    return NextResponse.json(
      { error: "SEARCH_QUERY_LENGTH" satisfies GeocodeValidationErrorKind },
      { status: 400 },
    );
  }

  const validated = normalizeGeocodeSearchQueryInput(rawQuery);

  if ("error" in validated) {
    return NextResponse.json({ error: validated.error }, { status: 400 });
  }

  const hits = await fetchGeocodeSearchItalyServer(validated.value, 24);
  const cities = hits.map(geocodeSearchHitToCity);

  return NextResponse.json({ cities }, { status: 200 });
}
