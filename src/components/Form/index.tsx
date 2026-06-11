import React, {
  useEffect,
  useMemo,
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

const DEFAULT_COUNTRY_ISO = "US";
const filterCityOptions = createFilterOptions<string>({ limit: 100 });

const Form = () => {
  const { getWeather, loading } = useWeatherContext();
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [countryIso, setCountryIso] = useState(DEFAULT_COUNTRY_ISO);
  const [cities, setCities] = useState<string[]>([]);
  const [city, setCity] = useState<string | null>(null);
  const [countriesLoading, setCountriesLoading] = useState(true);
  const [citiesLoading, setCitiesLoading] = useState(false);
  const [locationError, setLocationError] = useState("");
  const [showValidationError, setShowValidationError] = useState(false);

  const selectedCountry = useMemo(
    () => countries.find((country) => country.iso2 === countryIso),
    [countries, countryIso]
  );

  useEffect(() => {
    const controller = new AbortController();

    const loadCountries = async () => {
      setCountriesLoading(true);
      setLocationError("");

      try {
        setCountries(await fetchCountries(controller.signal));
      } catch (error) {
        if (!controller.signal.aborted) {
          setLocationError(
            error instanceof Error ? error.message : "Unable to load countries."
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
    if (!selectedCountry) {
      return;
    }

    const controller = new AbortController();

    const loadCities = async () => {
      setCitiesLoading(true);
      setLocationError("");
      setCities([]);
      setCity(null);

      try {
        setCities(await fetchCities(selectedCountry.name, controller.signal));
      } catch (error) {
        if (!controller.signal.aborted) {
          setLocationError(
            error instanceof Error ? error.message : "Unable to load cities."
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
  }, [selectedCountry]);

  const handleCountryChange = (event: SelectChangeEvent) => {
    setCountryIso(event.target.value);
    setShowValidationError(false);
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
              onChange={(_, value) => {
                setCity(value);
                setShowValidationError(false);
              }}
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
};

export default Form;
