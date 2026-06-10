import {
  isWeatherResponse,
  type WeatherError,
  type WeatherResponse,
} from "../types/weather";

const WEATHER_API_URL = "https://api.openweathermap.org/data/2.5/weather";

const createError = (message: string): WeatherError => ({
  cod: "CLIENT_ERROR",
  message,
});

export const fetchWeather = async (
  city: string,
  country: string
): Promise<WeatherResponse> => {
  const apiKey = import.meta.env.VITE_OPENWEATHER_API_KEY;

  if (!apiKey) {
    return createError("Weather API key is not configured");
  }

  const searchParams = new URLSearchParams({
    q: `${city},${country}`,
    appid: apiKey,
    units: "metric",
  });

  try {
    const response = await fetch(`${WEATHER_API_URL}?${searchParams}`);
    const data: unknown = await response.json();

    if (!isWeatherResponse(data)) {
      return createError("Weather service returned an invalid response");
    }

    return data;
  } catch {
    return createError("Unable to connect to the weather service");
  }
};
