import React, { useState, type FormEvent } from "react";
import { type SelectChangeEvent } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useWeatherContext } from "../../context/weatherContext";
import { FormElement } from "./FormElement";
import { FormHeader } from "./FormHeader";
import { FormCard, FormContent } from "./Form.styles";
import { useLocationOptions } from "./useLocationOptions";

const Form = observer(() => {
  const weatherStore = useWeatherContext();
  const {
    city,
    countryIso,
    gender,
    getWeather,
    loading,
    setCity,
    setCountryIso,
    setGender,
  } = weatherStore;
  const [showValidationError, setShowValidationError] = useState(false);
  const {
    cities,
    citiesLoading,
    countries,
    countriesLoading,
    locationError,
    prepareCountryChange,
    selectedCountry,
  } = useLocationOptions(weatherStore);

  const handleCountryChange = (event: SelectChangeEvent) => {
    const nextCountryIso = event.target.value;

    if (nextCountryIso === countryIso) {
      return;
    }

    prepareCountryChange(nextCountryIso);
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
        <FormHeader />
        <FormElement
          city={{
            cities,
            citiesLoading,
            city,
          }}
          country={{
            countries,
            countriesLoading,
            countryIso,
            selectedCountry,
          }}
          gender={gender}
          handlers={{
            onCityChange: handleCityChange,
            onCountryChange: handleCountryChange,
            onGenderChange: setGender,
            onSubmit: formSubmit,
          }}
          status={{
            loading,
            locationError,
            showValidationError,
          }}
        />
      </FormContent>
    </FormCard>
  );
});

export default Form;
