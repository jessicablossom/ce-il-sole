import { describe, expect, it } from "vitest";
import { getWeatherIconForCondition } from "../lib/weatherIcons";

describe("weather icon utilities", () => {
  it("maps weather conditions to favicon-ready emoji", () => {
    expect(getWeatherIconForCondition("sunny")).toBe("☀️");
    expect(getWeatherIconForCondition("partly-cloudy")).toBe("🌤️");
    expect(getWeatherIconForCondition("cloudy")).toBe("☁️");
    expect(getWeatherIconForCondition("foggy")).toBe("☁️");
    expect(getWeatherIconForCondition("drizzle")).toBe("🌧️");
    expect(getWeatherIconForCondition("rainy")).toBe("🌧️");
    expect(getWeatherIconForCondition("snowy")).toBe("❄️");
    expect(getWeatherIconForCondition("stormy")).toBe("⛈️");
    expect(getWeatherIconForCondition("unknown")).toBe("☁️");
  });
});
