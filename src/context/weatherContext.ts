import { createContext, useContext } from "react";
import type { WeatherStore } from "../store/weatherStore";

export const WeatherContext = createContext<WeatherStore | undefined>(
  undefined,
);

export const useWeatherContext = (): WeatherStore => {
  const context = useContext(WeatherContext);

  if (!context) {
    throw new Error("useWeatherContext must be used within WeatherState");
  }

  return context;
};
