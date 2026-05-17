import type { Metadata } from "next";
import { AnnualStats } from "@/components/AnnualStats";
import { CitySelector } from "@/components/CitySelector";
import { Layout } from "@/components/Layout";
import { LieCta } from "@/components/LieCta";
import { NightDisplay } from "@/components/NightDisplay";
import { WeatherDisplay } from "@/components/WeatherDisplay";
import { WeatherFavicon } from "@/components/WeatherFavicon";
import { SiteFooter } from "@/components/SiteFooter";
import { WeatherUnavailable } from "@/components/WeatherUnavailable";
import { CITIES, DEFAULT_CITY_ID, getCityById } from "@/lib/cities";
import { isNightInCentralEurope } from "@/lib/dayPeriod";
import { buildCanonicalHomeUrl } from "@/lib/buildCanonicalHomeUrl";
import { getFirstQueryValue } from "@/lib/getFirstQueryValue";
import { formatItalianDate } from "@/lib/utils";
import { getWeatherConditionFromCode, getWeatherReport } from "@/lib/weather";
import { getNextHourOutlookNote } from "@/lib/nextHourHint";
import { getPreviewWeatherCode, isSunLiePreview } from "@/lib/weatherPreview";

type HomeProps = {
  searchParams: Promise<{
    city?: string | string[];
    meteoSegreto?: string | string[];
    preview?: string | string[];
  }>;
};

export const generateMetadata = async ({
  searchParams,
}: HomeProps): Promise<Metadata> => {
  const query = await searchParams;
  const canonical = buildCanonicalHomeUrl(query);

  return {
    alternates: { canonical },
    openGraph: { url: canonical },
  };
};

const getReportOrNull = async (
  city: Parameters<typeof getWeatherReport>[0],
  today: Date,
) => {
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
};

export const Home = async ({ searchParams }: HomeProps) => {
  const query = await searchParams;
  const selectedCityParam = query.city;
  const previewParam = getFirstQueryValue(query.preview);
  const secretPreviewParam = getFirstQueryValue(query.meteoSegreto);
  const publicPreviewWeatherCode = getPreviewWeatherCode(previewParam);
  const secretPreviewWeatherCode = getPreviewWeatherCode(secretPreviewParam);
  const previewWeatherCode = secretPreviewWeatherCode ?? publicPreviewWeatherCode;
  const isPublicPreview = publicPreviewWeatherCode !== null;
  const isSecretPreview = secretPreviewWeatherCode !== null;
  const isPreview = isPublicPreview || isSecretPreview;
  const selectedCityId =
    typeof selectedCityParam === "string" ? selectedCityParam : DEFAULT_CITY_ID;
  const city = getCityById(selectedCityId);
  const today = new Date();
  const todayLabel = formatItalianDate(today, city.timeZone);
  const weatherReport = await getReportOrNull(city, today);
  const currentHourSnapshot = weatherReport?.currentHour ?? null;
  const hasHourSnapshot = currentHourSnapshot !== null;
  const hourlyWeatherCode = currentHourSnapshot?.weatherCode ?? null;
  const dailyWeatherCode = weatherReport?.today?.weatherCode ?? null;
  const liveActualWeatherCode = hourlyWeatherCode ?? dailyWeatherCode;
  const isNight =
    !isPreview &&
    (hasHourSnapshot ? currentHourSnapshot.isDay === 0 : isNightInCentralEurope(today));
  const nightRecapWeatherCode = dailyWeatherCode ?? hourlyWeatherCode;
  const truthfulCondition = getWeatherConditionFromCode(liveActualWeatherCode);
  const weatherCode = previewWeatherCode ?? liveActualWeatherCode;
  const weatherCondition = isNight ? "unknown" : getWeatherConditionFromCode(weatherCode);
  const faviconCondition = getWeatherConditionFromCode(weatherCode);
  const isLying = isSunLiePreview(previewParam);
  const shouldShowLieCta =
    !isSecretPreview &&
    (isLying || (truthfulCondition !== "sunny" && truthfulCondition !== "unknown"));
  const nextHourOutlookNote =
    !isPreview && hourlyWeatherCode !== null && weatherReport?.nextHour
      ? getNextHourOutlookNote(hourlyWeatherCode, weatherReport.nextHour.weatherCode)
      : null;

  return (
    <Layout weatherCondition={weatherCondition}>
      <WeatherFavicon condition={faviconCondition} />
      <header className="shrink-0 px-0 lg:px-[20%]">
        <div className="flex flex-col items-start justify-between gap-5 sm:flex-row">
          <div className="min-w-0">
            <p className="ui-meta-label mb-2 whitespace-nowrap text-xs font-semibold uppercase leading-none tracking-widest">
              La previsione più inutile d’Italia.
            </p>
            <h1 className="whitespace-nowrap font-serif text-4xl leading-none tracking-tighter sm:text-6xl lg:text-7xl">
              C’è il sole?
            </h1>
          </div>
          <div className="min-w-0 self-end text-right">
            <p className="ui-meta-label whitespace-nowrap text-xs font-semibold uppercase leading-none tracking-widest">
              {city.name}
            </p>
            <p className="ui-meta-value mt-2 whitespace-nowrap text-sm font-medium leading-snug">
              {todayLabel}
            </p>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col gap-8 px-0 pt-7 sm:gap-10 lg:px-[20%] lg:pt-9">
        <CitySelector key={city.id} cities={CITIES} selectedCityId={city.id} />

        {isNight ? (
          <>
            <NightDisplay city={city} weatherCode={nightRecapWeatherCode} />
            {weatherReport ? (
              <AnnualStats
                cityName={weatherReport.city.name}
                lastSunnyDay={weatherReport.lastSunnyDay}
                sansSoleBucketsThisYear={weatherReport.sansSoleBucketsThisYear}
                sunnyDaysThisYear={weatherReport.sunnyDaysThisYear}
                timeZone={weatherReport.city.timeZone}
              />
            ) : null}
          </>
        ) : isPreview || weatherReport ? (
          <>
            <WeatherDisplay
              city={city}
              nextHourOutlookNote={nextHourOutlookNote}
              showShareCard={!isPublicPreview}
              weatherCode={weatherCode}
            >
              {weatherReport && !isPreview ? (
                <AnnualStats
                  cityName={weatherReport.city.name}
                  lastSunnyDay={weatherReport.lastSunnyDay}
                  sansSoleBucketsThisYear={weatherReport.sansSoleBucketsThisYear}
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
      {shouldShowLieCta ? <LieCta isLying={isLying} selectedCityId={city.id} /> : null}
      <SiteFooter />
    </Layout>
  );
};

export default Home;
