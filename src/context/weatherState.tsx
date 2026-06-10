import React, { useReducer, type ReactNode } from "react";
import { WeatherContext } from "./weatherContext";
import weatherReducer, { type WeatherStateValue } from "./weatherReducer";
import { GET_WEATHER, SET_LOADING } from "./types";
import type { WeatherResponse } from "../types/weather";

interface WeatherStateProps {
  children: ReactNode;
}

const WeatherState = ({ children }: WeatherStateProps) => {
  const initialState: WeatherStateValue = {
    weather: null,
    loading: false,
  };

  const [state, dispatch] = useReducer(weatherReducer, initialState);
  const setLoading = () => dispatch({ type: SET_LOADING });
  const Api_Key = "4f1400dc97a7e72fa59e6c3a211b7d40";

  const getWeather = async (city: string, country: string): Promise<void> => {
    setLoading();

    const api_call = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${Api_Key}`
    );

    const response = (await api_call.json()) as WeatherResponse;
    dispatch({
      type: GET_WEATHER,
      payload: response,
    });
  };

  const { weather, loading } = state;

  return (
    <WeatherContext.Provider value={{ getWeather, weather, loading }}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherState;
