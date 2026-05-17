import { describe, expect, it } from "vitest";
import { isRegisteredCityId } from "../lib/isRegisteredCityId";

describe("isRegisteredCityId", () => {
  it("accepts lowercase city IDs from the catalogue", () => {
    expect(isRegisteredCityId("roma")).toBe(true);
    expect(isRegisteredCityId("milano")).toBe(true);
  });

  it("rejects casing variants and placeholders", () => {
    expect(isRegisteredCityId("Roma")).toBe(false);
    expect(isRegisteredCityId("fantasy-town")).toBe(false);
    expect(isRegisteredCityId("")).toBe(false);
  });
});
