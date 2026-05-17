import { getWeatherMood } from "@/lib/weather";
import type { City } from "@/types/weather";

type NightDisplayProps = {
  calendarDayIso: string;
  city: City;
  weatherCode: number | null;
};

export const NightDisplay = ({ calendarDayIso, city, weatherCode }: NightDisplayProps) => {
  const dayMood = getWeatherMood(weatherCode, city, { calendarDayIso });

  return (
    <section
      aria-label="È notte"
      className="flex min-h-0 flex-1 flex-col items-center justify-center py-5 text-center sm:py-7"
    >
      <p className="ui-meta-label mb-10 text-xs font-semibold uppercase leading-none tracking-widest">
        Previsione sospesa per ovvi motivi
      </p>
      <h2 className="whitespace-nowrap font-serif text-7xl leading-none tracking-tighter text-[var(--foreground)] sm:text-9xl">
        È NOTTE.
      </h2>
      <p className="mt-5 max-w-md text-base font-medium leading-snug text-[var(--muted)]">
        Il sole ha chiuso. Contro ogni pronostico, anche oggi è arrivata la notte.
      </p>
      <div className="mt-8 w-full border-t border-[var(--line)]/10 pt-5">
        <p className="ui-meta-label text-xs font-semibold uppercase leading-none tracking-widest">
          Per dovere di cronaca
        </p>
        <p className="mt-3 whitespace-nowrap font-serif text-5xl leading-none tracking-tighter sm:text-6xl">
          <span
            className={
              dayMood.condition === "sunny" || dayMood.condition === "partly-cloudy"
                ? "text-[var(--sun)]"
                : "text-[var(--rain)]"
            }
          >
            {dayMood.icon}
          </span>{" "}
          {dayMood.answer}
        </p>
        <p className="mt-3 text-base font-medium text-[var(--muted)]">{dayMood.aside}</p>
      </div>
    </section>
  );
};
