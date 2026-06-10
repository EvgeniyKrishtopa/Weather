import React from "react";
import type { WeatherError } from "../../types/weather";

interface ErrorWeatherProps {
  currentWeather: WeatherError;
}

export const ErrorWeather = ({ currentWeather }: ErrorWeatherProps) => {
  return (
    <p className="notification-request" role="alert">
      {currentWeather.message}
    </p>
  );
};
