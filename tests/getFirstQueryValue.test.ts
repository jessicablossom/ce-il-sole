import { describe, expect, it } from "vitest";
import { getFirstQueryValue } from "../lib/getFirstQueryValue";

describe("getFirstQueryValue", () => {
  it("returns string params as-is", () => {
    expect(getFirstQueryValue("bologna")).toBe("bologna");
  });

  it("returns the first array entry", () => {
    expect(getFirstQueryValue(["catania", "bologna"])).toBe("catania");
  });

  it("returns null for undefined or empty array", () => {
    expect(getFirstQueryValue(undefined)).toBeNull();
    expect(getFirstQueryValue([])).toBeNull();
  });
});
