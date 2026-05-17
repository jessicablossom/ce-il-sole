import { describe, expect, it } from "vitest";
import { FEATURED_CITY_IDS, resolveFeaturedCities } from "../lib/featuredCityIds";

describe("featuredCityIds", () => {
  it("risolve tutti gli id configurati nel catalogo attuale", () => {
    const cities = resolveFeaturedCities();

    expect(cities.length).toBe(FEATURED_CITY_IDS.length);
    expect(new Set(cities.map((city) => city.id))).toEqual(new Set(FEATURED_CITY_IDS));
  });

  it("esposta in ordine alfabetico italiano per nome", () => {
    const names = [...resolveFeaturedCities()]
      .sort((left, right) => left.name.localeCompare(right.name, "it"))
      .map((city) => city.name);

    expect(names).toEqual(["Bologna", "Firenze", "Milano", "Napoli", "Roma"]);
  });
});
