import React, { useState, type FormEvent } from "react";
import { useWeatherContext } from "../../context/weatherContext";
import { currentDate } from "./currentDate";

const Form = () => {
  const notificationMessage = "Enter correct city and country please!";
  const { getWeather } = useWeatherContext();
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [showValidationError, setShowValidationError] = useState(false);

  const formSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedCountry = country.trim();
    const normalizedCity = city.trim();

    if (!normalizedCountry || !normalizedCity) {
      setShowValidationError(true);
      return;
    }

    setShowValidationError(false);
    await getWeather(normalizedCity, normalizedCountry);
    setCountry("");
    setCity("");
  };

  return (
    <div className="container">
      <h1>Get Your Weather</h1>
      <form
        className="weather-form"
        id="weatherForm"
        onSubmit={formSubmit}
        noValidate
      >
        <span className="current-date">{currentDate()}</span>
        <div className="form-group">
          <label className="visually-hidden" htmlFor="inputCountry">
            Country
          </label>
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
          <label className="visually-hidden" htmlFor="inputCity">
            City
          </label>
          <input
            type="text"
            className="form-control"
            placeholder="City"
            id="inputCity"
            value={city}
            onChange={(event) => setCity(event.target.value)}
            aria-describedby="weatherFormError"
          />
          <p
            className={`validation-message ${
              showValidationError ? "visible" : ""
            }`}
            id="weatherFormError"
            role="alert"
          >
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
