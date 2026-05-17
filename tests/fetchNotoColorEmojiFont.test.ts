import { afterEach, describe, expect, it, vi } from "vitest";
import {
  fetchNotoColorEmojiFont,
  NOTO_COLOR_EMOJI_FONT_URL,
} from "../lib/fetchNotoColorEmojiFont";

describe("fetchNotoColorEmojiFont", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fetches and returns the font buffer when the response is ok", async () => {
    const buffer = new ArrayBuffer(4);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        status: 200,
        arrayBuffer: async () => buffer,
      }),
    );

    await expect(fetchNotoColorEmojiFont()).resolves.toBe(buffer);
    expect(fetch).toHaveBeenCalledWith(NOTO_COLOR_EMOJI_FONT_URL);
  });

  it("throws when the response is not ok", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
      }),
    );

    await expect(fetchNotoColorEmojiFont()).rejects.toThrow(
      "Noto Color Emoji font failed: 503",
    );
  });
});
