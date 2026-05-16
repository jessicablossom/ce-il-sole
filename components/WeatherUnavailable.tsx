export function WeatherUnavailable() {
  return (
    <section className="flex min-h-0 flex-1 flex-col items-center justify-center py-6 text-center sm:py-8">
      <p className="mb-5 text-xs font-semibold uppercase tracking-[0.5em] text-[var(--muted)]">
        Oggi
      </p>
      <h2 className="whitespace-nowrap font-serif text-[clamp(4rem,12vw,10rem)] leading-[0.85] tracking-[-0.08em] text-[var(--rain)]">
        ☁️ Boh.
      </h2>
      <p className="mt-5 text-base font-medium text-[var(--muted)] sm:text-lg">
        Anche Open-Meteo ha perso la voglia.
      </p>
    </section>
  );
}
