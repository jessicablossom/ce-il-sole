import type { ReactNode } from "react";
import type { WeatherCondition } from "@/types/weather";

const WEATHER_THEME_CLASS_NAMES = {
  cloudy: "bg-[var(--background)]",
  drizzle: "bg-[var(--background-drizzle)] [--panel:var(--surface-drizzle)]",
  foggy: "bg-[var(--background-foggy)] [--panel:var(--surface-foggy)]",
  rainy: "bg-[var(--background-rainy)] [--panel:var(--surface-rainy)]",
  snowy: "bg-[var(--background-snowy)] [--panel:var(--surface-snowy)]",
  stormy: "bg-[var(--background-stormy)] [--panel:var(--surface-stormy)]",
  sunny: "bg-[var(--background-sunny)] [--panel:var(--surface-sunny)]",
  unknown: "bg-[var(--background-unknown)]",
} as const satisfies Record<WeatherCondition, string>;

type LayoutProps = {
  children: ReactNode;
  weatherCondition?: WeatherCondition;
};

export function Layout({ children, weatherCondition = "cloudy" }: LayoutProps) {
  return (
    <main
      className={[
        "min-h-dvh overflow-y-auto px-3 py-3 text-[var(--foreground)] transition-colors duration-700 sm:px-5 sm:py-4 lg:h-dvh lg:overflow-hidden lg:px-6",
        WEATHER_THEME_CLASS_NAMES[weatherCondition],
      ].join(" ")}
    >
      <div className="mx-auto flex min-h-dvh w-full max-w-[1800px] flex-col px-3 pb-24 pt-4 sm:px-6 sm:pb-28 sm:pt-6 lg:h-full lg:min-h-0 lg:overflow-hidden lg:px-8 lg:py-7">
        {children}
      </div>
    </main>
  );
}
