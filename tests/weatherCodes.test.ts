import { describe, expect, it } from "vitest";
import {
  getWeatherConditionFromCode,
  isNegativeWeatherCondition,
  isSunnyWeatherCode,
} from "../lib/weatherCodes";

describe("weather code utilities", () => {
  it("maps WMO groups to app weather conditions", () => {
    expect(getWeatherConditionFromCode(0)).toBe("sunny");
    expect(getWeatherConditionFromCode(3)).toBe("cloudy");
    expect(getWeatherConditionFromCode(45)).toBe("foggy");
    expect(getWeatherConditionFromCode(51)).toBe("drizzle");
    expect(getWeatherConditionFromCode(61)).toBe("rainy");
    expect(getWeatherConditionFromCode(71)).toBe("snowy");
    expect(getWeatherConditionFromCode(95)).toBe("stormy");
    expect(getWeatherConditionFromCode(undefined)).toBe("unknown");
  });

  it("keeps sunny strict for annual sunny-day statistics", () => {
    expect(isSunnyWeatherCode(0)).toBe(true);
    expect(isSunnyWeatherCode(1)).toBe(true);
    expect(isSunnyWeatherCode(2)).toBe(false);
  });

  it("identifies conditions that are definitely not sun", () => {
    expect(isNegativeWeatherCondition("drizzle")).toBe(true);
    expect(isNegativeWeatherCondition("rainy")).toBe(true);
    expect(isNegativeWeatherCondition("snowy")).toBe(true);
    expect(isNegativeWeatherCondition("stormy")).toBe(true);
    expect(isNegativeWeatherCondition("cloudy")).toBe(false);
  });
});
