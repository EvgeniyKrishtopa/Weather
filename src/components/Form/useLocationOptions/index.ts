import { useEffect, useMemo, useRef } from "react";
import {
  getCuratedCityValues,
  getSupportedCountryOptions,
} from "../../../api/locationApi";
import { createCityOptions, type SupportedLanguage } from "../../../i18n";
import type { WeatherStore } from "../../../store/weatherStore";

type LocationOptionsStore = Pick<
  WeatherStore,
  "city" | "countryIso" | "getWeather" | "setCity"
>;

export const useLocationOptions = (
  weatherStore: LocationOptionsStore,
  language: SupportedLanguage,
) => {
  const { countryIso } = weatherStore;
  const countries = useMemo(() => getSupportedCountryOptions(), []);
  const pendingCountryRequest = useRef<string | null>(null);

  const selectedCountry = useMemo(
    () => countries.find((country) => country.iso2 === countryIso),
    [countries, countryIso],
  );
  const cityValues = useMemo(
    () => (selectedCountry ? getCuratedCityValues(selectedCountry.iso2) : []),
    [selectedCountry],
  );
  const cities = useMemo(
    () =>
      selectedCountry
        ? createCityOptions(cityValues, selectedCountry.iso2, language)
        : [],
    [cityValues, language, selectedCountry],
  );

  useEffect(() => {
    if (!selectedCountry) {
      return;
    }

    const currentCity = weatherStore.city;

    if (!currentCity) {
      pendingCountryRequest.current = null;
      return;
    }

    if (!cityValues.includes(currentCity)) {
      pendingCountryRequest.current = null;
      weatherStore.setCity(null);
      return;
    }

    if (pendingCountryRequest.current === selectedCountry.iso2) {
      pendingCountryRequest.current = null;
      void weatherStore.getWeather(currentCity, selectedCountry.iso2);
    }
  }, [cityValues, selectedCountry, weatherStore]);

  const prepareCountryChange = (nextCountryIso: string) => {
    pendingCountryRequest.current = weatherStore.city ? nextCountryIso : null;
  };

  return {
    cities,
    countries,
    prepareCountryChange,
    selectedCountry,
  };
};
