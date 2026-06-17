const REVERSE_GEOCODING_API_URL =
  "https://api.openweathermap.org/geo/1.0/reverse";

const COUNTRY_ISO_PATTERN = /^[A-Z]{2}$/;

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
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  if (!apiKey) {
    return null;
  }

  const searchParams = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
    limit: "1",
    appid: apiKey,
  });

  try {
    const response = await fetch(
      `${REVERSE_GEOCODING_API_URL}?${searchParams}`,
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
