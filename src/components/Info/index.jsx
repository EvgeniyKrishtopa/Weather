import React, { useContext, useState, useEffect } from "react";
import Loader from "../Loader";
import { WeatherContext } from "../../context/weatherContext";
import { WeatherComponent } from "./weather";
import { ErrorWeather } from "./errorWeather";

const weatherIcons = {
  Thunderstorm: "wi-thunderstorm",
  Drizzle: "wi-sleet",
  Rain: "wi-storm-showers",
  Snow: "wi-snow",
  Atmosphere: "wi-fog",
  Clear: "wi-day-sunny",
  Clouds: "wi-day-fog",
};

const getCityFromStorage = () => {
  return JSON.parse(localStorage.getItem("city"));
};

const getCurrentResponseStatus = (weather = {}) => {
  return weather.cod === 200 ? true : false;
};

const Info = () => {
  const { loading, weather } = useContext(WeatherContext);
  const [responseStatus, setResponseStatus] = useState(false);
  const [currentWeather, setWeather] = useState(null);
  const [currentIconClasses, setIcon] = useState([]);
  const [currentCity, setCurrentSity] = useState("");

  useEffect(() => {
    if (weather) {
      localStorage.setItem("weather", JSON.stringify(weather));

      if (getCurrentResponseStatus(weather)) {
        setCurrentSity(getCityFromStorage());
      }
      setResponseStatus(getCurrentResponseStatus(weather));
      setWeather(weather);
    }
  }, [weather]);

  useEffect(() => {
    const localWeather = JSON.parse(localStorage.getItem("weather"));

    if (!localWeather && !getCityFromStorage()) {
      return;
    }
    setCurrentSity(getCityFromStorage());

    setResponseStatus(getCurrentResponseStatus(localWeather));
    setWeather(localWeather);
  }, []);

  useEffect(() => {
    if (currentWeather) {
      setResponseStatus(getCurrentResponseStatus(currentWeather));
      if (getCurrentResponseStatus(currentWeather)) {
        const weatherDescription = currentWeather.weather[0].main;
        setIcon([weatherIcons[weatherDescription]]);
      }
    }
  }, [currentWeather]);

  return (
    <div className="weather-result">
      {loading ? (
        <Loader />
      ) : (
        <>
          {currentWeather ? (
            responseStatus ? (
              <WeatherComponent
                currentCity={currentCity}
                currentIconClasses={currentIconClasses}
                currentWeather={currentWeather}
              />
            ) : (
              <ErrorWeather currentWeather={currentWeather} />
            )
          ) : null}
        </>
      )}
    </div>
  );
};

export default Info;
