import { afterEach, describe, expect, it, vi } from "vitest";
import { buildCanonicalHomeUrl } from "../lib/buildCanonicalHomeUrl";
import { buildRelativeHomeHref } from "../lib/buildHomeHref";

describe("buildCanonicalHomeUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("builds root URL without query when params are absent", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    expect(buildCanonicalHomeUrl({})).toBe("https://example.com/");
  });

  it("puts city slug in the path outside Bologna", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    expect(buildCanonicalHomeUrl({ city: "catania" })).toBe("https://example.com/catania");
  });

  it("routes Bologna canonical to `/` instead of `/bologna`", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    expect(buildCanonicalHomeUrl({ city: "bologna" })).toBe("https://example.com/");
  });

  it("keeps preview and secret on query when slug is present", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    expect(
      buildCanonicalHomeUrl({
        city: "catania",
        preview: "clear",
        meteoSegreto: "secret",
      }),
    ).toBe("https://example.com/catania?preview=clear&meteoSegreto=secret");
  });
});

describe("buildRelativeHomeHref", () => {
  it("matches canonical path semantics for Bologna vs other cities", () => {
    expect(buildRelativeHomeHref({ city: "bologna" })).toBe("/");
    expect(buildRelativeHomeHref({ city: "roma" })).toBe("/roma");
    expect(buildRelativeHomeHref({ city: "roma", preview: "sole" })).toBe("/roma?preview=sole");
  });
});
