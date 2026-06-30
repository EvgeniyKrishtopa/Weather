import type { GenderSelection } from "../types/location";
import type {
  SupportedCountryIso,
  SupportedLanguage,
} from "./supportedCountries";

export type BasicWeatherCondition =
  | "thunderstorm"
  | "drizzle"
  | "rain"
  | "snow"
  | "atmosphere"
  | "clear"
  | "clouds"
  | "current";

export type FallbackRecommendationTranslations = {
  descriptions: Record<BasicWeatherCondition, string>;
  items: Record<GenderSelection, Record<BasicWeatherCondition, string[]>>;
  titles: Record<BasicWeatherCondition, string>;
};

export interface TranslationDictionary {
  countries: Record<SupportedCountryIso, string>;
  errors: {
    unableToConnectWeather: string;
    weatherApiKeyMissing: string;
    weatherInvalidResponse: string;
    weatherUnavailableTitle: string;
  };
  fallbackRecommendations: FallbackRecommendationTranslations;
  form: {
    cityLabel: string;
    countryLabel: string;
    description: string;
    noCities: string;
    outfitFor: string;
    outfitProfileAria: string;
    title: string;
    validationChooseCity: string;
  };
  language: SupportedLanguage;
  languageName: string;
  loader: {
    loadingWeather: string;
    loadingWeatherAria: string;
  };
  locale: string;
  outfitProfiles: Record<GenderSelection, string>;
  recommendation: {
    forAudience: (audience: string) => string;
    loadingAria: string;
    loadingDescription: string;
    preparingTitle: string;
    recommendedClothingLabel: string;
    regionLabel: string;
  };
  weather: {
    currentCondition: string;
    currentWeather: string;
    humidity: string;
    regionLabel: (cityName: string) => string;
    windSpeed: string;
  };
}

export type TranslationMap = Record<SupportedLanguage, TranslationDictionary>;
