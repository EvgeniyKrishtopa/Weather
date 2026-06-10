import React from "react";
import AirRoundedIcon from "@mui/icons-material/AirRounded";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import type { SvgIconComponent } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import type { WeatherSuccess } from "../../types/weather";
import {
  MetricIcon,
  MetricLabel,
  MetricRow,
  Metrics,
  MetricValue,
  Temperature,
  WeatherCard,
  WeatherContent,
  WeatherDescription,
  WeatherDivider,
  WeatherEyebrow,
  WeatherHeader,
  WeatherIconContainer,
} from "./Weather.styles";

interface WeatherComponentProps {
  currentCity: string;
  currentWeather: WeatherSuccess;
  WeatherIcon: SvgIconComponent;
}

interface MetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const Metric = ({ icon, label, value }: MetricProps) => (
  <MetricRow>
    <MetricIcon>{icon}</MetricIcon>
    <Box>
      <MetricLabel variant="body2">{label}</MetricLabel>
      <MetricValue>{value}</MetricValue>
    </Box>
  </MetricRow>
);

export const WeatherComponent = ({
  currentCity,
  currentWeather,
  WeatherIcon,
}: WeatherComponentProps) => {
  const weatherDescription = currentWeather.weather[0]?.main ?? "Current";

  return (
    <WeatherCard
      elevation={12}
      role="region"
      aria-label={`Current weather in ${currentCity}`}
    >
      <WeatherContent>
        <WeatherHeader>
          <Box>
            <WeatherEyebrow variant="overline">
              Current weather
            </WeatherEyebrow>
            <Typography component="h2" variant="h3">
              {currentCity}
            </Typography>
            <WeatherDescription>{weatherDescription}</WeatherDescription>
          </Box>
          <WeatherIconContainer>
            <WeatherIcon />
          </WeatherIconContainer>
        </WeatherHeader>

        <Temperature>
          {currentWeather.main.temp.toFixed(1)}&deg;C
        </Temperature>

        <WeatherDivider />

        <Metrics>
          <Metric
            icon={<AirRoundedIcon />}
            label="Wind speed"
            value={`${currentWeather.wind.speed} m/s`}
          />
          <Metric
            icon={<WaterDropOutlinedIcon />}
            label="Humidity"
            value={`${currentWeather.main.humidity}%`}
          />
        </Metrics>
      </WeatherContent>
    </WeatherCard>
  );
};
