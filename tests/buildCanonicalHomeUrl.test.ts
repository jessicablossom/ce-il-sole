import { afterEach, describe, expect, it, vi } from "vitest";
import { buildCanonicalHomeUrl } from "../lib/buildCanonicalHomeUrl";

describe("buildCanonicalHomeUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("builds root URL without query when params are absent", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    expect(buildCanonicalHomeUrl({})).toBe("https://example.com/");
  });

  it("includes city, preview, and secret params when present", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com");
    expect(
      buildCanonicalHomeUrl({
        city: "catania",
        preview: "clear",
        meteoSegreto: "secret",
      }),
    ).toBe("https://example.com/?city=catania&preview=clear&meteoSegreto=secret");
  });
});
