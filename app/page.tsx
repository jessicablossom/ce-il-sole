import { AnnualStats } from "@/components/AnnualStats";
import { CitySelector } from "@/components/CitySelector";
import { Layout } from "@/components/Layout";
import { LieCta } from "@/components/LieCta";
import { NightDisplay } from "@/components/NightDisplay";
import { WeatherDisplay } from "@/components/WeatherDisplay";
import { WeatherUnavailable } from "@/components/WeatherUnavailable";
import { CITIES, DEFAULT_CITY_ID, getCityById } from "@/lib/cities";
import { isNightInCentralEurope } from "@/lib/dayPeriod";
import { formatItalianDate } from "@/lib/utils";
import { getWeatherConditionFromCode, getWeatherReport } from "@/lib/weather";
import { getPreviewWeatherCode, isSunLiePreview } from "@/lib/weatherPreview";

type HomeProps = {
  searchParams: Promise<{
    city?: string | string[];
    preview?: string | string[];
  }>;
};

export default async function Home({ searchParams }: HomeProps) {
  const query = await searchParams;
  const selectedCityParam = query.city;
  const previewParam = getSingleQueryParam(query.preview);
  const previewWeatherCode = getPreviewWeatherCode(previewParam);
  const isPreview = previewWeatherCode !== null;
  const selectedCityId =
    typeof selectedCityParam === "string" ? selectedCityParam : DEFAULT_CITY_ID;
  const city = getCityById(selectedCityId);
  const today = new Date();
  const todayLabel = formatItalianDate(today, city.timeZone);
  const isNight = isPreview ? false : isNightInCentralEurope(today);
  const weatherReport = await getReportOrNull(city, today);
  const weatherCode = previewWeatherCode ?? weatherReport?.today?.weatherCode ?? null;
  const weatherCondition = isNight ? "unknown" : getWeatherConditionFromCode(weatherCode);

  return (
    <Layout weatherCondition={weatherCondition}>
      <header className="shrink-0 px-0 lg:px-[20%]">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row">
          <div className="min-w-0">
            <p className="mb-2 whitespace-nowrap text-[0.65rem] font-semibold uppercase tracking-[0.42em] text-[var(--muted)]">
              La previsione più inutile d’Italia.
            </p>
            <h1 className="whitespace-nowrap font-serif text-4xl leading-none tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              C’è il sole?
            </h1>
          </div>
          <div className="min-w-0 self-end text-right">
            <p className="ui-meta-label whitespace-nowrap">
              {city.name}
            </p>
            <p className="ui-meta-value mt-2 whitespace-nowrap">
              {todayLabel}
            </p>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col px-0 pt-7 lg:px-[20%] lg:pt-9">
        <CitySelector key={city.id} cities={CITIES} selectedCityId={city.id} />

        {isNight ? (
          <>
            <NightDisplay city={city} weatherCode={weatherReport?.today?.weatherCode ?? null} />
            {weatherReport ? (
              <AnnualStats
                cityName={weatherReport.city.name}
                lastSunnyDay={weatherReport.lastSunnyDay}
                sunnyDaysThisYear={weatherReport.sunnyDaysThisYear}
                timeZone={weatherReport.city.timeZone}
              />
            ) : null}
          </>
        ) : isPreview || weatherReport ? (
          <>
            <WeatherDisplay
              city={city}
              weatherCode={weatherCode}
            >
              {weatherReport && !isPreview ? (
                <AnnualStats
                  cityName={weatherReport.city.name}
                  lastSunnyDay={weatherReport.lastSunnyDay}
                  sunnyDaysThisYear={weatherReport.sunnyDaysThisYear}
                  timeZone={weatherReport.city.timeZone}
                />
              ) : null}
            </WeatherDisplay>
          </>
        ) : (
          <WeatherUnavailable />
        )}
      </div>
      <LieCta isLying={isSunLiePreview(previewParam)} selectedCityId={city.id} />
    </Layout>
  );
}

async function getReportOrNull(
  city: Parameters<typeof getWeatherReport>[0],
  today: Date,
) {
  try {
    return await getWeatherReport(city, today);
  } catch (error) {
    if (process.env.NODE_ENV === "production") {
      console.error("Weather report unavailable");
    } else {
      console.error("Weather report unavailable", error);
    }

    return null;
  }
}

function getSingleQueryParam(param: string | string[] | undefined): string | null {
  if (typeof param === "string") {
    return param;
  }

  return param?.[0] ?? null;
}

