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
  "Un’eccezione. Non trasformiamola in aspettativa.",
  "Sole in affitto giornaliero. Leggete bene il contratto.",
  "Luce sufficiente da non essere tristi, non felici.",
] as const;

const SOUTHERN_SUNNY_ASIDES = [
  "Certo. Lì il sole lavora con contratto stabile.",
  "Ovviamente. Alcuni nascono con privilegi climatici.",
  "Sì, come se servisse chiederlo.",
  "Il nord prende appunti, umidamente.",
  "Una provocazione geografica.",
  "Sud sereno. Nessuno è sorpreso, tranne Milano.",
  "Un classico dell’economia domestica meteorologica.",
] as const;

const PARTLY_CLOUDY_ASIDES = [
  "Quasi felici. Ma con moderazione.",
  "Il sole c’è. La felicità resta in revisione.",
  "Una gioia parziale, quindi più credibile.",
  "Abbastanza sole da illudersi. Non esageriamo.",
  "Una giornata quasi gentile. Quasi.",
  "Sole intermittente. Speranza pure.",
  "Cielo diplomatico: concede, ma non si compromette.",
  "Sommersi tra nuvola e ottimismo contenuto.",
  "Un giorno che non sceglie, e così sceglie male.",
  "Un tramonto di sole e di domande rimandate.",
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
  "Meglio degli sprazzi di sole: almeno coerenti.",
  "Un libro grigio, ma con capitoli.",
  "L’umidità porta i suoi gossip.",
  "Sole consegnato a un indirizzo sbagliato.",
] as const;

const UNKNOWN_ASIDES = [
  "Nemmeno il cielo vuole firmare un comunicato.",
  "Oggi le certezze prendono ferie anche loro.",
  "Non è giorno né notte davvero. È sospetto.",
  "La previsione è in sala d’attesa col caffè freddo.",
  "Meglio tacere: rispondere sarebbe quasi educazione civica.",
  "Chi lo sa? Intendiamo anche noi.",
] as const;

const NEGATIVE_ASIDES = [
  "Naturalmente. Che domanda.",
  "L’aria ha umidità e autocriticità.",
  "La pioggia che non cercavi, puntualità svizzera.",
  "Quando serve il sole arriva sempre in ritardo diplomatico.",
  "È quel momento rumoroso degli ombrelli in strada.",
  "Non è melodramma. È solo acqua cadendo con filosofia.",
  "La strada brillava già dalla noia prima ancora dall’umidità.",
  "Meglio dentro al bar che in parrocchia meteorologica.",
  "Chi ha inventato gli ombrelli era un pessimista pragmatico.",
  "Non è sempre il giorno migliore, ma è giorno comunque.",
  "La neve decora anche i tuoi progetti di uscita.",
  "Meglio nevicate che nevrosi meteorologiche.",
  "Un temporale quando meno vuoi prendere impegni.",
  "Acqua dall’alto: la natura lava i piatti sporcati dall’ego.",
  "Meglio essere asciutto in sogno che bagnati in filosofia.",
] as const;

type AsideSeedContext = {
  calendarDayIso?: string;
  city?: City;
};

const buildAsideSeed = (weatherCode: number, context: AsideSeedContext): string => {
  const cityKey = context.city?.id ?? "italia";
  const dayKey = context.calendarDayIso;

  if (dayKey !== undefined && dayKey.length > 0) {
    return `${dayKey}|${cityKey}|${weatherCode}`;
  }

  return `${cityKey}-${weatherCode}`;
};

const pickAside = (
  asides: readonly string[],
  weatherCode: number,
  context?: AsideSeedContext,
): string => {
  const seed = buildAsideSeed(weatherCode, context ?? {});
  const index =
    Array.from(seed).reduce((total, character) => total + character.charCodeAt(0), 0) %
    asides.length;

  return asides[index];
};

export const getWeatherMoodCopy = ({
  calendarDayIso,
  city,
  condition,
  weatherCode,
}: {
  calendarDayIso?: string;
  city?: City;
  condition: WeatherCondition;
  weatherCode: number;
}): WeatherMood => {
  const asideCtx: AsideSeedContext = {
    ...(city !== undefined ? { city } : {}),
    ...(calendarDayIso !== undefined && calendarDayIso.length > 0 ? { calendarDayIso } : {}),
  };

  if (condition === "unknown") {
    return {
      condition,
      icon: "☁️",
      answer: "No.",
      aside: pickAside(UNKNOWN_ASIDES, weatherCode, asideCtx),
    };
  }

  if (condition === "sunny") {
    const asides = city?.sunTone === "southern-envy" ? SOUTHERN_SUNNY_ASIDES : SUNNY_ASIDES;

    return {
      condition,
      icon: "☀️",
      answer: "Sì.",
      aside: pickAside(asides, weatherCode, asideCtx),
    };
  }

  if (condition === "partly-cloudy") {
    return {
      condition,
      icon: getWeatherIconForCondition(condition),
      answer: "Sì.",
      aside: pickAside(PARTLY_CLOUDY_ASIDES, weatherCode, asideCtx),
    };
  }

  if (isNegativeWeatherCondition(condition)) {
    return {
      condition,
      icon: getWeatherIconForCondition(condition),
      answer: "Purtroppo no.",
      aside: pickAside(NEGATIVE_ASIDES, weatherCode, asideCtx),
    };
  }

  return {
    condition: "cloudy",
    icon: getWeatherIconForCondition("cloudy"),
    answer: "No.",
    aside: pickAside(CLOUDY_ASIDES, weatherCode, asideCtx),
  };
};
