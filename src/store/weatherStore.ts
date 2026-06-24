import { makeAutoObservable, runInAction } from "mobx";
import {
  defaultCountryService,
  type DefaultCountryService,
} from "../services/defaultCountryService";
import {
  weatherPersistenceService,
  type WeatherPersistenceService,
} from "../services/weatherPersistenceService";
import {
  weatherRequestService,
  type WeatherRequestService,
} from "../services/weatherRequestService";
import {
  isWeatherSuccess,
  type WeatherError,
  type WeatherSuccess,
} from "../types/weather";
import { DEFAULT_COUNTRY_ISO } from "../constants";
import {
  DEFAULT_GENDER_SELECTION,
  type GenderSelection,
} from "../types/location";

export interface WeatherStoreServices {
  defaultCountryService: DefaultCountryService;
  persistenceService: WeatherPersistenceService;
  requestService: WeatherRequestService;
}

const defaultWeatherStoreServices: WeatherStoreServices = {
  defaultCountryService,
  persistenceService: weatherPersistenceService,
  requestService: weatherRequestService,
};

export class WeatherStore {
  weather: WeatherSuccess | null;
  error: WeatherError | null = null;
  city: string | null;
  countryIso: string;
  gender: GenderSelection;
  loading = false;
  private countryAutoDetected: boolean;
  private activeRequest: AbortController | null = null;
  private requestId = 0;
  private readonly services: WeatherStoreServices;

  constructor(services = defaultWeatherStoreServices) {
    this.services = services;

    const storedWeather = this.services.persistenceService.loadStoredWeather();
    const storedLocation =
      this.services.persistenceService.loadStoredLocation();

    this.weather = storedWeather?.weather ?? null;
    this.city = storedLocation?.city ?? storedWeather?.city ?? null;
    this.countryIso =
      storedLocation?.countryIso ??
      this.services.defaultCountryService.getDefaultCountryIso();
    this.gender = storedLocation?.gender ?? DEFAULT_GENDER_SELECTION;
    this.countryAutoDetected = !storedLocation;

    makeAutoObservable<
      this,
      "activeRequest" | "requestId" | "countryAutoDetected" | "services"
    >(
      this,
      {
        activeRequest: false,
        requestId: false,
        countryAutoDetected: false,
        services: false,
      },
      { autoBind: true },
    );
  }

  get canApplyDetectedCountryIso(): boolean {
    return this.countryAutoDetected;
  }

  setCity(city: string | null): boolean {
    if (city === this.city) {
      return false;
    }

    this.countryAutoDetected = false;
    this.invalidateWeather();
    this.city = city;
    this.saveLocation();

    return true;
  }

  setCountryIso(countryIso: string): boolean {
    if (countryIso === this.countryIso) {
      return false;
    }

    this.countryAutoDetected = false;
    this.invalidateWeather();
    this.countryIso = countryIso;
    this.saveLocation();

    return true;
  }

  setGender(gender: GenderSelection): boolean {
    if (gender === this.gender) {
      return false;
    }

    this.gender = gender;
    this.saveLocation();

    return true;
  }

  async getWeather(city: string, country: string): Promise<void> {
    this.countryAutoDetected = false;
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
    this.services.persistenceService.clearStoredWeather();

    try {
      const response = await this.services.requestService.fetchWeather(
        city,
        country,
        controller.signal,
      );

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
          this.services.persistenceService.saveStoredWeather({
            city,
            weather: response,
          });
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

  applyDetectedCountryIso(countryIso: string): boolean {
    if (!this.countryAutoDetected || countryIso === this.countryIso) {
      return false;
    }

    this.invalidateWeather();
    this.city = null;
    this.countryIso = countryIso;

    return true;
  }

  reconcileDetectedCountryOptions(countryIsoOptions: string[]): boolean {
    if (
      !this.countryAutoDetected ||
      countryIsoOptions.includes(this.countryIso) ||
      !countryIsoOptions.includes(DEFAULT_COUNTRY_ISO)
    ) {
      return false;
    }

    return this.applyDetectedCountryIso(DEFAULT_COUNTRY_ISO);
  }

  private invalidateWeather(): void {
    this.cancelActiveRequest();
    this.requestId += 1;
    this.weather = null;
    this.error = null;
    this.loading = false;
    this.services.persistenceService.clearStoredWeather();
  }

  private cancelActiveRequest(): void {
    this.activeRequest?.abort();
    this.activeRequest = null;
  }

  private saveLocation(): void {
    this.services.persistenceService.saveStoredLocation({
      city: this.city,
      countryIso: this.countryIso,
      gender: this.gender,
    });
  }
}
