import { getWeatherMood } from "@/lib/weather";
import type { City } from "@/types/weather";

type NightDisplayProps = {
  city: City;
  weatherCode: number | null;
};

export function NightDisplay({ city, weatherCode }: NightDisplayProps) {
  const dayMood = getWeatherMood(weatherCode, city);

  return (
    <section
      aria-label="È notte"
      className="flex min-h-0 flex-1 flex-col items-center justify-center py-5 text-center sm:py-7"
    >
      <p className="mb-[40px] text-xs font-semibold uppercase tracking-[0.5em] text-[var(--muted)]">
        Previsione sospesa per ovvi motivi
      </p>
      <h2 className="whitespace-nowrap font-serif text-[clamp(4rem,12vw,11rem)] leading-[0.8] tracking-[-0.08em] text-[var(--foreground)]">
        È NOTTE.
      </h2>
      <p className="mt-5 text-base font-medium text-[var(--muted)] sm:text-lg">
        Il sole ha chiuso. Contro ogni pronostico, anche oggi è arrivata la notte.
      </p>
      <div className="mt-8 w-full border-t border-[var(--line)]/10 pt-5">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[var(--muted)]">
          Per dovere di cronaca
        </p>
        <p className="mt-3 whitespace-nowrap font-serif text-5xl leading-none tracking-[-0.05em] sm:text-6xl">
          <span
            className={
              dayMood.condition === "sunny" ? "text-[var(--sun)]" : "text-[var(--rain)]"
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
}
