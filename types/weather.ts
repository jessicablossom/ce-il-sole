export type WeatherCondition =
  | "sunny"
  | "cloudy"
  | "foggy"
  | "drizzle"
  | "rainy"
  | "snowy"
  | "stormy"
  | "unknown";

export type WeatherMood = {
  condition: WeatherCondition;
  icon: "☀️" | "☁️" | "🌧️" | "❄️" | "⛈️";
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

export type WeatherReport = {
  city: City;
  today: DailyWeather | null;
  sunnyDaysThisYear: number;
  lastSunnyDay: string | null;
};
