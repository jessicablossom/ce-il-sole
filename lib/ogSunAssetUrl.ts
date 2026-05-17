import { getMetadataBaseOrigin } from "./siteOrigin";

/** Twemoji “bright sun” (U+2600) raster, vendored as `public/og-sun.png` for Satori. */
export const OG_SUN_ASSET_PATH = "/og-sun.png" as const;

export const getOgSunPngAbsoluteUrl = (): string =>
  `${getMetadataBaseOrigin()}${OG_SUN_ASSET_PATH}`;
