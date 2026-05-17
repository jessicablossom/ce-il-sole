"use client";

import { useRouter } from "next/navigation";

type LieCtaProps = {
  activateLieHref: string;
  deactivateLieHref: string;
  isLieActive: boolean;
};

export const LieCta = ({
  activateLieHref,
  deactivateLieHref,
  isLieActive,
}: LieCtaProps) => {
  const router = useRouter();
  const href = isLieActive ? deactivateLieHref : activateLieHref;
  const label = isLieActive ? "Basta bugie." : "Mentimi sul sole.";
  const accessibilityLabel = isLieActive
    ? "Disattiva la previsione finta di sole"
    : "Attiva una previsione finta di sole";

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 p-3 lg:inset-x-auto lg:bottom-7 lg:right-7 lg:p-0">
      <button
        aria-label={accessibilityLabel}
        aria-pressed={isLieActive}
        className="block w-full border border-[var(--line)]/30 bg-[var(--foreground)] px-5 py-3 text-center text-xs font-semibold uppercase tracking-widest text-[var(--background)] shadow-[var(--shadow-panel)] transition hover:bg-[var(--line)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--line)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)] lg:w-auto lg:min-w-56 lg:bg-[var(--foreground)]/90 lg:px-4 lg:py-3"
        onClick={() => router.push(href)}
        type="button"
      >
        {label}
      </button>
    </div>
  );
};
