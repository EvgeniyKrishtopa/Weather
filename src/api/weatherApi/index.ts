import {
  isWeatherResponse,
  type WeatherError,
  type WeatherResponse,
} from "../../types/weather";
import { OPENWEATHER_API_KEY_ENV, OPENWEATHER_UNITS } from "../../constants";
import { OPENWEATHER_WEATHER_API_URL } from "../../urls";

const createError = (message: string): WeatherError => ({
  cod: "CLIENT_ERROR",
  message,
});

export const fetchWeather = async (
  city: string,
  country: string,
  signal?: AbortSignal,
): Promise<WeatherResponse> => {
  const apiKey = import.meta.env[OPENWEATHER_API_KEY_ENV];

  if (!apiKey) {
    return createError("Weather API key is not configured");
  }

  const searchParams = new URLSearchParams({
    q: `${city},${country}`,
    appid: apiKey,
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
      return createError("Weather service returned an invalid response");
    }

    return data;
  } catch (error) {
    if (signal?.aborted) {
      throw error;
    }

    return createError("Unable to connect to the weather service");
  }
};
