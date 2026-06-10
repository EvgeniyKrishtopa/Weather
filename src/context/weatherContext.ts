import { createContext, useContext } from "react";
import type { WeatherResponse } from "../types/weather";

interface WeatherContextValue {
  getWeather: (city: string, country: string) => Promise<void>;
  weather: WeatherResponse | null;
  loading: boolean;
}

export const WeatherContext = createContext<WeatherContextValue | undefined>(
  undefined
);

export const useWeatherContext = (): WeatherContextValue => {
  const context = useContext(WeatherContext);

  if (!context) {
    throw new Error("useWeatherContext must be used within WeatherState");
  }

  return context;
};
