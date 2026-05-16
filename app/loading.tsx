import { Layout } from "@/components/Layout";

export default function Loading() {
  return (
    <Layout weatherCondition="unknown">
      <div role="status" className="sr-only">
        Caricamento previsione...
      </div>

      <header className="shrink-0 px-0 lg:px-[20%]" aria-hidden="true">
        <div className="flex animate-pulse flex-col items-start justify-between gap-5 sm:flex-row">
          <div className="min-w-0">
            <div className="mb-3 h-3 w-56 bg-[var(--line)]/20" />
            <div className="h-10 w-52 bg-[var(--line)]/20 sm:h-14 sm:w-72" />
          </div>
          <div className="min-w-0 self-end text-right">
            <div className="ml-auto h-3 w-24 bg-[var(--line)]/20" />
            <div className="mt-3 h-4 w-36 bg-[var(--line)]/20" />
          </div>
        </div>
      </header>

      <div
        className="flex min-h-0 flex-1 flex-col px-0 pt-7 lg:px-[20%] lg:pt-9"
        aria-hidden="true"
      >
        <div className="animate-pulse">
          <div className="mb-3 h-3 w-44 bg-[var(--line)]/20" />
          <div className="border-b border-[var(--line)]/30 py-3">
            <div className="h-7 w-48 bg-[var(--line)]/20 sm:h-8 sm:w-64" />
          </div>
        </div>

        <section className="flex min-h-0 flex-1 flex-col items-center justify-center py-6 text-center sm:py-8">
          <div className="w-full animate-pulse">
            <div className="mx-auto mb-6 h-3 w-16 bg-[var(--line)]/20" />
            <div className="mx-auto h-24 w-72 bg-[var(--line)]/20 sm:h-32 sm:w-96" />
            <div className="mx-auto mt-5 h-5 w-64 bg-[var(--line)]/20" />
            <div className="mx-auto mt-6 h-4 w-28 bg-[var(--line)]/20" />
            <div className="mx-auto mt-7 flex w-full max-w-md flex-col items-center gap-5 border-t border-[var(--line)]/5 pt-5 sm:mt-6 sm:gap-3 sm:pt-4">
              <div className="h-5 w-72 bg-[var(--line)]/20" />
              <div className="flex flex-col items-center gap-2">
                <div className="h-3 w-64 bg-[var(--line)]/20" />
                <div className="h-4 w-40 bg-[var(--line)]/20" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <div
        className="fixed inset-x-0 bottom-0 z-30 p-3 lg:inset-x-auto lg:bottom-7 lg:right-7 lg:p-0"
        aria-hidden="true"
      >
        <div className="h-11 w-full animate-pulse border border-[var(--line)]/20 bg-[var(--line)]/20 lg:w-56" />
      </div>
    </Layout>
  );
}
