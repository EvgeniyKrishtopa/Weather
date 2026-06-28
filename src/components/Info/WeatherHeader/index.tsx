import React from "react";
import { Box, Typography } from "@mui/material";
import type { TranslationDictionary } from "../../../i18n";
import {
  WeatherEyebrow,
  WeatherHeader as WeatherHeaderContainer,
} from "../Weather.styles";

interface WeatherHeaderProps {
  cityName: string;
  translation: TranslationDictionary;
}

export const WeatherHeader = ({
  cityName,
  translation,
}: WeatherHeaderProps) => (
  <WeatherHeaderContainer>
    <Box>
      <WeatherEyebrow variant="overline">
        {translation.weather.currentWeather}
      </WeatherEyebrow>
      <Typography component="h2" variant="h4">
        {cityName}
      </Typography>
    </Box>
  </WeatherHeaderContainer>
);
