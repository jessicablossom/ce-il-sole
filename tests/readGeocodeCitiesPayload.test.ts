import { describe, expect, it } from "vitest";
import { readGeocodeCitiesPayload } from "../lib/readGeocodeCitiesPayload";
import type { City } from "../types/weather";

const sampleCity = {
  id: "1",
  name: "Roma",
  latitude: 1,
  longitude: 2,
  timeZone: "Europe/Rome",
} satisfies City;

describe("readGeocodeCitiesPayload", () => {
  it("restituisce null per input non conforme", () => {
    expect(readGeocodeCitiesPayload(null)).toBeNull();
    expect(readGeocodeCitiesPayload(undefined)).toBeNull();
    expect(readGeocodeCitiesPayload([])).toBeNull();
    expect(readGeocodeCitiesPayload({})).toBeNull();
    expect(readGeocodeCitiesPayload({ cities: 1 })).toBeNull();
  });

  it("restituisce l’array cities quando è un array", () => {
    expect(readGeocodeCitiesPayload({ cities: [] })).toEqual([]);
    expect(readGeocodeCitiesPayload({ cities: [sampleCity] })).toEqual([sampleCity]);
  });
});
