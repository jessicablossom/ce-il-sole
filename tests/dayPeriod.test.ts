import { describe, expect, it } from "vitest";
import {
  CENTRAL_EUROPEAN_TIME_ZONE,
  getDayPeriodInCentralEurope,
  isNightInCentralEurope,
} from "../lib/dayPeriod";

describe("central european day period utilities", () => {
  it("uses the Italy-compatible Central European timezone", () => {
    expect(CENTRAL_EUROPEAN_TIME_ZONE).toBe("Europe/Rome");
  });

  it("treats late evening in Central Europe as night", () => {
    expect(isNightInCentralEurope(new Date("2026-05-16T18:30:00.000Z"))).toBe(true);
    expect(getDayPeriodInCentralEurope(new Date("2026-05-16T18:30:00.000Z"))).toBe(
      "night",
    );
  });

  it("treats midday in Central Europe as day", () => {
    expect(isNightInCentralEurope(new Date("2026-05-16T10:00:00.000Z"))).toBe(false);
    expect(getDayPeriodInCentralEurope(new Date("2026-05-16T10:00:00.000Z"))).toBe(
      "day",
    );
  });
});
