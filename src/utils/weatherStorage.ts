import {
  isWeatherResponse,
  isWeatherSuccess,
  type WeatherSuccess,
} from "../types/weather";

const STORAGE_KEY = "weather-app:last-weather";

export interface StoredWeather {
  city: string;
  weather: WeatherSuccess;
}

export const loadStoredWeather = (): StoredWeather | null => {
  try {
    const serializedWeather = localStorage.getItem(STORAGE_KEY);

    if (!serializedWeather) {
      return null;
    }

    const value: unknown = JSON.parse(serializedWeather);

    if (
      !value ||
      typeof value !== "object" ||
      !("city" in value) ||
      !("weather" in value)
    ) {
      return null;
    }

    const storedWeather = value as Record<string, unknown>;

    if (
      typeof storedWeather.city !== "string" ||
      !isWeatherResponse(storedWeather.weather) ||
      !isWeatherSuccess(storedWeather.weather)
    ) {
      return null;
    }

    return {
      city: storedWeather.city,
      weather: storedWeather.weather,
    };
  } catch {
    return null;
  }
};

export const saveStoredWeather = (weather: StoredWeather): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(weather));
  } catch {
    // Caching is optional; weather requests should still complete without it.
  }
};
