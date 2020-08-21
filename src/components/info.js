import React, { useContext, useState, useEffect } from "react";
import Loader from "./loader";
import { WeatherContext } from "../context/weatherContext";

const weatherIcons = {
  Thunderstorm: "wi-thunderstorm",
  Drizzle: "wi-sleet",
  Rain: "wi-storm-showers",
  Snow: "wi-snow",
  Atmosphere: "wi-fog",
  Clear: "wi-day-sunny",
  Clouds: "wi-day-fog",
};

const baseIconClasses = ["wi", "wi-flip-vertical"];

const Info = () => {
  const { loading, weather } = useContext(WeatherContext);
  const [currentWeather, setWeather] = useState(null);
  const [currentIconClasses, setIcon] = useState([]);
  const [currentCity, setCurrentSity] = useState("");

  useEffect(() => {
    if (weather) {
      localStorage.setItem("weather", JSON.stringify(weather));
    }

    const localWeather = JSON.parse(localStorage.getItem("weather"));
    const city = JSON.parse(localStorage.getItem("city"));

    if (!localWeather && !city) {
      return;
    }
    setCurrentSity(city);
    setWeather(localWeather);
  }, [weather]);

  useEffect(() => {
    if (currentWeather) {
      const weatherDescription = currentWeather.weather[0].main;
      setIcon([weatherIcons[weatherDescription]]);
    }
  }, [currentWeather]);

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
                <i
                  className={baseIconClasses
                    .concat(currentIconClasses)
                    .join(" ")}
                ></i>
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
