import React, { useContext, useState, useEffect } from "react";
import Loader from "./loader";
import { WeatherContext } from "../context/weatherContext";

const Info = () => {
  const { loading, weather } = useContext(WeatherContext);
  debugger;
  const [currentWeather, setWeather] = useState(null);

  const weatherIcons = {
    Thunderstorm: "wi-thunderstorm",
    Drizzle: "wi-sleet",
    Rain: "wi-storm-showers",
    Snow: "wi-snow",
    Atmosphere: "wi-fog",
    Clear: "wi-day-sunny",
    Clouds: "wi-day-fog",
  };

  const [currentIconClasses, setIcon] = useState(["wi", "wi-flip-vertical"]);

  useEffect(() => {
    if (weather) {
      localStorage.setItem("weather", JSON.stringify(weather));
    }
  }, [weather]);

  useEffect(() => {
    const currentWeather = JSON.parse(localStorage.getItem("weather"));

    if (currentWeather) {
      const weatherDescription = currentWeather.weather[0].main;

      switch (weatherDescription) {
        case "Thunderstorm":
          setIcon([...currentIconClasses, weatherIcons.Thunderstorm]);
          break;

        case "Drizzle":
          setIcon([...currentIconClasses, weatherIcons.Drizzle]);
          break;

        case "Rain":
          setIcon([...currentIconClasses, weatherIcons.Rain]);
          break;

        case "Snow":
          setIcon([...currentIconClasses, weatherIcons.Snow]);
          break;

        case "Atmosphere":
          setIcon(...currentIconClasses, [weatherIcons.Atmosphere]);
          break;

        case "Clear":
          setIcon([...currentIconClasses, weatherIcons.Clear]);
          break;

        case "Clouds":
          setIcon([...currentIconClasses, weatherIcons.Clouds]);
          break;

        default:
          break;
      }
    }

    setWeather(currentWeather);
  }, [weather]);

  const currentCity = JSON.parse(localStorage.getItem("city"));

  return (
    <div className="weather-result">
      {loading ? (
        <Loader />
      ) : (
        <div>
          {currentWeather ? (
            <div>
              <h3>{currentCity}</h3>
              <p className="tepmeratureAverege">
                Temperature:&nbsp;
                {(currentWeather.main.temp - 273.15).toFixed(2)}&nbsp;C&deg;
              </p>
              <p className="weather-description">
                <i className={currentIconClasses.join(" ")}></i>
                {currentWeather.weather[0].main}
              </p>
              <p className="wind">
                Wind speed:&nbsp;{currentWeather.wind.speed}km/h
              </p>
              <p className="wind">
                Humidity:&nbsp;{currentWeather.main.humidity}%
              </p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default Info;
