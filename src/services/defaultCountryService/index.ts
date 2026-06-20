import { DEFAULT_COUNTRY_ISO } from "../../constants";
import { getDefaultCountryIso } from "../../utils/localeCountry";

export const defaultCountryService = {
  getDefaultCountryIso(): string {
    return getDefaultCountryIso(DEFAULT_COUNTRY_ISO);
  },
};

export type DefaultCountryService = typeof defaultCountryService;
