import { makeAutoObservable, runInAction } from "mobx";
import { fetchWeather } from "../api/weatherApi";
import { isWeatherSuccess, type WeatherResponse } from "../types/weather";
import { loadStoredWeather, saveStoredWeather } from "../utils/weatherStorage";

export class WeatherStore {
  weather: WeatherResponse | null;
  city: string;
  loading = false;

  constructor() {
    const storedWeather = loadStoredWeather();

    this.weather = storedWeather?.weather ?? null;
    this.city = storedWeather?.city ?? "";

    makeAutoObservable(this, {}, { autoBind: true });
  }

  async getWeather(city: string, country: string): Promise<void> {
    this.loading = true;

    const response = await fetchWeather(city, country);
    const resolvedCity = isWeatherSuccess(response) ? response.name : city;

    if (isWeatherSuccess(response)) {
      saveStoredWeather({ city: resolvedCity, weather: response });
    }

    runInAction(() => {
      this.weather = response;
      this.city = resolvedCity;
      this.loading = false;
    });
  }
}
