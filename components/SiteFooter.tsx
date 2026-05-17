import {
  getVisibleSiteFooterExtraLinks,
  SITE_FOOTER_AUTHOR,
  SITE_FOOTER_CREDIT_PREFIX,
  SITE_FOOTER_EXTRA_LINKS,
} from "@/lib/siteFooter";

export const SiteFooter = () => {
  const extras = getVisibleSiteFooterExtraLinks(SITE_FOOTER_EXTRA_LINKS);

  return (
    <footer
      aria-label="Crediti"
      className="mt-auto shrink-0 px-0 pt-8 pb-6 sm:pt-10 lg:px-[20%]"
    >
      <p className="text-center text-xs leading-relaxed text-[var(--muted)] sm:text-left">
        <span>{SITE_FOOTER_CREDIT_PREFIX} </span>
        <a
          className="font-medium text-[var(--foreground)] underline decoration-[var(--line)]/40 underline-offset-2 transition hover:decoration-[var(--line)]"
          href={SITE_FOOTER_AUTHOR.href}
          rel="noopener noreferrer"
          target="_blank"
        >
          {SITE_FOOTER_AUTHOR.label}
        </a>
        {extras.length > 0 ? (
          <>
            <span aria-hidden="true" className="px-1.5 text-[var(--muted)]">
              ·
            </span>
            {extras.map((link, index) => (
              <span key={`${link.label}-${link.href}`}>
                {index > 0 ? (
                  <span aria-hidden="true" className="px-1.5 text-[var(--muted)]">
                    ·
                  </span>
                ) : null}
                <a
                  className="font-medium text-[var(--foreground)] underline decoration-[var(--line)]/40 underline-offset-2 transition hover:decoration-[var(--line)]"
                  href={link.href}
                  rel="noopener noreferrer"
                  target="_blank"
                >
                  {link.label}
                </a>
              </span>
            ))}
          </>
        ) : null}
        .
      </p>
    </footer>
  );
};
