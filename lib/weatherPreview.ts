const PREVIEW_WEATHER_CODES = {
  nebbia: 45,
  neve: 71,
  nuvole: 3,
  parzialmente: 2,
  pioggerella: 51,
  pioggia: 61,
  sole: 0,
  temporale: 95,
} as const satisfies Record<string, number>;

type PreviewWeatherName = keyof typeof PREVIEW_WEATHER_CODES;

const isPreviewWeatherName = (value: string | null): value is PreviewWeatherName =>
  value !== null && value in PREVIEW_WEATHER_CODES;

export const getPreviewWeatherCode = (previewParam: string | null): number | null =>
  isPreviewWeatherName(previewParam) ? PREVIEW_WEATHER_CODES[previewParam] : null;

export const isSunLiePreview = (previewParam: string | null): boolean =>
  previewParam === "sole";
