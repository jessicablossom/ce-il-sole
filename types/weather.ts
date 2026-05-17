export type WeatherCondition =
  | "sunny"
  | "partly-cloudy"
  | "cloudy"
  | "foggy"
  | "drizzle"
  | "rainy"
  | "snowy"
  | "stormy"
  | "unknown";

export type WeatherMood = {
  condition: WeatherCondition;
  icon: "☀️" | "🌤️" | "☁️" | "🌧️" | "❄️" | "⛈️";
  answer: "Sì." | "No." | "Purtroppo no.";
  aside: string;
};

export type City = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  timeZone: string;
  sunTone?: "southern-envy";
};

export type DailyWeather = {
  date: string;
  weatherCode: number;
};

export type HourWeatherSnapshot = {
  isDay: 0 | 1;
  time: string;
  weatherCode: number;
};

/** Year-to-date counts from the archive API only (delayed window). Sunny days omitted. */
export type ArchiveWithoutSunBuckets = {
  fog: number;
  overcast: number;
  partlyCloudy: number;
  precipitation: number;
  snow: number;
};

export type WeatherReport = {
  city: City;
  currentHour: HourWeatherSnapshot | null;
  nextHour: HourWeatherSnapshot | null;
  sansSoleBucketsThisYear: ArchiveWithoutSunBuckets;
  today: DailyWeather | null;
  sunnyDaysThisYear: number;
  lastSunnyDay: string | null;
};
