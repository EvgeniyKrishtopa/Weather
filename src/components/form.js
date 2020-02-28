import React, {useContext, useState, useRef} from 'react';
import { WeatherContext } from '../context/weatherContext';

const Form = () => {
  const refNotification = useRef();
  const {getWeather} = useContext(WeatherContext);

  const [country, setCountry] = useState('');
  const [city, setCity] = useState('');

  const formSubmit = event => {
    event.preventDefault();
    event.target.reset();

    if(country && city) {
      getWeather(country, city);
      localStorage.setItem('city', JSON.stringify(city));
      setCountry('');
      setCity('');
      refNotification.current.style.opacity = '0';
    }

    else {
      refNotification.current.style.opacity = '1';
      localStorage.clear();
    }
  }

  return(
      <div className="container">
        <h1>Weather</h1>
        <form className="weather-form" id="weatherForm" action="#" onSubmit={formSubmit}>
          <div className="form-group">
            <label>Country
              <input type="text" className="form-control" id="inputCountry" value={country} onChange={event => setCountry(event.target.value)}/>
            </label>
          </div>
          <div className="form-group">
            <label>City
              <input type="text" className="form-control" id="inputCity" value={city} onChange={event => setCity(event.target.value)}/>
            </label>
            <p className="hidden" ref={refNotification}>Enter some data please!</p>
            <button type="submit" className="btn btn-primary">Get Weather</button>
          </div>    
        </form>
      </div>
  )
}

export default Form;