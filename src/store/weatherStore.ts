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
import {
  getCuratedCityValues,
  getLanguageForCountryIso,
  isSupportedCountryIso,
  normalizeSupportedCountryIso,
  type SupportedLanguage,
} from "../i18n";
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
  outfitProfile: GenderSelection;
  loading = false;
  private activeRequest: AbortController | null = null;
  private requestId = 0;
  private readonly services: WeatherStoreServices;

  constructor(services = defaultWeatherStoreServices) {
    this.services = services;

    const storedWeather = this.services.persistenceService.loadStoredWeather();
    const storedLocation =
      this.services.persistenceService.loadStoredLocation();
    const storedCountryUnsupported =
      !!storedLocation && !isSupportedCountryIso(storedLocation.countryIso);
    const initialCountryIso = normalizeSupportedCountryIso(
      storedLocation?.countryIso ??
        this.services.defaultCountryService.getDefaultCountryIso(),
    );
    const storedCity = storedLocation?.city ?? storedWeather?.city ?? null;
    const storedCityUnsupported =
      !!storedCity &&
      !getCuratedCityValues(initialCountryIso).includes(storedCity);
    const shouldClearStoredLocation =
      storedCountryUnsupported || storedCityUnsupported;

    this.weather = shouldClearStoredLocation
      ? null
      : (storedWeather?.weather ?? null);
    this.city = shouldClearStoredLocation ? null : storedCity;
    this.countryIso = initialCountryIso;
    this.outfitProfile =
      storedLocation?.outfitProfile ?? DEFAULT_GENDER_SELECTION;

    if (shouldClearStoredLocation) {
      this.services.persistenceService.clearStoredWeather();

      if (storedLocation) {
        this.services.persistenceService.saveStoredLocation({
          city: null,
          countryIso: initialCountryIso,
          outfitProfile: this.outfitProfile,
        });
      }
    }

    makeAutoObservable<this, "activeRequest" | "requestId" | "services">(
      this,
      {
        activeRequest: false,
        requestId: false,
        services: false,
      },
      { autoBind: true },
    );
  }

  get language(): SupportedLanguage {
    return getLanguageForCountryIso(this.countryIso);
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
    const nextCountryIso = normalizeSupportedCountryIso(countryIso);

    if (nextCountryIso === this.countryIso) {
      return false;
    }

    this.invalidateWeather();
    this.countryIso = nextCountryIso;
    this.saveLocation();

    return true;
  }

  setOutfitProfile(outfitProfile: GenderSelection): boolean {
    if (outfitProfile === this.outfitProfile) {
      return false;
    }

    this.outfitProfile = outfitProfile;
    this.saveLocation();

    return true;
  }

  async getWeather(city: string, country: string): Promise<void> {
    this.city = city;
    const nextCountryIso = normalizeSupportedCountryIso(country);

    this.countryIso = nextCountryIso;
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
        nextCountryIso,
        getLanguageForCountryIso(nextCountryIso),
        controller.signal,
      );

      if (
        controller.signal.aborted ||
        requestId !== this.requestId ||
        city !== this.city ||
        nextCountryIso !== this.countryIso
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
      outfitProfile: this.outfitProfile,
    });
  }
}
