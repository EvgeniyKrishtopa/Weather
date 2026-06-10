import React, { useState, useRef, type FormEvent } from "react";
import { useWeatherContext } from "../../context/weatherContext";
import { currentDate } from "./currentDate";

const Form = () => {
  const notificationMessage = "Enter correct city and country please!";
  const refNotification = useRef<HTMLParagraphElement>(null);
  const { getWeather } = useWeatherContext();

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");

  const formSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    event.currentTarget.reset();

    if (country && city) {
      getWeather(country, city);
      localStorage.setItem("city", JSON.stringify(city));
      setCountry("");
      setCity("");
      if (refNotification.current) {
        refNotification.current.style.opacity = "0";
      }
    } else {
      if (refNotification.current) {
        refNotification.current.style.opacity = "1";
      }
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
            {notificationMessage}
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
