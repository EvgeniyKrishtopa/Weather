import React from "react";
import {
  Autocomplete,
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
  type AutocompleteInputChangeReason,
  type SelectChangeEvent,
} from "@mui/material";
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
  showValidationError: boolean;
}

interface FormHandlers {
  onCityBlur: () => void;
  onCityChange: (value: string | null) => void;
  onCityInputChange: (
    value: string,
    reason: AutocompleteInputChangeReason,
  ) => void;
  onCountryChange: (event: SelectChangeEvent) => void;
  onOutfitProfileChange: (outfitProfile: GenderSelection) => void;
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
    <StyledFormElement>
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
          onInputChange={(_, value, reason) =>
            handlers.onCityInputChange(value, reason)
          }
          noOptionsText={translation.form.noCities}
          disabled={!country.selectedCountry}
          renderInput={(params) => (
            <TextField
              {...params}
              label={translation.form.cityLabel}
              error={status.showValidationError && !city.city}
              helperText={
                status.showValidationError && !city.city
                  ? translation.form.validationChooseCity
                  : undefined
              }
              onBlur={handlers.onCityBlur}
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
      </FormFields>
    </StyledFormElement>
  );
};
