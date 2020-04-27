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
  const Api_Key = "95079fc224359f82d94b0295009b31f4";

  const getWeather = async (city, country) => {
    setLoading();

    const api_call = await fetch(
      `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${Api_Key}`
    );

    const response = await api_call.json();
    dispatch({
      type: GET_WEATHER,
      payload: response,
    });
  };

  const setLoading = () => dispatch({ type: SET_LOADING });
  const { weather, loading } = state;

  return (
    <WeatherContext.Provider value={{ getWeather, weather, loading }}>
      {children}
    </WeatherContext.Provider>
  );
};

export default WeatherState;
