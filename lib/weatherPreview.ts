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

export function getPreviewWeatherCode(previewParam: string | null): number | null {
  return isPreviewWeatherName(previewParam) ? PREVIEW_WEATHER_CODES[previewParam] : null;
}

export function isSunLiePreview(previewParam: string | null): boolean {
  return previewParam === "sole";
}

function isPreviewWeatherName(value: string | null): value is PreviewWeatherName {
  return value !== null && value in PREVIEW_WEATHER_CODES;
}
