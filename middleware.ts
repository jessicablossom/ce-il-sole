import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { DEFAULT_CITY_ID } from "@/lib/cities";
import { isRegisteredCityId } from "@/lib/isRegisteredCityId";

export const middleware = (request: NextRequest): NextResponse => {
  const redirect = request.nextUrl.clone();

  if (redirect.pathname !== "/") {
    return NextResponse.next();
  }

  const cityFromQuery = redirect.searchParams.get("city");

  if (cityFromQuery === null || cityFromQuery === "") {
    return NextResponse.next();
  }

  if (!isRegisteredCityId(cityFromQuery)) {
    return NextResponse.next();
  }

  if (cityFromQuery === DEFAULT_CITY_ID) {
    redirect.searchParams.delete("city");
    return NextResponse.redirect(redirect, 308);
  }

  redirect.pathname = `/${cityFromQuery}`;
  redirect.searchParams.delete("city");

  return NextResponse.redirect(redirect, 308);
};

export const config = {
  matcher: ["/"],
};
