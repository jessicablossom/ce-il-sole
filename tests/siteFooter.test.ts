import { describe, expect, it } from "vitest";
import {
  getVisibleSiteFooterExtraLinks,
  SITE_FOOTER_AUTHOR,
  SITE_FOOTER_EXTRA_LINKS,
} from "../lib/siteFooter";

describe("site footer", () => {
  it("keeps author links as absolute https URLs", () => {
    expect(SITE_FOOTER_AUTHOR.href).toMatch(/^https:\/\//);
    for (const link of SITE_FOOTER_EXTRA_LINKS) {
      expect(link.href).toMatch(/^https:\/\//);
    }
  });

  it("filters out links with empty href or label", () => {
    expect(
      getVisibleSiteFooterExtraLinks([
        { label: "Ok", href: "https://example.com" },
        { label: "", href: "https://example.com" },
        { label: "  ", href: "https://example.com" },
        { label: "Bad", href: "" },
        { label: "Bad2", href: "   " },
      ]),
    ).toEqual([{ label: "Ok", href: "https://example.com" }]);
  });
});
