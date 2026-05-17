import { describe, expect, it } from "vitest";
import { DEFAULT_CITY_ID } from "../lib/cities";
import { buildHomeNavigationHrefFromCityId } from "../lib/buildHomeNavigationHrefFromCityId";

describe("buildHomeNavigationHrefFromCityId", () => {
  it("usa la path radice per la città predefinita del catalogo", () => {
    expect(buildHomeNavigationHrefFromCityId({ resolvedCityOrGeoStringId: DEFAULT_CITY_ID })).toBe(
      "/",
    );
  });

  it("usa lo slug catalogo quando l’ID non è numerico", () => {
    expect(buildHomeNavigationHrefFromCityId({ resolvedCityOrGeoStringId: "roma" })).toBe("/roma");
  });

  it("usa /g/id per ID Open‑Meteo numerici", () => {
    expect(buildHomeNavigationHrefFromCityId({ resolvedCityOrGeoStringId: "3169658" })).toBe(
      "/g/3169658",
    );
  });

  it("aggiunge parametri preview e meteoSegreto in query quando presenti", () => {
    expect(
      buildHomeNavigationHrefFromCityId({
        resolvedCityOrGeoStringId: "3169658",
        preview: "sole",
      }),
    ).toBe("/g/3169658?preview=sole");

    expect(
      buildHomeNavigationHrefFromCityId({
        resolvedCityOrGeoStringId: DEFAULT_CITY_ID,
        preview: "sole",
        meteoSegreto: ["x"],
      }),
    ).toBe("/?preview=sole&meteoSegreto=x");
  });
});
