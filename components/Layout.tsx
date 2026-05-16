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
        "h-dvh overflow-hidden px-3 py-3 text-[var(--foreground)] transition-colors duration-700 sm:px-5 sm:py-4 lg:px-6",
        WEATHER_THEME_CLASS_NAMES[weatherCondition],
      ].join(" ")}
    >
      <div className="mx-auto flex h-full w-full max-w-[1800px] flex-col overflow-hidden px-3 pb-20 pt-4 sm:px-6 sm:pb-24 sm:pt-6 lg:px-8 lg:py-7">
        {children}
      </div>
    </main>
  );
}
