import type { GeocodeSearchHit } from "@/lib/openMeteoGeocode";
import type { City } from "@/types/weather";

const DEFAULT_ZONE = "Europe/Rome";

export const geocodeSearchHitToCity = (hit: GeocodeSearchHit): City => ({
  id: String(hit.id),
  latitude: hit.latitude,
  longitude: hit.longitude,
  name: hit.name,
  timeZone: hit.timezone?.trim() ? hit.timezone : DEFAULT_ZONE,
  ...(typeof hit.admin1 === "string" && hit.admin1.trim() !== ""
    ? { admin1: hit.admin1.trim() }
    : {}),
});
