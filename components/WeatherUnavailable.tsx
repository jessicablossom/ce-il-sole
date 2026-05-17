export const WeatherUnavailable = () => {
  return (
    <section className="flex min-h-0 flex-1 flex-col items-center justify-center py-6 text-center sm:py-8">
      <p className="ui-meta-label mb-5 text-xs font-semibold uppercase leading-none tracking-widest">
        Oggi
      </p>
      <h2 className="whitespace-nowrap font-serif text-7xl leading-none tracking-tighter text-[var(--rain)] sm:text-9xl">
        ☁️ Boh.
      </h2>
      <p className="mt-5 text-base font-medium text-[var(--muted)] sm:text-lg">
        Anche Open-Meteo ha perso la voglia.
      </p>
    </section>
  );
};
