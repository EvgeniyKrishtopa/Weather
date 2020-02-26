import React, {useContext, useState} from 'react';
import { WeatherContext } from '../context/weatherContext';

const Form = () => {
  const {getWeather,clearWeather} = useContext(WeatherContext);

  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

  const formSubmit = event => {
    event.preventDefault();
    event.target.reset();

    if(country && city) {
      getWeather(country, city);
    }

    else {
      clearWeather();
    }
  }

  return(
      <div className="container">
        <h1>Weather</h1>
        <form className="weather-form" id="weatherForm" action="#" onSubmit={formSubmit}>
          <div className="form-group">
            <label>Country
              <input type="text" className="form-control" id="inputCountry" onChange={event => setCountry(event.target.value)}/>
            </label>
          </div>
          <div className="form-group">
            <label>City
              <input type="text" className="form-control" id="inputCity" onChange={event => setCity(event.target.value)}/>
            </label>
            <button type="submit" className="btn btn-primary">Get Weather</button>
          </div>    
        </form>
      </div>
  )
}

export default Form;