import { buildRelativeHomeHref } from "./buildHomeHref";
import { buildNavigationFromResolvedCityIdAndPreviewInputs } from "./placeNavigation";

export type HomeNavigationHrefInput = {
  resolvedCityOrGeoStringId: string;
  preview?: string | string[];
  meteoSegreto?: string | string[];
};

export const buildHomeNavigationHrefFromCityId = ({
  resolvedCityOrGeoStringId,
  preview,
  meteoSegreto,
}: HomeNavigationHrefInput): string =>
  buildRelativeHomeHref(
    buildNavigationFromResolvedCityIdAndPreviewInputs({
      resolvedCityOrGeoStringId,
      ...(preview !== undefined ? { preview } : {}),
      ...(meteoSegreto !== undefined ? { meteoSegreto } : {}),
    }),
  );
