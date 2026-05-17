import type { HomeSearchParamsRecord } from "./homeUrlRecord";
import { buildCanonicalHomeUrlFromLegacyHomeRecord } from "./homeUrlRecord";

export type { HomeSearchParamsRecord };

export const buildCanonicalHomeUrl = (
  query: HomeSearchParamsRecord,
): string => buildCanonicalHomeUrlFromLegacyHomeRecord(query);
