import { describe, expect, it } from "vitest";
import {
  formatItalianDate,
  getIsoDateInTimeZone,
  getYearStartIsoDate,
} from "../lib/utils";

describe("date utilities", () => {
  it("formats dates in Italian", () => {
    expect(formatItalianDate("2026-05-16")).toBe("sabato 16 maggio 2026");
  });

  it("builds ISO dates for the configured timezone", () => {
    expect(getIsoDateInTimeZone(new Date("2026-05-15T22:30:00.000Z"))).toBe(
      "2026-05-16",
    );
  });

  it("returns the current year's first day", () => {
    expect(getYearStartIsoDate("2026-05-16")).toBe("2026-01-01");
  });
});
