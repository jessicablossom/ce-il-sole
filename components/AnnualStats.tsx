import { formatItalianDate } from "@/lib/utils";

type AnnualStatsProps = {
  cityName: string;
  sunnyDaysThisYear: number;
  lastSunnyDay: string | null;
  timeZone: string;
};

export function AnnualStats({
  cityName,
  sunnyDaysThisYear,
  lastSunnyDay,
  timeZone,
}: AnnualStatsProps) {
  return (
    <section
      aria-label="Statistiche annuali"
      className="mt-7 flex w-full flex-col items-center gap-5 border-t border-[var(--line)]/5 pt-5 text-center text-[var(--muted)] sm:mt-6 sm:gap-3 sm:pt-4"
    >
      <p className="max-w-md text-base font-medium leading-snug">
        Lo sapevi? {cityName} ha avuto{" "}
        <span className="text-[var(--foreground)]">{sunnyDaysThisYear}</span> giorni di sole
        quest’anno.
      </p>
      <div className="text-xs leading-5">
        <p className="ui-meta-label whitespace-nowrap text-xs font-semibold uppercase leading-none tracking-widest">
          Ultimo giorno veramente felice
        </p>
        <p className="ui-meta-value mt-1 whitespace-nowrap text-sm font-medium leading-snug">
          {lastSunnyDay ? formatItalianDate(lastSunnyDay, timeZone) : "Non pervenuto."}
        </p>
      </div>
    </section>
  );
}
