import {
  type HomeSearchParamsRecord,
  serializeHomeRelativeUrlPath,
} from "@/lib/homeUrlRecord";
import {
  buildRelativePlaceHref,
  type PlaceNavigationRecord,
} from "@/lib/placeNavigation";

export type { HomeSearchParamsRecord };
export type { PlaceNavigationRecord };

export const buildRelativeHomeHref = (
  record: HomeSearchParamsRecord | PlaceNavigationRecord,
): string => {
  if ("variant" in record) {
    return buildRelativePlaceHref(record);
  }

  return serializeHomeRelativeUrlPath(record);
};
