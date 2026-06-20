import { fetchWeather } from "../../api/weatherApi";

export const weatherRequestService = {
  fetchWeather,
};

export type WeatherRequestService = typeof weatherRequestService;
