/**
 * Canonical public origin for the production deployment on Vercel.
 * Used when `NEXT_PUBLIC_SITE_URL` is unset so Open Graph absolute URLs
 * match the hostname users share (e.g. WhatsApp, Facebook debugger).
 */
export const PRODUCTION_CANONICAL_ORIGIN = "https://ce-il-sole.vercel.app" as const;

const trimOrEmpty = (value: string | undefined): string => value?.trim() ?? "";

/**
 * Origin (scheme + host, no path) used as Next.js `metadataBase`.
 */
export const getMetadataBaseOrigin = (): string => {
  const siteUrl = trimOrEmpty(process.env.NEXT_PUBLIC_SITE_URL);
  if (siteUrl !== "") {
    return new URL(siteUrl).origin;
  }

  if (process.env.VERCEL_ENV === "production") {
    return PRODUCTION_CANONICAL_ORIGIN;
  }

  const vercelHost = trimOrEmpty(process.env.VERCEL_URL);
  if (vercelHost !== "") {
    return new URL(`https://${vercelHost}`).origin;
  }

  return "http://localhost:3000";
};
