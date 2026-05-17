import Link from "next/link";
import { Layout } from "@/components/Layout";

export const NotFound = () => {
  return (
    <Layout weatherCondition="cloudy">
      <section className="flex min-h-0 flex-1 flex-col items-center justify-center px-0 text-center lg:px-[20%]">
        <p className="ui-meta-label mb-5 text-xs font-semibold uppercase leading-none tracking-widest">
          Errore geografico
        </p>
        <h1 className="whitespace-nowrap font-serif text-8xl leading-none tracking-tighter sm:text-9xl">
          404.
        </h1>
        <p className="mt-6 max-w-md text-base font-medium text-[var(--muted)] sm:text-lg">
          Questa pagina non esiste. Un comportamento sorprendentemente coerente con il
          meteo.
        </p>
        <Link
          className="mt-10 border-b border-[var(--line)]/35 pb-1 text-xs font-semibold uppercase tracking-widest text-[var(--foreground)] transition hover:border-[var(--line)]"
          href="/"
        >
          Torna alla domanda inutile
        </Link>
      </section>
    </Layout>
  );
};

export default NotFound;
