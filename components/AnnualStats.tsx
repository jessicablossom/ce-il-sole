import { totalSansSoleDays } from "@/lib/archiveWithoutSun";
import { formatItalianDate } from "@/lib/utils";
import type { ArchiveWithoutSunBuckets } from "@/types/weather";

type AnnualStatsProps = {
  cityName: string;
  lastSunnyDay: string | null;
  sunnyDaysThisYear: number;
  sansSoleBucketsThisYear: ArchiveWithoutSunBuckets;
  timeZone: string;
};

export const AnnualStats = ({
  cityName,
  lastSunnyDay,
  sunnyDaysThisYear,
  sansSoleBucketsThisYear,
  timeZone,
}: AnnualStatsProps) => {
  const sansSum = totalSansSoleDays(sansSoleBucketsThisYear);

  const sansRows = SAN_SOLE_ROWS.flatMap(({ key, tableLabel }) => {
    const count = sansSoleBucketsThisYear[key];

    if (count <= 0) {
      return [];
    }

    return [{ count, key, tableLabel }] as const;
  });

  return (
    <section
      aria-label="Statistiche annuali"
      className="mt-6 flex w-full flex-col items-center gap-5 border-t border-[var(--line)]/5 pt-4 text-center text-[var(--muted)] sm:mt-5 sm:gap-5 sm:pt-4"
    >
      <p className="max-w-md text-base font-medium leading-snug">
        Lo sapevi? {cityName} ha avuto{" "}
        {sunnyDaysThisYear} giorni di sole quest’anno.
      </p>
      {sansSum > 0 ? (
        <div className="w-full max-w-md">
          <p className="ui-meta-label text-xs font-semibold uppercase leading-snug tracking-widest">
            Senza quel sole tanto discusso
          </p>
          <p className="mx-auto mb-3 text-xs font-medium leading-snug opacity-95">
            Altri{" "}
            <span className="tabular-nums px-0.5">{sansSum}</span> giorni dall&apos;archivio (con il solito
            ritardo burocratico).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border-y border-[var(--line)]/15 text-left text-sm tabular-nums">
              <caption className="sr-only">
                Suddivisione dei giorni senza sole nell&apos;archivio, per tipo di condizione meteo.
              </caption>
              <thead>
                <tr className="border-b border-[var(--line)]/12">
                  <th className="py-2.5 pr-3 text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Tipo
                  </th>
                  <th className="py-2.5 pl-3 text-right text-xs font-semibold uppercase tracking-wider text-[var(--muted)]">
                    Giorni
                  </th>
                </tr>
              </thead>
              <tbody>
                {sansRows.map(({ count, tableLabel, key }) => (
                  <tr className="border-b border-[var(--line)]/8 last:border-0" key={key}>
                    <th
                      className="max-w-[12rem] py-2.5 pr-3 align-top text-sm font-normal leading-snug"
                      scope="row"
                    >
                      {tableLabel}
                    </th>
                    <td className="py-2.5 pl-3 align-top text-right font-medium text-[var(--foreground)]">
                      {count}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}
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
};

const SAN_SOLE_ROWS = [
  { key: "partlyCloudy", tableLabel: "Parzialmente nuvoloso" },
  { key: "overcast", tableLabel: "Coperto" },
  { key: "fog", tableLabel: "Nebbia" },
  { key: "precipitation", tableLabel: "Pioggia, pioggerella, temporali" },
  { key: "snow", tableLabel: "Neve" },
] as const satisfies readonly {
  key: keyof ArchiveWithoutSunBuckets;
  tableLabel: string;
}[];
