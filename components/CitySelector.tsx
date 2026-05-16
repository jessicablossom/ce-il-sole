"use client";

import { useRouter } from "next/navigation";
import { type KeyboardEvent, useMemo, useState } from "react";
import { filterCitiesByQuery, getNextActiveCityId } from "@/lib/citySearch";
import type { City } from "@/types/weather";

type CitySelectorProps = {
  cities: readonly City[];
  selectedCityId: string;
};

export function CitySelector({ cities, selectedCityId }: CitySelectorProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [activeCityId, setActiveCityId] = useState<string | null>(selectedCityId);
  const selectedCity = cities.find((city) => city.id === selectedCityId) ?? cities[0];
  const [query, setQuery] = useState(selectedCity.name);
  const filteredCities = useMemo(() => filterCitiesByQuery(cities, query), [cities, query]);

  function handleCitySelect(cityId: string) {
    const nextCity = cities.find((city) => city.id === cityId);

    if (nextCity) {
      setQuery(nextCity.name);
    }

    setIsOpen(false);
    router.push(`/?city=${cityId}`);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
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
      handleCitySelect(cityToSelect.id);
    }
  }

  return (
    <div className="relative w-full">
      <span className="ui-meta-label mb-2 block text-xs font-semibold uppercase leading-none tracking-widest">
        Scegli dove soffrire
      </span>
      <div
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

          {filteredCities.map((city) => {
            const isSelected = city.id === selectedCityId;
            const isActive = city.id === activeCityId;

            return (
              <button
                className={[
                  "flex w-full items-center justify-between px-4 py-3 text-left text-base font-medium transition sm:text-lg",
                  getCityOptionClassName({ isActive, isSelected }),
                ].join(" ")}
                id={getCityOptionId(city.id)}
                key={city.id}
                onClick={() => handleCitySelect(city.id)}
                onMouseEnter={() => setActiveCityId(city.id)}
                role="option"
                aria-selected={isSelected}
                type="button"
              >
                {city.name}
                {isSelected ? (
                  <span className="font-sans text-xs uppercase tracking-widest">
                    scelta
                  </span>
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

function getCityOptionId(cityId: string): string {
  return `city-option-${cityId}`;
}

function getCityOptionClassName({
  isActive,
  isSelected,
}: {
  isActive: boolean;
  isSelected: boolean;
}): string {
  if (isActive) {
    return "bg-[var(--sun)]/25 font-bold text-[var(--foreground)]";
  }

  if (isSelected) {
    return "font-bold text-[var(--foreground)]";
  }

  return "text-[var(--muted)] hover:bg-[var(--sun)]/15 hover:text-[var(--foreground)]";
}
