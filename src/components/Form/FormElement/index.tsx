import React, { type FormEvent } from "react";
import {
  Alert,
  Autocomplete,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  createFilterOptions,
  type SelectChangeEvent,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import {
  getCountryDisplayName,
  type SupportedLanguage,
  type TranslationDictionary,
} from "../../../i18n";
import {
  GenderSelection,
  type CityOption,
  type CountryOption,
} from "../../../types/location";
import {
  FormElement as StyledFormElement,
  FormFields,
  OutfitProfileOptions,
} from "../Form.styles";

interface CountryFieldProps {
  countries: CountryOption[];
  countryIso: string;
  selectedCountry: CountryOption | undefined;
}

interface CityFieldProps {
  city: string | null;
  cities: CityOption[];
}

interface FormStatusProps {
  loading: boolean;
  showValidationError: boolean;
}

interface FormHandlers {
  onCityChange: (value: string | null) => void;
  onCountryChange: (event: SelectChangeEvent) => void;
  onOutfitProfileChange: (outfitProfile: GenderSelection) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

interface WeatherFormElementProps {
  city: CityFieldProps;
  country: CountryFieldProps;
  outfitProfile: GenderSelection;
  handlers: FormHandlers;
  language: SupportedLanguage;
  status: FormStatusProps;
  translation: TranslationDictionary;
}

const filterCityOptions = createFilterOptions<CityOption>({
  limit: 100,
  stringify: (option) => `${option.label} ${option.value}`,
});
const outfitProfileOptions = [
  {
    value: GenderSelection.Woman,
  },
  {
    value: GenderSelection.Man,
  },
];

export const FormElement = ({
  city,
  country,
  outfitProfile,
  handlers,
  language,
  status,
  translation,
}: WeatherFormElementProps) => {
  const selectedCityOption = city.city
    ? (city.cities.find((cityOption) => cityOption.value === city.city) ?? null)
    : null;

  return (
    <StyledFormElement onSubmit={handlers.onSubmit} noValidate>
      <FormFields>
        <FormControl fullWidth>
          <InputLabel id="country-select-label">
            {translation.form.countryLabel}
          </InputLabel>
          <Select
            id="country-select"
            labelId="country-select-label"
            label={translation.form.countryLabel}
            value={country.selectedCountry ? country.countryIso : ""}
            onChange={handlers.onCountryChange}
          >
            {country.countries.map((countryOption) => (
              <MenuItem key={countryOption.iso2} value={countryOption.iso2}>
                {getCountryDisplayName(countryOption.iso2, language)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Autocomplete
          id="city-select"
          options={city.cities}
          filterOptions={filterCityOptions}
          value={selectedCityOption}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          onChange={(_, value) => handlers.onCityChange(value?.value ?? null)}
          noOptionsText={translation.form.noCities}
          disabled={!country.selectedCountry}
          renderInput={(params) => (
            <TextField
              {...params}
              label={translation.form.cityLabel}
              error={status.showValidationError && !city.city}
            />
          )}
        />
        <OutfitProfileOptions>
          <FormLabel component="legend">{translation.form.outfitFor}</FormLabel>
          <FormGroup row aria-label={translation.form.outfitProfileAria}>
            {outfitProfileOptions.map((outfitProfileOption) => (
              <FormControlLabel
                key={outfitProfileOption.value}
                control={
                  <Checkbox
                    checked={outfitProfile === outfitProfileOption.value}
                    onChange={() =>
                      handlers.onOutfitProfileChange(outfitProfileOption.value)
                    }
                  />
                }
                label={translation.outfitProfiles[outfitProfileOption.value]}
              />
            ))}
          </FormGroup>
        </OutfitProfileOptions>
        {status.showValidationError && (
          <Alert severity="warning" role="alert">
            {translation.form.validationChooseCity}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          size="large"
          loading={status.loading}
          loadingPosition="start"
          startIcon={<SearchRoundedIcon />}
          disabled={!country.selectedCountry}
        >
          {translation.form.submit}
        </Button>
      </FormFields>
    </StyledFormElement>
  );
};
