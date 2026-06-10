import React from "react";
import type { WeatherSuccess } from "../../types/weather";

const baseIconClasses = ["wi", "wi-flip-vertical"];

interface WeatherComponentProps {
  currentCity: string;
  currentWeather: WeatherSuccess;
  currentIconClasses: string[];
}

export const WeatherComponent = ({
  currentCity,
  currentWeather,
  currentIconClasses,
}: WeatherComponentProps) => {
  return (
    <>
      {currentWeather && currentCity && (
        <>
          <h3>{currentCity}</h3>
          <p className="tepmeratureAverege">
            Temperature:&nbsp;
            {(currentWeather.main.temp - 273.15).toFixed(2)}&nbsp;C&deg;
          </p>
          <p className="weather-description">
            <i
              className={baseIconClasses.concat(currentIconClasses).join(" ")}
            ></i>
            {currentWeather.weather[0].main}
          </p>
          <p className="wind">
            Wind speed:&nbsp;{currentWeather.wind.speed}km/h
          </p>
          <p className="wind">Humidity:&nbsp;{currentWeather.main.humidity}%</p>
        </>
      )}
    </>
  );
};
