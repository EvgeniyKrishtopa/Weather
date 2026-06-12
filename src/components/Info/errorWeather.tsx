import { Alert, AlertTitle, Paper } from "@mui/material";
import type { WeatherError } from "../../types/weather";

interface ErrorWeatherProps {
  currentWeather: WeatherError;
}

export const ErrorWeather = ({ currentWeather }: ErrorWeatherProps) => (
  <Paper elevation={8}>
    <Alert severity="error" role="alert">
      <AlertTitle>Weather unavailable</AlertTitle>
      {currentWeather.message}
    </Alert>
  </Paper>
);
