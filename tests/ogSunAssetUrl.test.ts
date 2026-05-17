import { afterEach, describe, expect, it, vi } from "vitest";
import { getOgSunPngAbsoluteUrl, OG_SUN_ASSET_PATH } from "../lib/ogSunAssetUrl";

describe("getOgSunPngAbsoluteUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("joins metadata origin with the sun asset path", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com/app/");
    expect(OG_SUN_ASSET_PATH).toBe("/og-sun.png");
    expect(getOgSunPngAbsoluteUrl()).toBe("https://example.com/og-sun.png");
  });
});
