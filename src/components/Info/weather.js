import React from "react";

const baseIconClasses = ["wi", "wi-flip-vertical"];

export const WeatherComponent = ({
  currentCity,
  currentWeather,
  currentIconClasses,
}) => {
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
