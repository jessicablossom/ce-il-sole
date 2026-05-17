import { describe, expect, it } from "vitest";
import { DEFAULT_CITY_ID } from "../lib/cities";
import { resolveRawHomeCityId } from "../lib/resolveHomeCityId";

describe("resolveRawHomeCityId", () => {
  it("prefers the path slug over query city when both exist", () => {
    expect(
      resolveRawHomeCityId({
        cityFromPath: "roma",
        rawSearchCity: "milano",
      }),
    ).toBe("roma");
  });

  it("falls back to query city when slug is absent", () => {
    expect(
      resolveRawHomeCityId({
        cityFromPath: undefined,
        rawSearchCity: "catania",
      }),
    ).toBe("catania");
  });

  it("defaults to Bologna without path or query", () => {
    expect(
      resolveRawHomeCityId({
        cityFromPath: undefined,
        rawSearchCity: undefined,
      }),
    ).toBe(DEFAULT_CITY_ID);
  });
});
