import { DEFAULT_CITY_ID } from "./cities";
import { getFirstQueryValue } from "./getFirstQueryValue";

export const resolveRawHomeCityId = (input: {
  cityFromPath?: string | null;
  rawSearchCity?: string | string[] | undefined;
}): string =>
  typeof input.cityFromPath === "string"
    ? input.cityFromPath
    : getFirstQueryValue(input.rawSearchCity) ?? DEFAULT_CITY_ID;
