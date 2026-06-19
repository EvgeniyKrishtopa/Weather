import {
  isWeatherResponse,
  isWeatherSuccess,
  type StoredWeather,
} from "../../types/weather";
import { LAST_WEATHER_STORAGE_KEY } from "../../constants";

export const loadStoredWeather = (): StoredWeather | null => {
  try {
    const serializedWeather = localStorage.getItem(LAST_WEATHER_STORAGE_KEY);

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
    localStorage.setItem(LAST_WEATHER_STORAGE_KEY, JSON.stringify(weather));
  } catch {
    // Caching is optional; weather requests should still complete without it.
  }
};

export const clearStoredWeather = (): void => {
  try {
    localStorage.removeItem(LAST_WEATHER_STORAGE_KEY);
  } catch {
    // Cache cleanup is optional and must not block user interaction.
  }
};
