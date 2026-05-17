import { describe, expect, it } from "vitest";
import { tallyArchiveSansSole, totalSansSoleDays } from "../lib/archiveWithoutSun";

describe("tallyArchiveSansSole", () => {
  it("ignores purely sunny snapshots", () => {
    const tally = tallyArchiveSansSole([
      { date: "2026-01-02", weatherCode: 0 },
      { date: "2026-01-03", weatherCode: 1 },
      { date: "2026-01-04", weatherCode: 1 },
    ]);

    expect(tally).toEqual({
      fog: 0,
      overcast: 0,
      partlyCloudy: 0,
      precipitation: 0,
      snow: 0,
    });
  });

  it("places each non-sunny day into one antisole bucket", () => {
    const days = [
      { date: "2026-01-05", weatherCode: 2 },
      { date: "2026-01-06", weatherCode: 3 },
      { date: "2026-01-07", weatherCode: 45 },
      { date: "2026-01-08", weatherCode: 61 },
      { date: "2026-01-09", weatherCode: 95 },
      { date: "2026-01-10", weatherCode: 71 },
      { date: "2026-01-11", weatherCode: 0 },
      { date: "2026-01-12", weatherCode: 777 },
    ] as const;

    const tally = tallyArchiveSansSole(days);

    expect(tally).toEqual({
      fog: 1,
      overcast: 2,
      partlyCloudy: 1,
      precipitation: 2,
      snow: 1,
    });

    expect(tally.partlyCloudy + tally.overcast + tally.fog + tally.precipitation + tally.snow).toBe(
      days.length - 1,
    );
  });
});

describe("totalSansSoleDays", () => {
  it("sums the antisole tally", () => {
    expect(
      totalSansSoleDays({
        fog: 1,
        overcast: 2,
        partlyCloudy: 3,
        precipitation: 4,
        snow: 5,
      }),
    ).toBe(15);
  });
});
