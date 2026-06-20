import {
  COUNTRY_ISO_PATTERN,
  OPENWEATHER_API_KEY_ENV,
  OPENWEATHER_REVERSE_GEOCODING_LIMIT,
} from "../../constants";
import { OPENWEATHER_REVERSE_GEOCODING_API_URL } from "../../urls";

interface ReverseGeocodingLocation {
  country: string;
}

const isReverseGeocodingLocation = (
  value: unknown,
): value is ReverseGeocodingLocation =>
  !!value &&
  typeof value === "object" &&
  "country" in value &&
  typeof value.country === "string" &&
  COUNTRY_ISO_PATTERN.test(value.country);

export const fetchCountryIsoByCoordinates = async (
  latitude: number,
  longitude: number,
  signal?: AbortSignal,
): Promise<string | null> => {
  const apiKey = import.meta.env[OPENWEATHER_API_KEY_ENV];

  if (!apiKey) {
    return null;
  }

  const searchParams = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    limit: OPENWEATHER_REVERSE_GEOCODING_LIMIT,
    appid: apiKey,
  });

  try {
    const response = await fetch(
      `${OPENWEATHER_REVERSE_GEOCODING_API_URL}?${searchParams}`,
      { signal },
    );
    const data: unknown = await response.json();

    if (
      !response.ok ||
      !Array.isArray(data) ||
      !isReverseGeocodingLocation(data[0])
    ) {
      return null;
    }

    return data[0].country;
  } catch {
    return null;
  }
};
