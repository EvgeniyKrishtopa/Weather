import React from "react";
import type { SvgIconComponent } from "@mui/icons-material";
import { Box } from "@mui/material";
import {
  ConditionSummary,
  Temperature,
  TemperatureUnit,
  WeatherDescription,
  WeatherIconContainer,
} from "../Weather.styles";

interface WeatherConditionSummaryProps {
  temperature: string;
  weatherDescription: string;
  WeatherIcon: SvgIconComponent;
}

export const WeatherConditionSummary = ({
  temperature,
  weatherDescription,
  WeatherIcon,
}: WeatherConditionSummaryProps) => (
  <ConditionSummary>
    <Box>
      <Temperature>
        {temperature}
        <TemperatureUnit>&deg;C</TemperatureUnit>
      </Temperature>
      <WeatherDescription>{weatherDescription}</WeatherDescription>
    </Box>
    <WeatherIconContainer aria-hidden="true">
      <WeatherIcon />
    </WeatherIconContainer>
  </ConditionSummary>
);
