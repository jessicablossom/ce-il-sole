import { getWeatherMood } from "@/lib/weather";
import type { ReactNode } from "react";
import { ShareCardButton } from "./ShareCardButton";
import type { City } from "@/types/weather";

type WeatherDisplayProps = {
  calendarDayIso: string;
  children?: ReactNode;
  city: City;
  nextHourOutlookNote?: string | null;
  showShareCard?: boolean;
  weatherCode: number | null;
};

export const WeatherDisplay = ({
  calendarDayIso,
  children,
  city,
  nextHourOutlookNote = null,
  showShareCard = true,
  weatherCode,
}: WeatherDisplayProps) => {
  const mood = getWeatherMood(weatherCode, city, { calendarDayIso });
  const stacksVerdictOnMobile = mood.answer === "Purtroppo no.";

  return (
    <section
      aria-label="Risposta"
      className={
        stacksVerdictOnMobile
          ? "flex min-h-0 flex-1 flex-col items-center justify-center px-5 py-6 text-center sm:px-0 sm:py-8"
          : "flex min-h-0 flex-1 flex-col items-center justify-center px-2.5 py-6 text-center sm:px-0 sm:py-8"
      }
    >
      <p className="ui-meta-label mb-5 text-xs font-semibold uppercase leading-none tracking-widest">
        Adesso
      </p>
      <div className="flex flex-col gap-3">
        <h2
          className={
            stacksVerdictOnMobile
              ? "flex flex-col items-center gap-1 font-serif text-8xl leading-none tracking-tighter max-[400px]:text-7xl sm:flex-row sm:items-center sm:gap-2 sm:whitespace-nowrap sm:text-9xl"
              : "flex flex-row items-center justify-center gap-2 font-serif text-8xl leading-none tracking-tighter max-[400px]:text-7xl sm:gap-3 sm:whitespace-nowrap sm:text-9xl"
          }
        >
          <span
            className={
              mood.condition === "sunny" || mood.condition === "partly-cloudy"
                ? "text-[var(--sun)]"
                : "text-[var(--rain)]"
            }
          >
            {mood.icon}
          </span>
          <span>{mood.answer}</span>
        </h2>
        <p className="text-base font-medium text-[var(--muted)] max-[400px]:text-sm sm:text-lg">
          {mood.aside}
        </p>
        {nextHourOutlookNote ? (
          <p className="text-xs font-semibold uppercase leading-snug tracking-widest text-[var(--muted)]">
            {nextHourOutlookNote}
          </p>
        ) : null}
      </div>
      {showShareCard ? <ShareCardButton cityName={city.name} mood={mood} /> : null}
      {children}
    </section>
  );
};
