import { DEFAULT_COUNTRY_ISO } from "../constants";

export const supportedCountryLanguages = {
  UA: "uk",
  RU: "ru",
  US: "en",
  GB: "en",
  ES: "es",
  IT: "it",
  DE: "de",
  FR: "fr",
} as const;

export type SupportedCountryIso = keyof typeof supportedCountryLanguages;
export type SupportedLanguage =
  (typeof supportedCountryLanguages)[SupportedCountryIso];

export const supportedCountryIsoValues = Object.keys(
  supportedCountryLanguages,
) as SupportedCountryIso[];

export const supportedLanguageValues = [
  "en",
  "uk",
  "ru",
  "es",
  "it",
  "de",
  "fr",
] as const satisfies readonly SupportedLanguage[];

const supportedCountryIsoSet = new Set<string>(supportedCountryIsoValues);
const supportedLanguageSet = new Set<string>(supportedLanguageValues);

export const DEFAULT_LANGUAGE = "en" satisfies SupportedLanguage;

export const isSupportedCountryIso = (
  countryIso: string,
): countryIso is SupportedCountryIso => supportedCountryIsoSet.has(countryIso);

export const isSupportedLanguage = (
  language: string,
): language is SupportedLanguage => supportedLanguageSet.has(language);

export const normalizeSupportedCountryIso = (
  countryIso: string,
): SupportedCountryIso =>
  isSupportedCountryIso(countryIso)
    ? countryIso
    : (DEFAULT_COUNTRY_ISO as SupportedCountryIso);

export const getLanguageForCountryIso = (
  countryIso: string,
): SupportedLanguage =>
  supportedCountryLanguages[normalizeSupportedCountryIso(countryIso)];

export const compareSupportedCountryIso = (
  first: SupportedCountryIso,
  second: SupportedCountryIso,
): number =>
  supportedCountryIsoValues.indexOf(first) -
  supportedCountryIsoValues.indexOf(second);
