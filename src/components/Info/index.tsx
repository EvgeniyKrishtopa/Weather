import React from "react";
import { useWeatherContext } from "../../context/weatherContext";
import { isWeatherSuccess } from "../../types/weather";
import Loader from "../Loader";
import { ErrorWeather } from "./errorWeather";
import { WeatherComponent } from "./weather";

const weatherIcons: Record<string, string> = {
  Thunderstorm: "wi-thunderstorm",
  Drizzle: "wi-sleet",
  Rain: "wi-storm-showers",
  Snow: "wi-snow",
  Atmosphere: "wi-fog",
  Clear: "wi-day-sunny",
  Clouds: "wi-day-fog",
};

const Info = () => {
  const { loading, weather, city } = useWeatherContext();

  if (loading) {
    return (
      <div className="weather-result">
        <Loader />
      </div>
    );
  }

  if (!weather) {
    return null;
  }

  if (!isWeatherSuccess(weather)) {
    return (
      <div className="weather-result">
        <ErrorWeather currentWeather={weather} />
      </div>
    );
  }

  const weatherDescription = weather.weather[0]?.main ?? "";
  const currentIconClass = weatherIcons[weatherDescription];

  return (
    <div className="weather-result">
      <WeatherComponent
        currentCity={city}
        currentIconClass={currentIconClass}
        currentWeather={weather}
      />
    </div>
  );
};

export default Info;
