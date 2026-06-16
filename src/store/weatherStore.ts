import { makeAutoObservable, runInAction } from "mobx";
import { fetchWeather } from "../api/weatherApi";
import {
  isWeatherSuccess,
  type WeatherError,
  type WeatherSuccess,
} from "../types/weather";
import {
  loadStoredLocation,
  saveStoredLocation,
} from "../utils/locationStorage";
import {
  clearStoredWeather,
  loadStoredWeather,
  saveStoredWeather,
} from "../utils/weatherStorage";

const DEFAULT_COUNTRY_ISO = "US";

export class WeatherStore {
  weather: WeatherSuccess | null;
  error: WeatherError | null = null;
  city: string | null;
  countryIso: string;
  loading = false;
  private activeRequest: AbortController | null = null;
  private requestId = 0;

  constructor() {
    const storedWeather = loadStoredWeather();
    const storedLocation = loadStoredLocation();

    this.weather = storedWeather?.weather ?? null;
    this.city = storedLocation?.city ?? storedWeather?.city ?? null;
    this.countryIso = storedLocation?.countryIso ?? DEFAULT_COUNTRY_ISO;

    makeAutoObservable<this, "activeRequest" | "requestId">(
      this,
      {
        activeRequest: false,
        requestId: false,
      },
      { autoBind: true },
    );
  }

  setCity(city: string | null): boolean {
    if (city === this.city) {
      return false;
    }

    this.invalidateWeather();
    this.city = city;
    this.saveLocation();

    return true;
  }

  setCountryIso(countryIso: string): boolean {
    if (countryIso === this.countryIso) {
      return false;
    }

    this.invalidateWeather();
    this.countryIso = countryIso;
    this.saveLocation();

    return true;
  }

  async getWeather(city: string, country: string): Promise<void> {
    this.city = city;
    this.countryIso = country;
    this.saveLocation();
    this.cancelActiveRequest();

    const controller = new AbortController();
    const requestId = ++this.requestId;
    this.activeRequest = controller;
    this.weather = null;
    this.error = null;
    this.loading = true;
    clearStoredWeather();

    try {
      const response = await fetchWeather(city, country, controller.signal);

      if (
        controller.signal.aborted ||
        requestId !== this.requestId ||
        city !== this.city ||
        country !== this.countryIso
      ) {
        return;
      }

      runInAction(() => {
        if (isWeatherSuccess(response)) {
          this.weather = response;
          saveStoredWeather({ city, weather: response });
        } else {
          this.error = response;
        }
      });
    } catch {
      // Aborted requests are intentionally ignored.
    } finally {
      if (requestId === this.requestId) {
        runInAction(() => {
          this.loading = false;
          this.activeRequest = null;
        });
      }
    }
  }

  private invalidateWeather(): void {
    this.cancelActiveRequest();
    this.requestId += 1;
    this.weather = null;
    this.error = null;
    this.loading = false;
    clearStoredWeather();
  }

  private cancelActiveRequest(): void {
    this.activeRequest?.abort();
    this.activeRequest = null;
  }

  private saveLocation(): void {
    saveStoredLocation({
      city: this.city,
      countryIso: this.countryIso,
    });
  }
}
