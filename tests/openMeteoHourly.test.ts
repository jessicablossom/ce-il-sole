import { describe, expect, it } from "vitest";
import {
  findHourlySeriesIndex,
  parseOpenMeteoHourlyPayload,
} from "../lib/openMeteoHourly";

describe("findHourlySeriesIndex", () => {
  it("prefers the last slot at or before the floor timestamp", () => {
    expect(
      findHourlySeriesIndex(
        ["2026-05-17T08:00", "2026-05-17T09:00", "2026-05-17T10:00"],
        "2026-05-17T09:00",
      ),
    ).toBe(1);
  });

  it("falls back to the first upcoming slot when everything is strictly after the floor", () => {
    expect(findHourlySeriesIndex(["2026-05-17T11:00", "2026-05-17T12:00"], "2026-05-17T09:00")).toBe(
      0,
    );
  });

  it("returns the last usable slot before an impossible horizon", () => {
    expect(
      findHourlySeriesIndex(["2026-05-17T06:00", "2026-05-17T07:00"], "2099-12-31T00:00"),
    ).toBe(1);
  });

  it("handles empty payloads", () => {
    expect(findHourlySeriesIndex([], "2026-05-17T09:00")).toBe(null);
  });
});

describe("parseOpenMeteoHourlyPayload", () => {
  it("extracts hourly series when payloads are coherent", () => {
    expect(
      parseOpenMeteoHourlyPayload({
        time: ["2026-05-17T09:00"],
        weather_code: [2],
        is_day: [1],
      }),
    ).toEqual({
      isDayFlags: [1],
      times: ["2026-05-17T09:00"],
      weatherCodes: [2],
    });
  });

  it("returns null when arrays disagree on length", () => {
    expect(
      parseOpenMeteoHourlyPayload({
        time: ["2026-05-17T09:00"],
        weather_code: [2],
        is_day: [],
      }),
    ).toBe(null);
  });
});
