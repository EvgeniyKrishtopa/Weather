import React, { useState, useEffect } from "react";
import Loader from "../Loader";
import { useWeatherContext } from "../../context/weatherContext";
import { WeatherComponent } from "./weather";
import { ErrorWeather } from "./errorWeather";
import {
  isWeatherSuccess,
  type WeatherResponse,
} from "../../types/weather";

const weatherIcons: Record<string, string> = {
  Thunderstorm: "wi-thunderstorm",
  Drizzle: "wi-sleet",
  Rain: "wi-storm-showers",
  Snow: "wi-snow",
  Atmosphere: "wi-fog",
  Clear: "wi-day-sunny",
  Clouds: "wi-day-fog",
};

const getCityFromStorage = (): string => {
  const city = localStorage.getItem("city");
  return city ? (JSON.parse(city) as string) : "";
};

const getWeatherFromStorage = (): WeatherResponse | null => {
  const weather = localStorage.getItem("weather");
  return weather ? (JSON.parse(weather) as WeatherResponse) : null;
};

const Info = () => {
  const { loading, weather } = useWeatherContext();
  const [responseStatus, setResponseStatus] = useState(false);
  const [currentWeather, setWeather] = useState<WeatherResponse | null>(null);
  const [currentIconClasses, setIcon] = useState<string[]>([]);
  const [currentCity, setCurrentSity] = useState("");

  useEffect(() => {
    if (weather) {
      localStorage.setItem("weather", JSON.stringify(weather));

      if (isWeatherSuccess(weather)) {
        setCurrentSity(getCityFromStorage());
      }
      setResponseStatus(isWeatherSuccess(weather));
      setWeather(weather);
    }
  }, [weather]);

  useEffect(() => {
    const localWeather = getWeatherFromStorage();

    if (!localWeather && !getCityFromStorage()) {
      return;
    }
    setCurrentSity(getCityFromStorage());

    setResponseStatus(localWeather ? isWeatherSuccess(localWeather) : false);
    setWeather(localWeather);
  }, []);

  useEffect(() => {
    if (currentWeather) {
      setResponseStatus(isWeatherSuccess(currentWeather));
      if (isWeatherSuccess(currentWeather)) {
        const weatherDescription = currentWeather.weather[0].main;
        const icon = weatherIcons[weatherDescription];
        setIcon(icon ? [icon] : []);
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
            responseStatus && isWeatherSuccess(currentWeather) ? (
              <WeatherComponent
                currentCity={currentCity}
                currentIconClasses={currentIconClasses}
                currentWeather={currentWeather}
              />
            ) : (
              !isWeatherSuccess(currentWeather) && (
                <ErrorWeather currentWeather={currentWeather} />
              )
            )
          ) : null}
        </>
      )}
    </div>
  );
};

export default Info;
