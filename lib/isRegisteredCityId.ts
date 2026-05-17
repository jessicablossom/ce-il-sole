import { type CityId, CITIES } from "./cities";

const CITY_IDS: ReadonlySet<string> = new Set(CITIES.map((city) => city.id));

export const isRegisteredCityId = (value: string): value is CityId => CITY_IDS.has(value);
