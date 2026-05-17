import { describe, expect, it } from "vitest";
import {
  getWeatherConditionFromCode,
  getWeatherMood,
  isSunnyWeatherCode,
  parseDailyWeatherResponse,
} from "../lib/weather";

describe("weather utilities", () => {
  it("only treats clear and mainly clear days as sunny", () => {
    expect(isSunnyWeatherCode(0)).toBe(true);
    expect(isSunnyWeatherCode(1)).toBe(true);
    expect(isSunnyWeatherCode(2)).toBe(false);
  });

  it("keeps the main response intentionally minimal", () => {
    expect(getWeatherMood(0)).toMatchObject({
      icon: "☀️",
      answer: "Sì.",
    });
    expect(getWeatherMood(2)).toMatchObject({
      icon: "🌤️",
      answer: "Sì.",
    });
    expect(getWeatherMood(3)).toMatchObject({
      icon: "☁️",
      answer: "No.",
    });
    expect(getWeatherMood(61)).toMatchObject({
      icon: "🌧️",
      answer: "Purtroppo no.",
    });
    expect(getWeatherMood(61).aside.length).toBeGreaterThan(12);
    expect(getWeatherMood(71)).toMatchObject({
      icon: "❄️",
      answer: "Purtroppo no.",
    });
    expect(getWeatherMood(95)).toMatchObject({
      icon: "⛈️",
      answer: "Purtroppo no.",
    });
  });

  it("maps WMO weather codes to visual weather conditions", () => {
    expect(getWeatherConditionFromCode(0)).toBe("sunny");
    expect(getWeatherConditionFromCode(2)).toBe("partly-cloudy");
    expect(getWeatherConditionFromCode(3)).toBe("cloudy");
    expect(getWeatherConditionFromCode(45)).toBe("foggy");
    expect(getWeatherConditionFromCode(51)).toBe("drizzle");
    expect(getWeatherConditionFromCode(61)).toBe("rainy");
    expect(getWeatherConditionFromCode(71)).toBe("snowy");
    expect(getWeatherConditionFromCode(95)).toBe("stormy");
    expect(getWeatherConditionFromCode(null)).toBe("unknown");
  });

  it("sounds openly envious when the south gets sun", () => {
    expect(
      getWeatherMood(0, {
        id: "palermo",
        name: "Palermo",
        latitude: 38.1157,
        longitude: 13.3615,
        timeZone: "Europe/Rome",
        sunTone: "southern-envy",
      }),
    ).toMatchObject({
      icon: "☀️",
      answer: "Sì.",
    });
  });

  it("keeps sunny and cloudy asides deterministic", () => {
    expect(getWeatherMood(0, { ...testCity, id: "bologna" }).aside).toBe(
      getWeatherMood(0, { ...testCity, id: "bologna" }).aside,
    );
    expect(getWeatherMood(3, { ...testCity, id: "milano" }).aside).toBe(
      getWeatherMood(3, { ...testCity, id: "milano" }).aside,
    );
  });

  it("rotates sunny asides across calendar days in the selected city TZ", () => {
    expect(
      getWeatherMood(0, testCity, { calendarDayIso: "2026-05-01" }).aside,
    ).not.toBe(getWeatherMood(0, testCity, { calendarDayIso: "2026-05-02" }).aside);
  });

  it("parses Open-Meteo daily weather payloads", () => {
    expect(
      parseDailyWeatherResponse({
        daily: {
          time: ["2026-01-01", "2026-01-02"],
          weather_code: [0, 3],
        },
      }),
    ).toEqual([
      { date: "2026-01-01", weatherCode: 0 },
      { date: "2026-01-02", weatherCode: 3 },
    ]);
  });
});

const testCity = {
  id: "test",
  latitude: 44.4949,
  longitude: 11.3426,
  name: "Test",
  timeZone: "Europe/Rome",
};
