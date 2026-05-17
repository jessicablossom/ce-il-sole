import type { SiteFooterLink } from "@/types/siteFooter";

export const SITE_FOOTER_CREDIT_PREFIX = "Fatto con ♥ da" as const;

export const SITE_FOOTER_AUTHOR: SiteFooterLink = {
  label: "Jess",
  href: "https://www.linkedin.com/in/jessfrancavilla/",
};

export const SITE_FOOTER_EXTRA_LINKS: readonly SiteFooterLink[] = [
  { label: "GitHub", href: "https://github.com/jessicablossom" },
];

export const getVisibleSiteFooterExtraLinks = (
  links: readonly SiteFooterLink[],
): SiteFooterLink[] =>
  links.filter(
    (link) => link.href.trim().length > 0 && link.label.trim().length > 0,
  );
