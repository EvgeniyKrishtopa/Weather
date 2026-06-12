import React, { useReducer, type ReactNode } from "react";
import { fetchWeather } from "../api/weatherApi";
import { isWeatherSuccess } from "../types/weather";
import { loadStoredWeather, saveStoredWeather } from "../utils/weatherStorage";
import { WeatherContext } from "./weatherContext";
import weatherReducer, { type WeatherStateValue } from "./weatherReducer";

interface WeatherStateProps {
  children: ReactNode;
}

const createInitialState = (): WeatherStateValue => {
  const storedWeather = loadStoredWeather();

  return {
    weather: storedWeather?.weather ?? null,
    city: storedWeather?.city ?? "",
    loading: false,
  };
};

const WeatherState = ({ children }: WeatherStateProps) => {
  const [state, dispatch] = useReducer(
    weatherReducer,
    undefined,
    createInitialState,
  );

  const getWeather = async (city: string, country: string): Promise<void> => {
    dispatch({ type: "requestStarted" });

    const response = await fetchWeather(city, country);
    const resolvedCity = isWeatherSuccess(response) ? response.name : city;

    if (isWeatherSuccess(response)) {
      saveStoredWeather({ city: resolvedCity, weather: response });
    }

    dispatch({
      type: "requestCompleted",
      payload: response,
      city: resolvedCity,
    });
  };

  const { weather, city, loading } = state;

  return (
    <WeatherContext.Provider value={{ getWeather, weather, city, loading }}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherState;
