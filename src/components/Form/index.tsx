import React, { useState, type FormEvent } from "react";
import { type SelectChangeEvent } from "@mui/material";
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
  } = weatherStore;
  const language = weatherStore.language;
  const translation = getTranslation(language);
  const [showValidationError, setShowValidationError] = useState(false);
  const { cities, countries, prepareCountryChange, selectedCountry } =
    useLocationOptions(weatherStore, language);

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
            onCityChange: handleCityChange,
            onCountryChange: handleCountryChange,
            onOutfitProfileChange: setOutfitProfile,
            onSubmit: formSubmit,
          }}
          language={language}
          status={{
            loading,
            showValidationError,
          }}
          translation={translation}
        />
      </FormContent>
    </FormCard>
  );
});

export default Form;
