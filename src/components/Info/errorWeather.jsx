import React from "react";

export const ErrorWeather = ({ currentWeather }) => {
  return <p className="notification-request">{`${currentWeather.message}!`}</p>;
};
