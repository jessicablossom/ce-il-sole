import { getWeatherMood } from "@/lib/weather";
import type { ReactNode } from "react";
import { ShareCardButton } from "./ShareCardButton";
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
      <p className="ui-meta-label mb-5 text-xs font-semibold uppercase leading-none tracking-widest">
        Oggi
      </p>
      <div className="flex flex-col gap-3">
        <h2 className="whitespace-nowrap font-serif text-8xl leading-none tracking-tighter sm:text-9xl">
          <span className={mood.condition === "sunny" ? "text-[var(--sun)]" : "text-[var(--rain)]"}>
            {mood.icon}
          </span>{" "}
          {mood.answer}
        </h2>
        <p className="text-base font-medium text-[var(--muted)] sm:text-lg">
          {mood.aside}
        </p>
      </div>
      <ShareCardButton cityName={city.name} mood={mood} />
      {children}
    </section>
  );
}
