import { describe, expect, it } from "vitest";
import { filterCitiesByQuery, getNextActiveCityId, normalizeCityName } from "../lib/citySearch";
import type { City } from "../types/weather";

const cities = [
  createCity("forli", "Forlì"),
  createCity("firenze", "Firenze"),
  createCity("bologna", "Bologna"),
] as const;

describe("city search utilities", () => {
  it("normalizes accents and casing", () => {
    expect(normalizeCityName("Forlì")).toBe("forli");
    expect(normalizeCityName(" L’AQUILA ")).toBe(" l’aquila ");
  });

  it("filters cities from the first character with accent-insensitive matching", () => {
    expect(filterCitiesByQuery(cities, "forli").map((city) => city.id)).toEqual(["forli"]);
    expect(filterCitiesByQuery(cities, "fi").map((city) => city.id)).toEqual(["firenze"]);
    expect(filterCitiesByQuery(cities, "logna")).toEqual([]);
  });

  it("cycles active city selection by keyboard direction", () => {
    expect(getNextActiveCityId({ activeCityId: null, cities, direction: "next" })).toBe(
      "forli",
    );
    expect(getNextActiveCityId({ activeCityId: "forli", cities, direction: "previous" })).toBe(
      "bologna",
    );
    expect(getNextActiveCityId({ activeCityId: "bologna", cities, direction: "next" })).toBe(
      "forli",
    );
  });
});

function createCity(id: string, name: string): City {
  return {
    id,
    latitude: 0,
    longitude: 0,
    name,
    timeZone: "Europe/Rome",
  };
}
