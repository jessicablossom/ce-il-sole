import { describe, expect, it } from "vitest";
import { getNextHourOutlookNote } from "../lib/nextHourHint";

describe("getNextHourOutlookNote", () => {
  it("stays silent when both hours share the exact same vibe", () => {
    expect(getNextHourOutlookNote(3, 3)).toBe(null);
    expect(getNextHourOutlookNote(0, 0)).toBe(null);
  });

  it("warns when brightness collapses toward worse weather later", () => {
    expect(getNextHourOutlookNote(0, 61)).not.toBe(null);
    expect(getNextHourOutlookNote(2, 3)).not.toBe(null);
  });

  it("teases hesitant optimism when the next hour clears up visually", () => {
    expect(getNextHourOutlookNote(3, 2)).not.toBe(null);
  });
});
