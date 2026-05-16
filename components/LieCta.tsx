import Link from "next/link";

type LieCtaProps = {
  isLying: boolean;
  selectedCityId: string;
};

export function LieCta({ isLying, selectedCityId }: LieCtaProps) {
  const href = isLying ? `/?city=${selectedCityId}` : `/?city=${selectedCityId}&preview=sole`;

  return (
    <div className="fixed inset-x-0 bottom-0 z-30 p-3 lg:inset-x-auto lg:bottom-7 lg:right-7 lg:p-0">
      <Link
        className="block w-full border border-[var(--line)]/30 bg-[var(--foreground)] px-5 py-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-[var(--background)] shadow-[var(--shadow-panel)] transition hover:bg-[var(--line)] focus:outline-none focus:ring-2 focus:ring-[var(--line)]/40 lg:w-auto lg:min-w-56 lg:bg-[var(--foreground)]/90 lg:px-4 lg:py-3"
        href={href}
      >
        {isLying ? "Basta bugie." : "Mentimi sul sole."}
      </Link>
    </div>
  );
}
