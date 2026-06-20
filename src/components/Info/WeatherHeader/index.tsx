import React from "react";
import { Box, Typography } from "@mui/material";
import {
  WeatherEyebrow,
  WeatherHeader as WeatherHeaderContainer,
} from "../Weather.styles";

interface WeatherHeaderProps {
  cityName: string;
}

export const WeatherHeader = ({ cityName }: WeatherHeaderProps) => (
  <WeatherHeaderContainer>
    <Box>
      <WeatherEyebrow variant="overline">Current weather</WeatherEyebrow>
      <Typography component="h2" variant="h4">
        {cityName}
      </Typography>
    </Box>
  </WeatherHeaderContainer>
);
