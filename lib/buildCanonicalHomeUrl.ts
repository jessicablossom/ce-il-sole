import type { HomeSearchParamsRecord } from "./homeUrlRecord";
import { buildCanonicalHomeUrlFromRecord } from "./homeUrlRecord";

export type { HomeSearchParamsRecord };

export const buildCanonicalHomeUrl = (
  query: HomeSearchParamsRecord,
): string => buildCanonicalHomeUrlFromRecord(query);
