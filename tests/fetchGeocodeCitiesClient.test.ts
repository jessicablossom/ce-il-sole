import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchGeocodeCitiesClient,
  GEOCODE_CLIENT_API_PATH,
} from "../lib/fetchGeocodeCitiesClient";
import type { City } from "../types/weather";

const sampleCity = {
  id: "3169070",
  name: "Roma",
  latitude: 1,
  longitude: 2,
  timeZone: "Europe/Rome",
} satisfies City;

describe("fetchGeocodeCitiesClient", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it("richiede la query codificata sull’endpoint geocode", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ cities: [] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await fetchGeocodeCitiesClient("Roma ");

    expect(fetchMock).toHaveBeenCalledWith(
      `${GEOCODE_CLIENT_API_PATH}?q=${encodeURIComponent("Roma")}`,
      { signal: undefined },
    );
  });

  it("restituisce null se la risposta non è ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ cities: [sampleCity] }),
      }),
    );

    await expect(fetchGeocodeCitiesClient("x")).resolves.toBeNull();
  });

  it("restituisce null se il payload non è decodificabile", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({}),
      }),
    );

    await expect(fetchGeocodeCitiesClient("x")).resolves.toBeNull();
  });

  it("restituisce le città quando il payload è valido", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ cities: [sampleCity] }),
      }),
    );

    await expect(fetchGeocodeCitiesClient("roma")).resolves.toEqual([sampleCity]);
  });

  it("inoltra AbortSignal a fetch", async () => {
    const controller = new AbortController();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ cities: [] }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await fetchGeocodeCitiesClient("a", { signal: controller.signal });

    expect(fetchMock).toHaveBeenCalledWith(expect.any(String), {
      signal: controller.signal,
    });
  });
});
