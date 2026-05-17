import { type HomeSearchParamsRecord, serializeHomeRelativeUrlPath } from "./homeUrlRecord";

export const buildRelativeHomeHref = (record: HomeSearchParamsRecord): string =>
  serializeHomeRelativeUrlPath(record);

export type { HomeSearchParamsRecord };
