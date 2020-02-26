import React, {useContext, useEffect} from 'react';
import Loader from './loader';
import { WeatherContext } from '../context/weatherContext';

const Info = () => {
  const {loading,weather} = useContext(WeatherContext);
  
  useEffect(() => {
    localStorage.setItem('weather', JSON.stringify(weather));
  },[weather])

  return(
    <div className="weather-result">
      {loading 
        ? <Loader/>
        :<p>result</p>
      }
    </div>
  )
}

export default Info;