import { describe, expect, it } from "vitest";
import { getPreviewWeatherCode, isSunLiePreview } from "../lib/weatherPreview";

describe("weather preview utilities", () => {
  it("maps preview names to representative WMO codes", () => {
    expect(getPreviewWeatherCode("sole")).toBe(0);
    expect(getPreviewWeatherCode("parzialmente")).toBe(2);
    expect(getPreviewWeatherCode("nuvole")).toBe(3);
    expect(getPreviewWeatherCode("nebbia")).toBe(45);
    expect(getPreviewWeatherCode("pioggerella")).toBe(51);
    expect(getPreviewWeatherCode("pioggia")).toBe(61);
    expect(getPreviewWeatherCode("neve")).toBe(71);
    expect(getPreviewWeatherCode("temporale")).toBe(95);
    expect(getPreviewWeatherCode("dramma")).toBeNull();
  });

  it("detects the CTA sun lie preview", () => {
    expect(isSunLiePreview("sole")).toBe(true);
    expect(isSunLiePreview("pioggia")).toBe(false);
    expect(isSunLiePreview(null)).toBe(false);
  });
});
