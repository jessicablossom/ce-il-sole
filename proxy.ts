import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { DEFAULT_CITY_ID } from "@/lib/cities";
import { isRegisteredCityId } from "@/lib/isRegisteredCityId";
import { isLikelyGeoNumericCityId } from "@/lib/placeNavigation";

export default function proxy(request: NextRequest): NextResponse {
  const redirect = request.nextUrl.clone();

  if (redirect.pathname !== "/") {
    return NextResponse.next();
  }

  const cityFromQuery = redirect.searchParams.get("city");

  if (cityFromQuery === null || cityFromQuery === "") {
    return NextResponse.next();
  }

  const trimmedCityFromQuery = cityFromQuery.trim();

  if (isLikelyGeoNumericCityId(trimmedCityFromQuery)) {
    redirect.pathname = `/g/${encodeURIComponent(trimmedCityFromQuery)}`;
    redirect.searchParams.delete("city");

    return NextResponse.redirect(redirect, 308);
  }

  if (!isRegisteredCityId(trimmedCityFromQuery)) {
    return NextResponse.next();
  }

  if (trimmedCityFromQuery === DEFAULT_CITY_ID) {
    redirect.searchParams.delete("city");
    return NextResponse.redirect(redirect, 308);
  }

  redirect.pathname = `/${encodeURIComponent(trimmedCityFromQuery)}`;
  redirect.searchParams.delete("city");

  return NextResponse.redirect(redirect, 308);
}
