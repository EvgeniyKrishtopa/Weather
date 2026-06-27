import type { WeatherSuccess } from "../types/weather";

export const weatherFixture: WeatherSuccess = {
  cod: 200,
  name: "Kyiv",
  main: {
    temp: 21.4,
    feels_like: 20.8,
    humidity: 62,
  },
  weather: [
    {
      main: "Clear",
    },
  ],
  wind: {
    speed: 3.8,
  },
};
