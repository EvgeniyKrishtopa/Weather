import React from "react";
import type { WeatherSuccess } from "../../types/weather";

const baseIconClasses = ["wi", "wi-flip-vertical"];

interface WeatherComponentProps {
  currentCity: string;
  currentWeather: WeatherSuccess;
  currentIconClass?: string;
}

export const WeatherComponent = ({
  currentCity,
  currentWeather,
  currentIconClass,
}: WeatherComponentProps) => {
  const weatherDescription = currentWeather.weather[0]?.main ?? "";
  const iconClasses = currentIconClass
    ? [...baseIconClasses, currentIconClass]
    : baseIconClasses;

  return (
    <>
      <h3>{currentCity}</h3>
      <p className="temperature-average">
        Temperature:&nbsp;{currentWeather.main.temp.toFixed(1)}&nbsp;&deg;C
      </p>
      <p className="weather-description">
        <i className={iconClasses.join(" ")} aria-hidden="true" />
        {weatherDescription}
      </p>
      <p className="wind">
        Wind speed:&nbsp;{currentWeather.wind.speed}&nbsp;m/s
      </p>
      <p className="wind">Humidity:&nbsp;{currentWeather.main.humidity}%</p>
    </>
  );
};
