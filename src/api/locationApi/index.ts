import type { CountryOption } from "../../types/location";
import { getCuratedCityValues, getTranslation } from "../../i18n";
import { supportedCountryIsoValues } from "../../i18n/supportedCountries";

export const getSupportedCountryOptions = (): CountryOption[] =>
  supportedCountryIsoValues.map((countryIso) => ({
    name: getTranslation("en").countries[countryIso],
    iso2: countryIso,
  }));

export { getCuratedCityValues };
