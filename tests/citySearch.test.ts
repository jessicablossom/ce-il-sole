import { describe, expect, it } from "vitest";
import { CITIES } from "../lib/cities";
import {
  bucketCitiesForSelector,
  filterCitiesByQuery,
  getNextActiveCityId,
  normalizeCityName,
} from "../lib/citySearch";
import type { City } from "../types/weather";

const createCity = (id: string, name: string): City => ({
  id,
  latitude: 0,
  longitude: 0,
  name,
  timeZone: "Europe/Rome",
});

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

describe("bucketCitiesForSelector", () => {
  it("mette le cinque città in evidenza in testa in ordine alfabetico", () => {
    const { pinned, rest } = bucketCitiesForSelector(CITIES, "");

    expect(pinned.map((city) => city.name)).toEqual([
      "Bologna",
      "Firenze",
      "Milano",
      "Napoli",
      "Roma",
    ]);
    expect(rest.length).toBe(CITIES.length - pinned.length);
    expect(rest.every((city) => !pinned.some((pinnedCity) => pinnedCity.id === city.id))).toBe(
      true,
    );

    for (let index = 1; index < rest.length; index += 1) {
      expect(rest[index - 1].name.localeCompare(rest[index].name, "it")).toBeLessThanOrEqual(0);
    }
  });

  it("con ricerca tiene prima i match in evidenza poi gli altri alfabetici", () => {
    const { pinned, rest } = bucketCitiesForSelector(CITIES, "mi");

    expect(pinned.map((city) => city.id)).toEqual(["milano"]);
    expect(rest.every((city) => normalizeCityName(city.name).startsWith("mi"))).toBe(true);
    expect(rest.some((city) => city.id === "milano")).toBe(false);
  });
});
