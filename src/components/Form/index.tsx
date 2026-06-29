import React, { useState } from "react";
import {
  type AutocompleteInputChangeReason,
  type SelectChangeEvent,
} from "@mui/material";
import { observer } from "mobx-react-lite";
import { useWeatherContext } from "../../context/weatherContext";
import { getTranslation } from "../../i18n";
import { FormElement } from "./FormElement";
import { FormHeader } from "./FormHeader";
import { FormCard, FormContent } from "./Form.styles";
import { useLocationOptions } from "./useLocationOptions";

const Form = observer(() => {
  const weatherStore = useWeatherContext();
  const {
    city,
    countryIso,
    outfitProfile,
    getWeather,
    loading,
    setCity,
    setCountryIso,
    setOutfitProfile,
    weather,
  } = weatherStore;
  const language = weatherStore.language;
  const translation = getTranslation(language);
  const [showValidationError, setShowValidationError] = useState(false);
  const { cities, countries, prepareCountryChange, selectedCountry } =
    useLocationOptions(weatherStore, language);

  const requestMissingWeather = () => {
    if (!city || !selectedCountry || loading || weather) {
      return;
    }

    void getWeather(city, selectedCountry.iso2);
  };

  const handleCountryChange = (event: SelectChangeEvent) => {
    const nextCountryIso = event.target.value;

    prepareCountryChange(nextCountryIso);
    setCountryIso(nextCountryIso);
    setShowValidationError(false);
  };

  const handleCityChange = (value: string | null) => {
    if (!value) {
      setCity(null);
      setShowValidationError(true);
      return;
    }

    const changed = setCity(value);

    if (!changed) {
      return;
    }

    setShowValidationError(false);

    if (selectedCountry) {
      void getWeather(value, selectedCountry.iso2);
    }
  };

  const handleCityInputChange = (
    value: string,
    reason: AutocompleteInputChangeReason,
  ) => {
    if (reason !== "input" || !city) {
      return;
    }

    const selectedCityOption = cities.find(
      (cityOption) => cityOption.value === city,
    );

    if (value === selectedCityOption?.label) {
      return;
    }

    setCity(null);
    setShowValidationError(true);
  };

  const handleCityBlur = () => {
    setShowValidationError(!city);
    requestMissingWeather();
  };

  const handleOutfitProfileChange = (
    nextOutfitProfile: typeof outfitProfile,
  ) => {
    const changed = setOutfitProfile(nextOutfitProfile);

    if (changed) {
      requestMissingWeather();
    }
  };

  return (
    <FormCard elevation={12}>
      <FormContent>
        <FormHeader language={language} translation={translation} />
        <FormElement
          city={{
            cities,
            city,
          }}
          country={{
            countries,
            countryIso,
            selectedCountry,
          }}
          outfitProfile={outfitProfile}
          handlers={{
            onCityBlur: handleCityBlur,
            onCityChange: handleCityChange,
            onCityInputChange: handleCityInputChange,
            onCountryChange: handleCountryChange,
            onOutfitProfileChange: handleOutfitProfileChange,
          }}
          language={language}
          status={{
            showValidationError,
          }}
          translation={translation}
        />
      </FormContent>
    </FormCard>
  );
});

export default Form;
