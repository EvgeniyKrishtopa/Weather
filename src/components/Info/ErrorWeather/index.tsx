import { Alert, AlertTitle, Paper } from "@mui/material";
import type { TranslationDictionary } from "../../../i18n";
import type { WeatherError } from "../../../types/weather";

interface ErrorWeatherProps {
  currentWeather: WeatherError;
  translation: TranslationDictionary;
}

export const ErrorWeather = ({
  currentWeather,
  translation,
}: ErrorWeatherProps) => (
  <Paper elevation={8}>
    <Alert severity="error" role="alert">
      <AlertTitle>{translation.errors.weatherUnavailableTitle}</AlertTitle>
      {currentWeather.message}
    </Alert>
  </Paper>
);
