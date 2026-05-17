import { afterEach, describe, expect, it, vi } from "vitest";
import {
  getMetadataBaseOrigin,
  PRODUCTION_CANONICAL_ORIGIN,
} from "../lib/siteOrigin";

describe("getMetadataBaseOrigin", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("prefers NEXT_PUBLIC_SITE_URL and normalizes to origin", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "https://example.com/path/");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("VERCEL_URL", "ignored.example.com");

    expect(getMetadataBaseOrigin()).toBe("https://example.com");
  });

  it("uses production canonical origin when URL is unset on Vercel production", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_ENV", "production");
    vi.stubEnv("VERCEL_URL", "ce-il-sole-abc123.vercel.app");

    expect(getMetadataBaseOrigin()).toBe(PRODUCTION_CANONICAL_ORIGIN);
  });

  it("uses VERCEL_URL on preview / dev deployments when site URL is unset", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_ENV", "preview");
    vi.stubEnv("VERCEL_URL", "my-branch-ce-il-sole.vercel.app");

    expect(getMetadataBaseOrigin()).toBe("https://my-branch-ce-il-sole.vercel.app");
  });

  it("falls back to localhost when not on Vercel", () => {
    vi.stubEnv("NEXT_PUBLIC_SITE_URL", "");
    vi.stubEnv("VERCEL_ENV", "");
    vi.stubEnv("VERCEL_URL", "");

    expect(getMetadataBaseOrigin()).toBe("http://localhost:3000");
  });
});
