export interface WeatherSuccess {
  cod: 200;
  main: {
    temp: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
  }>;
  wind: {
    speed: number;
  };
}

export interface WeatherError {
  cod: number | string;
  message: string;
}

export type WeatherResponse = WeatherSuccess | WeatherError;

export const isWeatherSuccess = (
  weather: WeatherResponse
): weather is WeatherSuccess => weather.cod === 200;
