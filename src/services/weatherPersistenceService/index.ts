import type { StoredLocation } from "../../types/location";
import type { StoredWeather } from "../../types/weather";
import {
  loadStoredLocation,
  saveStoredLocation,
} from "../../utils/locationStorage";
import {
  clearStoredWeather,
  loadStoredWeather,
  saveStoredWeather,
} from "../../utils/weatherStorage";

export const weatherPersistenceService = {
  clearStoredWeather,
  loadStoredLocation,
  loadStoredWeather,
  saveStoredLocation(location: StoredLocation): void {
    saveStoredLocation(location);
  },
  saveStoredWeather(weather: StoredWeather): void {
    saveStoredWeather(weather);
  },
};

export type WeatherPersistenceService = typeof weatherPersistenceService;
