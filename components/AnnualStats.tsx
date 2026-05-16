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
      className="mt-6 flex w-full flex-col items-center gap-2 border-t border-[var(--line)]/5 pt-4 text-center text-[var(--muted)]"
    >
      <p className="max-w-md text-sm font-medium leading-snug sm:text-base">
        Lo sapevi? {cityName} ha avuto{" "}
        <span className="text-[var(--foreground)]">{sunnyDaysThisYear}</span> giorni di sole
        quest’anno.
      </p>
      <div className="text-xs leading-5">
        <p className="ui-meta-label whitespace-nowrap">
          Ultimo giorno veramente felice
        </p>
        <p className="ui-meta-value mt-1 whitespace-nowrap">
          {lastSunnyDay ? formatItalianDate(lastSunnyDay, timeZone) : "Non pervenuto."}
        </p>
      </div>
    </section>
  );
}
