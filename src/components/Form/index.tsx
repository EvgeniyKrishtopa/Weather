import React, { useState, type FormEvent } from "react";
import {
  Alert,
  Button,
  Chip,
  TextField,
  Typography,
} from "@mui/material";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import { useWeatherContext } from "../../context/weatherContext";
import { currentDate } from "./currentDate";
import {
  FormCard,
  FormContent,
  FormDescription,
  FormElement,
  FormFields,
  FormHeader,
} from "./Form.styles";

const Form = () => {
  const { getWeather, loading } = useWeatherContext();
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [showValidationError, setShowValidationError] = useState(false);

  const formSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedCountry = country.trim();
    const normalizedCity = city.trim();

    if (!normalizedCountry || !normalizedCity) {
      setShowValidationError(true);
      return;
    }

    setShowValidationError(false);
    await getWeather(normalizedCity, normalizedCountry);
    setCountry("");
    setCity("");
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
            <TextField
              id="inputCountry"
              label="Country"
              autoComplete="country-name"
              value={country}
              onChange={(event) => setCountry(event.target.value)}
              error={showValidationError && !country.trim()}
            />
            <TextField
              id="inputCity"
              label="City"
              autoComplete="address-level2"
              value={city}
              onChange={(event) => setCity(event.target.value)}
              error={showValidationError && !city.trim()}
            />
            {showValidationError && (
              <Alert severity="warning" role="alert">
                Enter both a city and a country.
              </Alert>
            )}
            <Button
              type="submit"
              variant="contained"
              size="large"
              loading={loading}
              loadingPosition="start"
              startIcon={<SearchRoundedIcon />}
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
