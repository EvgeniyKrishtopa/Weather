import type { CountryOption } from "../types/location";
import {
  createCityOptions,
  getCityDisplayName,
  getCuratedCityList,
  getCuratedCityValues,
} from "./cityNames";
import {
  compareSupportedCountryIso,
  DEFAULT_LANGUAGE,
  isSupportedCountryIso,
  normalizeSupportedCountryIso,
  type SupportedCountryIso,
  type SupportedLanguage,
} from "./supportedCountries";
import type { TranslationDictionary } from "./types";
import { translations } from "./translations";

export const getTranslation = (
  language: SupportedLanguage = DEFAULT_LANGUAGE,
): TranslationDictionary => translations[language];

export const getCountryDisplayName = (
  countryIso: string,
  language: SupportedLanguage,
): string => {
  const supportedCountryIso = normalizeSupportedCountryIso(countryIso);

  return getTranslation(language).countries[supportedCountryIso];
};

export const getLanguageName = (language: SupportedLanguage): string =>
  getTranslation(language).languageName;

export const filterSupportedCountries = (
  countries: CountryOption[],
): CountryOption[] =>
  countries
    .filter(
      (country): country is CountryOption & { iso2: SupportedCountryIso } =>
        isSupportedCountryIso(country.iso2),
    )
    .sort((first, second) =>
      compareSupportedCountryIso(first.iso2, second.iso2),
    );

export type { BasicWeatherCondition, TranslationDictionary } from "./types";
export {
  createCityOptions,
  getCityDisplayName,
  getCuratedCityList,
  getCuratedCityValues,
};
export {
  DEFAULT_LANGUAGE,
  getLanguageForCountryIso,
  isSupportedCountryIso,
  isSupportedLanguage,
  normalizeSupportedCountryIso,
  supportedCountryIsoValues,
  supportedCountryLanguages,
  supportedLanguageValues,
  type SupportedCountryIso,
  type SupportedLanguage,
} from "./supportedCountries";
