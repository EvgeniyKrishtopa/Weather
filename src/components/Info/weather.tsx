import React from "react";
import AirRoundedIcon from "@mui/icons-material/AirRounded";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import type { SvgIconComponent } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";
import type { WeatherSuccess } from "../../types/weather";
import {
  ConditionSummary,
  MetricIcon,
  MetricLabel,
  MetricRow,
  Metrics,
  MetricValue,
  Temperature,
  TemperatureUnit,
  WeatherCard,
  WeatherContent,
  WeatherDescription,
  WeatherEyebrow,
  WeatherHeader,
  WeatherIconContainer,
} from "./Weather.styles";

interface WeatherComponentProps {
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
    <MetricIcon aria-hidden="true">{icon}</MetricIcon>
    <Box>
      <MetricLabel>{label}</MetricLabel>
      <MetricValue>{value}</MetricValue>
    </Box>
  </MetricRow>
);

export const WeatherComponent = ({
  currentWeather,
  WeatherIcon,
}: WeatherComponentProps) => {
  const weatherDescription = currentWeather.weather[0]?.main ?? "Current";
  const temperature = currentWeather.main.temp.toFixed(1);
  const windSpeed = currentWeather.wind.speed.toFixed(1);

  return (
    <WeatherCard
      elevation={12}
      role="region"
      aria-label={`Current weather in ${currentWeather.name}`}
    >
      <WeatherContent>
        <WeatherHeader>
          <Box>
            <WeatherEyebrow variant="overline">Current weather</WeatherEyebrow>
            <Typography component="h2" variant="h4">
              {currentWeather.name}
            </Typography>
          </Box>
        </WeatherHeader>

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

        <Metrics>
          <Metric
            icon={<AirRoundedIcon />}
            label="Wind speed"
            value={`${windSpeed} m/s`}
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
