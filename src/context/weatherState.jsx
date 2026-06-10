import React, { useReducer } from "react";
import { WeatherContext } from "./weatherContext";
import weatherReducer from "./weatherReducer";
import { GET_WEATHER, SET_LOADING } from "./types";

const WeatherState = ({ children }) => {
  const initialState = {
    weather: null,
    loading: false,
  };

  const [state, dispatch] = useReducer(weatherReducer, initialState);
  const setLoading = () => dispatch({ type: SET_LOADING });
  const Api_Key = "4f1400dc97a7e72fa59e6c3a211b7d40";

  const getWeather = async (city, country) => {
    setLoading();

    const api_call = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${Api_Key}`
    );

    const response = await api_call.json();
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
