import { getWeatherMood } from "@/lib/weather";
import type { ReactNode } from "react";
import type { City } from "@/types/weather";

type WeatherDisplayProps = {
  children?: ReactNode;
  city: City;
  weatherCode: number | null;
};

export function WeatherDisplay({ children, city, weatherCode }: WeatherDisplayProps) {
  const mood = getWeatherMood(weatherCode, city);

  return (
    <section
      aria-label="Risposta"
      className="flex min-h-0 flex-1 flex-col items-center justify-center py-6 text-center sm:py-8"
    >
      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.5em] text-[var(--muted)]">
        Oggi
      </p>
      <div className="flex flex-col gap-3">
        <h2 className="whitespace-nowrap font-serif text-[clamp(5.25rem,15vw,13.5rem)] leading-[0.82] tracking-[-0.08em]">
          <span className={mood.condition === "sunny" ? "text-[var(--sun)]" : "text-[var(--rain)]"}>
            {mood.icon}
          </span>{" "}
          {mood.answer}
        </h2>
        <p className="text-base font-medium text-[var(--muted)] sm:text-lg">
          {mood.aside}
        </p>
      </div>
      {children}
    </section>
  );
}
