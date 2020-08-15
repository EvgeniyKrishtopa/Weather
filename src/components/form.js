import React, { useContext, useState, useRef } from "react";
import { WeatherContext } from "../context/weatherContext";
import { currentDate } from "./currentDate";

const Form = () => {
  const refNotification = useRef();
  const { getWeather } = useContext(WeatherContext);

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const formSubmit = (event) => {
    event.preventDefault();
    event.target.reset();

    if (country && city) {
      getWeather(country, city);
      localStorage.setItem("city", JSON.stringify(city));
      setCountry("");
      setCity("");
      refNotification.current.style.opacity = "0";
    } else {
      refNotification.current.style.opacity = "1";
      localStorage.clear();
    }
  };

  return (
    <div className="container">
      <h1>Get Your Weather</h1>
      <form
        className="weather-form"
        id="weatherForm"
        action="#"
        onSubmit={formSubmit}
      >
        <span className="current-date">{currentDate()}</span>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Country"
            id="inputCountry"
            value={country}
            onChange={(event) => setCountry(event.target.value)}
          />
        </div>
        <div className="form-group">
          <input
            type="text"
            className="form-control"
            placeholder="City"
            id="inputCity"
            value={city}
            onChange={(event) => setCity(event.target.value)}
          />
          <p className="hidden" ref={refNotification}>
            Enter some data please!
          </p>
        </div>
        <button type="submit" className="btn btn-primary">
          Get Weather
        </button>
      </form>
    </div>
  );
};

export default Form;
