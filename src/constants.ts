import { ConsoleLevel } from "./types/console";

export const DEFAULT_COUNTRY_ISO = "US";
export const COUNTRY_ISO_PATTERN = /^[A-Z]{2}$/;

export const OPENWEATHER_API_KEY_ENV = "VITE_OPENWEATHER_API_KEY";
export const OUTFIT_RECOMMENDATION_API_URL_ENV =
  "VITE_OUTFIT_RECOMMENDATION_API_URL";
export const OPENWEATHER_UNITS = "metric";
export const OPENWEATHER_REVERSE_GEOCODING_LIMIT = "1";

export const SELECTED_LOCATION_STORAGE_KEY = "weather-app:selected-location";
export const LAST_WEATHER_STORAGE_KEY = "weather-app:last-weather";

export const CONSOLE_LEVEL_VALUES = Object.values(ConsoleLevel);
export const DEFAULT_CONSOLE_LEVEL = ConsoleLevel.Log;
