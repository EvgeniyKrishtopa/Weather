import {
  isWeatherResponse,
  type WeatherError,
  type WeatherResponse,
} from "../../types/weather";
import { OPENWEATHER_API_KEY_ENV, OPENWEATHER_UNITS } from "../../constants";
import {
  DEFAULT_LANGUAGE,
  getTranslation,
  type SupportedLanguage,
} from "../../i18n";
import { OPENWEATHER_WEATHER_API_URL } from "../../urls";

const createError = (message: string): WeatherError => ({
  cod: "CLIENT_ERROR",
  message,
});

export const fetchWeather = async (
  city: string,
  country: string,
  language: SupportedLanguage = DEFAULT_LANGUAGE,
  signal?: AbortSignal,
): Promise<WeatherResponse> => {
  const apiKey = import.meta.env[OPENWEATHER_API_KEY_ENV];
  const t = getTranslation(language);

  if (!apiKey) {
    return createError(t.errors.weatherApiKeyMissing);
  }

  const searchParams = new URLSearchParams({
    q: `${city},${country}`,
    appid: apiKey,
    lang: language,
    units: OPENWEATHER_UNITS,
  });

  try {
    const response = await fetch(
      `${OPENWEATHER_WEATHER_API_URL}?${searchParams}`,
      {
        signal,
      },
    );
    const data: unknown = await response.json();

    if (!isWeatherResponse(data)) {
      return createError(t.errors.weatherInvalidResponse);
    }

    return data;
  } catch (error) {
    if (signal?.aborted) {
      throw error;
    }

    return createError(t.errors.unableToConnectWeather);
  }
};
