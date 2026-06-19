import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from "react";
import {
  Alert,
  Autocomplete,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  createFilterOptions,
  type SelectChangeEvent,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { observer } from "mobx-react-lite";
import { fetchCities, fetchCountries } from "../../api/locationApi";
import { useWeatherContext } from "../../context/weatherContext";
import type { CountryOption } from "../../types/location";
import { currentDate } from "./currentDate";
import {
  FormCard,
  FormContent,
  FormDescription,
  FormElement,
  FormFields,
  FormHeader,
} from "./Form.styles";

const filterCityOptions = createFilterOptions<string>({ limit: 100 });

const Form = observer(() => {
  const weatherStore = useWeatherContext();
  const { city, countryIso, getWeather, loading, setCity, setCountryIso } =
    weatherStore;
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [showValidationError, setShowValidationError] = useState(false);
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
  }, [weatherStore]);

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

  const handleCountryChange = (event: SelectChangeEvent) => {
    const nextCountryIso = event.target.value;

    if (nextCountryIso === countryIso) {
      return;
    }

    pendingCountryRequest.current = city ? nextCountryIso : null;
    setCountryIso(nextCountryIso);
    setShowValidationError(false);
  };

  const handleCityChange = (value: string | null) => {
    const changed = setCity(value);

    if (!changed) {
      return;
    }

    setShowValidationError(false);

    if (value && selectedCountry) {
      void getWeather(value, selectedCountry.iso2);
    }
  };

  const formSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!countryIso || !city) {
      setShowValidationError(true);
      return;
    }

    setShowValidationError(false);
    await getWeather(city, countryIso);
  };

  return (
    <FormCard elevation={12}>
      <FormContent>
        <FormHeader>
          <div>
            <Typography component="h1" variant="h4">
              Get your weather
            </Typography>
            <FormDescription color="text.secondary">
              Search current conditions by city and country.
            </FormDescription>
          </div>
          <Chip label={currentDate()} variant="outlined" color="primary" />
        </FormHeader>

        <FormElement onSubmit={formSubmit} noValidate>
          <FormFields>
            <FormControl disabled={countriesLoading} fullWidth>
              <InputLabel id="country-select-label">Country</InputLabel>
              <Select
                id="country-select"
                labelId="country-select-label"
                label="Country"
                value={selectedCountry ? countryIso : ""}
                onChange={handleCountryChange}
              >
                {countries.map((country) => (
                  <MenuItem key={country.iso2} value={country.iso2}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Autocomplete
              id="city-select"
              options={cities}
              filterOptions={filterCityOptions}
              value={city}
              onChange={(_, value) => handleCityChange(value)}
              loading={citiesLoading}
              loadingText="Loading cities..."
              noOptionsText="No cities found"
              disabled={!selectedCountry || citiesLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="City"
                  error={showValidationError && !city}
                />
              )}
            />
            {locationError && <Alert severity="error">{locationError}</Alert>}
            {showValidationError && (
              <Alert severity="warning" role="alert">
                Choose a city.
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              size="large"
              loading={loading}
              loadingPosition="start"
              startIcon={<SearchRoundedIcon />}
              disabled={
                countriesLoading ||
                citiesLoading ||
                !!locationError ||
                !selectedCountry
              }
            >
              Get weather
            </Button>
          </FormFields>
        </FormElement>
      </FormContent>
    </FormCard>
  );
});

export default Form;
