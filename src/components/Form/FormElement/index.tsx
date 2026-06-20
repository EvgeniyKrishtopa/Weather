import React, { type FormEvent } from "react";
import {
  Alert,
  Autocomplete,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  createFilterOptions,
  type SelectChangeEvent,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import type { CountryOption } from "../../../types/location";
import { FormElement as StyledFormElement, FormFields } from "../Form.styles";

interface CountryFieldProps {
  countries: CountryOption[];
  countriesLoading: boolean;
  countryIso: string;
  selectedCountry: CountryOption | undefined;
}

interface CityFieldProps {
  city: string | null;
  cities: string[];
  citiesLoading: boolean;
}

interface FormStatusProps {
  loading: boolean;
  locationError: string;
  showValidationError: boolean;
}

interface FormHandlers {
  onCityChange: (value: string | null) => void;
  onCountryChange: (event: SelectChangeEvent) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

interface WeatherFormElementProps {
  city: CityFieldProps;
  country: CountryFieldProps;
  handlers: FormHandlers;
  status: FormStatusProps;
}

const filterCityOptions = createFilterOptions<string>({ limit: 100 });

export const FormElement = ({
  city,
  country,
  handlers,
  status,
}: WeatherFormElementProps) => (
  <StyledFormElement onSubmit={handlers.onSubmit} noValidate>
    <FormFields>
      <FormControl disabled={country.countriesLoading} fullWidth>
        <InputLabel id="country-select-label">Country</InputLabel>
        <Select
          id="country-select"
          labelId="country-select-label"
          label="Country"
          value={country.selectedCountry ? country.countryIso : ""}
          onChange={handlers.onCountryChange}
        >
          {country.countries.map((countryOption) => (
            <MenuItem key={countryOption.iso2} value={countryOption.iso2}>
              {countryOption.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <Autocomplete
        id="city-select"
        options={city.cities}
        filterOptions={filterCityOptions}
        value={city.city}
        onChange={(_, value) => handlers.onCityChange(value)}
        loading={city.citiesLoading}
        loadingText="Loading cities..."
        noOptionsText="No cities found"
        disabled={!country.selectedCountry || city.citiesLoading}
        renderInput={(params) => (
          <TextField
            {...params}
            label="City"
            error={status.showValidationError && !city.city}
          />
        )}
      />
      {status.locationError && (
        <Alert severity="error">{status.locationError}</Alert>
      )}
      {status.showValidationError && (
        <Alert severity="warning" role="alert">
          Choose a city.
        </Alert>
      )}
      <Button
        type="submit"
        variant="contained"
        size="large"
        loading={status.loading}
        loadingPosition="start"
        startIcon={<SearchRoundedIcon />}
        disabled={
          country.countriesLoading ||
          city.citiesLoading ||
          !!status.locationError ||
          !country.selectedCountry
        }
      >
        Get weather
      </Button>
    </FormFields>
  </StyledFormElement>
);
