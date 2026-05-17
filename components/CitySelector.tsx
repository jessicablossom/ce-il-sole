"use client";

import { useRouter } from "next/navigation";
import {
  type KeyboardEvent,
  type ReactElement,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { buildHomeNavigationHrefFromCityId } from "@/lib/buildHomeNavigationHrefFromCityId";
import {
  bucketCitiesForSelector,
  getNextActiveCityId,
  normalizeCityName,
} from "@/lib/citySearch";
import { fetchGeocodeCitiesClient } from "@/lib/fetchGeocodeCitiesClient";
import type { City } from "@/types/weather";

type CitySelectorProps = {
  cities: readonly City[];
  resolvedPlaceName: string;
  selectedCityId: string;
};

type GeoLatch = {
  latchQuery: string;
  cities: readonly City[];
};

const GEOCODE_SEARCH_MIN_CHARS = 2;

const CitySelectorSectionDivider = ({ label }: { label: string }): ReactElement => (
  <div
    aria-hidden="true"
    className="pointer-events-none border-t border-[var(--line)]/20 px-4 py-2"
    role="presentation"
  >
    <span className="ui-meta-label text-[10px] font-semibold uppercase tracking-widest">
      {label}
    </span>
  </div>
);

const CityOptionAdminLine = ({ admin1 }: { admin1: string | undefined }): ReactElement | null =>
  typeof admin1 === "string" && admin1.length > 0 ? (
    <span className="text-[11px] font-normal text-[var(--muted)]">{admin1}</span>
  ) : null;

const getCityOptionId = (cityId: string): string => `city-option-${cityId}`;

const getCityOptionClassName = ({
  isActive,
  isSelected,
}: {
  isActive: boolean;
  isSelected: boolean;
}): string => {
  if (isActive) {
    return "bg-[var(--sun)]/25 font-bold text-[var(--foreground)]";
  }

  if (isSelected) {
    return "font-bold text-[var(--foreground)]";
  }

  return "text-[var(--muted)] hover:bg-[var(--sun)]/15 hover:text-[var(--foreground)]";
};

export const CitySelector = ({
  cities,
  resolvedPlaceName,
  selectedCityId,
}: CitySelectorProps) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCityId, setActiveCityId] = useState<string | null>(selectedCityId);
  const [query, setQuery] = useState(resolvedPlaceName);

  const trimmedQueryForGeocode = query.trim();

  const [geoLatch, setGeoLatch] = useState<GeoLatch | null>(null);

  useEffect(() => {
    const q = trimmedQueryForGeocode;

    if (q.length < GEOCODE_SEARCH_MIN_CHARS) {
      return undefined;
    }

    const controller = new AbortController();
    const timeoutId = window.setTimeout(() => {
      void (async () => {
        try {
          const decoded = await fetchGeocodeCitiesClient(q, {
            signal: controller.signal,
          });

          if (controller.signal.aborted || decoded === null) {
            return;
          }

          setGeoLatch({ latchQuery: q, cities: decoded });
        } catch (error: unknown) {
          if (error instanceof Error && error.name === "AbortError") {
            return;
          }
        }
      })();
    }, 280);

    return () => {
      controller.abort();
      window.clearTimeout(timeoutId);
    };
  }, [trimmedQueryForGeocode]);

  const { pinned: pinnedCatalog, rest: restCatalog } = useMemo(
    () => bucketCitiesForSelector(cities, query),
    [cities, query],
  );

  const visibleCatalogNormalizedNames = useMemo(
    () =>
      new Set(
        [...pinnedCatalog, ...restCatalog].map((cityOption) =>
          normalizeCityName(cityOption.name),
        ),
      ),
    [pinnedCatalog, restCatalog],
  );

  const geoMatchesDeduped = useMemo(() => {
    const activeQuery = trimmedQueryForGeocode;

    const remoteMatches =
      activeQuery.length < GEOCODE_SEARCH_MIN_CHARS ||
      geoLatch === null ||
      geoLatch.latchQuery !== activeQuery
        ? []
        : geoLatch.cities;

    return remoteMatches.filter(
      (place) =>
        !visibleCatalogNormalizedNames.has(normalizeCityName(place.name)),
    );
  }, [geoLatch, trimmedQueryForGeocode, visibleCatalogNormalizedNames]);

  const filteredCities = useMemo(
    () => [...pinnedCatalog, ...restCatalog, ...geoMatchesDeduped],
    [pinnedCatalog, restCatalog, geoMatchesDeduped],
  );

  const showCatalogDivider = pinnedCatalog.length > 0 && restCatalog.length > 0;
  const showGeoDivider =
    geoMatchesDeduped.length > 0 && pinnedCatalog.length + restCatalog.length > 0;

  const handleCitySelect = (city: City): void => {
    setQuery(city.name);
    setIsOpen(false);

    if (city.id !== selectedCityId) {
      startTransition(() => {
        router.push(
          buildHomeNavigationHrefFromCityId({
            resolvedCityOrGeoStringId: city.id,
          }),
        );
      });
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key === "Escape") {
      setIsOpen(false);
      setActiveCityId(selectedCityId);
      return;
    }

    if (filteredCities.length === 0) {
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      setIsOpen(true);
      setActiveCityId((currentCityId) =>
        getNextActiveCityId({
          activeCityId: currentCityId,
          cities: filteredCities,
          direction: event.key === "ArrowDown" ? "next" : "previous",
        }),
      );
      return;
    }

    if (event.key === "Enter" && isOpen) {
      const cityToSelect =
        filteredCities.find((city) => city.id === activeCityId) ?? filteredCities[0];

      event.preventDefault();
      handleCitySelect(cityToSelect);
    }
  };

  const renderCityOption = (city: City): ReactElement => {
    const isSelected = city.id === selectedCityId;
    const isActive = city.id === activeCityId;

    return (
      <button
        className={[
          "flex w-full items-start justify-between gap-3 px-4 py-3 text-left text-base font-medium transition sm:text-lg",
          getCityOptionClassName({ isActive, isSelected }),
        ].join(" ")}
        id={getCityOptionId(city.id)}
        key={city.id}
        onClick={() => handleCitySelect(city)}
        onMouseEnter={() => setActiveCityId(city.id)}
        role="option"
        aria-selected={isSelected}
        disabled={isPending}
        type="button"
      >
        <span className="flex min-w-0 flex-col items-start gap-0.5">
          <span className="truncate">{city.name}</span>
          <CityOptionAdminLine admin1={city.admin1} />
        </span>
        {isSelected ? (
          <span className="shrink-0 font-sans text-xs uppercase tracking-widest">
            scelta
          </span>
        ) : null}
      </button>
    );
  };

  return (
    <div className="relative w-full">
      <span className="ui-meta-label mb-2 block text-xs font-semibold uppercase leading-none tracking-widest">
        Scegli dove soffrire
      </span>
      <div
        aria-busy={isPending}
        className="flex w-full items-center justify-between border-b border-[var(--line)]/30 bg-transparent px-0 py-3 text-left transition hover:border-[var(--line)]/70 focus-within:border-[var(--line)]"
      >
        <input
          aria-activedescendant={isOpen && activeCityId ? getCityOptionId(activeCityId) : undefined}
          aria-autocomplete="list"
          aria-controls="city-selector-options"
          aria-expanded={isOpen}
          aria-label="Scegli città"
          className="min-w-0 flex-1 bg-transparent text-xl font-medium leading-none text-[var(--foreground)] outline-none placeholder:text-[var(--muted)] sm:text-2xl"
          onChange={(event) => {
            setQuery(event.target.value);
            setIsOpen(true);
            setActiveCityId(null);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleInputKeyDown}
          placeholder="Scrivi una città"
          role="combobox"
          type="text"
          value={query}
        />
        <span className="text-sm text-[var(--muted)]" aria-hidden="true">
          ↓
        </span>
        {isPending ? (
          <span className="sr-only" role="status">
            Caricamento città...
          </span>
        ) : null}
      </div>

      {isOpen ? (
        <div
          className="absolute left-0 right-0 top-full z-20 mt-2 max-h-[42dvh] overflow-y-auto border border-[var(--line)]/30 bg-[var(--panel)] p-1 shadow-[var(--shadow-panel)]"
          id="city-selector-options"
          role="listbox"
        >
          {filteredCities.length === 0 ? (
            <p className="px-4 py-3 text-sm font-medium text-[var(--muted)]">
              Nessuna città. Perfino il database si rifiuta.
            </p>
          ) : null}

          {pinnedCatalog.map(renderCityOption)}

          {showCatalogDivider ? <CitySelectorSectionDivider label="Altre città" /> : null}

          {restCatalog.map(renderCityOption)}

          {showGeoDivider ? (
            <CitySelectorSectionDivider label="Altri luoghi (Italia)" />
          ) : null}

          {geoMatchesDeduped.map(renderCityOption)}
        </div>
      ) : null}
    </div>
  );
};
