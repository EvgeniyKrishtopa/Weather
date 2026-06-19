import { useEffect, useMemo, useRef, useState } from "react";
import { fetchCities, fetchCountries } from "../../../api/locationApi";
import type { WeatherStore } from "../../../store/weatherStore";
import type { CountryOption } from "../../../types/location";

type LocationOptionsStore = Pick<
  WeatherStore,
  | "city"
  | "countryIso"
  | "getWeather"
  | "reconcileDetectedCountryOptions"
  | "setCity"
>;

export const useLocationOptions = (weatherStore: LocationOptionsStore) => {
  const { countryIso } = weatherStore;
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const pendingCountryRequest = useRef<string | null>(null);

  const selectedCountry = useMemo(
    () => countries.find((country) => country.iso2 === countryIso),
    [countries, countryIso],
  );
  const countryIsoOptions = useMemo(
    () => countries.map((country) => country.iso2),
    [countries],
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadCountries = async () => {
      setCountriesLoading(true);
      setLocationError("");

      try {
        const loadedCountries = await fetchCountries(controller.signal);

        if (controller.signal.aborted) {
          return;
        }

        setCountries(loadedCountries);
      } catch (error) {
        if (!controller.signal.aborted) {
          setLocationError(
            error instanceof Error
              ? error.message
              : "Unable to load countries.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setCountriesLoading(false);
        }
      }
    };

    void loadCountries();

    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (countryIsoOptions.length === 0) {
      return;
    }

    weatherStore.reconcileDetectedCountryOptions(countryIsoOptions);
  }, [countryIso, countryIsoOptions, weatherStore]);

  useEffect(() => {
    if (!selectedCountry) {
      return;
    }

    const controller = new AbortController();

    const loadCities = async () => {
      setCitiesLoading(true);
      setLocationError("");
      setCities([]);

      try {
        const loadedCities = await fetchCities(
          selectedCountry.name,
          controller.signal,
        );

        if (controller.signal.aborted) {
          return;
        }

        setCities(loadedCities);

        if (pendingCountryRequest.current !== selectedCountry.iso2) {
          return;
        }

        pendingCountryRequest.current = null;

        const currentCity = weatherStore.city;

        if (!currentCity) {
          return;
        }

        if (loadedCities.includes(currentCity)) {
          void weatherStore.getWeather(currentCity, selectedCountry.iso2);
        } else {
          weatherStore.setCity(null);
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          pendingCountryRequest.current = null;
          setLocationError(
            error instanceof Error ? error.message : "Unable to load cities.",
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setCitiesLoading(false);
        }
      }
    };

    void loadCities();

    return () => controller.abort();
  }, [selectedCountry, weatherStore]);

  const prepareCountryChange = (nextCountryIso: string) => {
    pendingCountryRequest.current = weatherStore.city ? nextCountryIso : null;
  };

  return {
    cities,
    citiesLoading,
    countries,
    countriesLoading,
    locationError,
    prepareCountryChange,
    selectedCountry,
  };
};
