import type { City, WeatherCondition, WeatherMood } from "@/types/weather";
import { isNegativeWeatherCondition } from "./weatherCodes";
import { getWeatherIconForCondition } from "./weatherIcons";

const SUNNY_ASIDES = [
  "Goditelo. Statisticamente finirà.",
  "Miracolo amministrativo.",
  "Segnalo l’anomalia alle autorità competenti.",
  "Per una volta il cielo collabora. Sospetto.",
  "Non abituarti.",
  "Una concessione temporanea.",
  "Sembra felicità, ma non firmerei nulla.",
] as const;

const SOUTHERN_SUNNY_ASIDES = [
  "Certo. Lì il sole lavora con contratto stabile.",
  "Ovviamente. Alcuni nascono con privilegi climatici.",
  "Sì, come se servisse chiederlo.",
  "Il nord prende appunti, umidamente.",
  "Una provocazione geografica.",
] as const;

const PARTLY_CLOUDY_ASIDES = [
  "Quasi felici. Ma con moderazione.",
  "Il sole c’è. La felicità resta in revisione.",
  "Una gioia parziale, quindi più credibile.",
  "Abbastanza sole da illudersi. Non esageriamo.",
  "Una giornata quasi gentile. Quasi.",
  "Sole intermittente. Speranza pure.",
  "Cielo diplomatico: concede, ma non si compromette.",
] as const;

const CLOUDY_ASIDES = [
  "Una scelta coerente.",
  "Il cielo ha messo il pilota automatico.",
  "Grigio. Originale.",
  "Niente sole, ma con grande convinzione.",
  "La tradizione continua.",
  "Una coperta umida sopra la città.",
  "Tutto regolare: malinconia diffusa.",
  "Qui non hanno rinnovato l’abbonamento solare.",
  "Il sole risulta sospeso per morosità.",
  "Luminosità disponibile nel piano premium.",
  "Il cielo offre solo la versione gratuita.",
  "Servizio solare temporaneamente non incluso.",
] as const;

export function getWeatherMoodCopy({
  city,
  condition,
  weatherCode,
}: {
  city?: City;
  condition: WeatherCondition;
  weatherCode: number;
}): WeatherMood {
  if (condition === "unknown") {
    return {
      condition,
      icon: "☁️",
      answer: "No.",
      aside: "Nemmeno il cielo vuole firmare un comunicato.",
    };
  }

  if (condition === "sunny") {
    const asides = city?.sunTone === "southern-envy" ? SOUTHERN_SUNNY_ASIDES : SUNNY_ASIDES;

    return {
      condition,
      icon: "☀️",
      answer: "Sì.",
      aside: pickAside(asides, weatherCode, city),
    };
  }

  if (condition === "partly-cloudy") {
    return {
      condition,
      icon: getWeatherIconForCondition(condition),
      answer: "Sì.",
      aside: pickAside(PARTLY_CLOUDY_ASIDES, weatherCode, city),
    };
  }

  if (isNegativeWeatherCondition(condition)) {
    return {
      condition,
      icon: getWeatherIconForCondition(condition),
      answer: "Purtroppo no.",
      aside: "Naturalmente. Che domanda.",
    };
  }

  return {
    condition: "cloudy",
    icon: getWeatherIconForCondition("cloudy"),
    answer: "No.",
    aside: pickAside(CLOUDY_ASIDES, weatherCode, city),
  };
}

function pickAside(asides: readonly string[], weatherCode: number, city?: City): string {
  const seed = `${city?.id ?? "italia"}-${weatherCode}`;
  const index =
    Array.from(seed).reduce((total, character) => total + character.charCodeAt(0), 0) %
    asides.length;

  return asides[index];
}
