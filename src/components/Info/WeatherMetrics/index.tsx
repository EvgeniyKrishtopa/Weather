import React from "react";
import AirRoundedIcon from "@mui/icons-material/AirRounded";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import { Box } from "@mui/material";
import type { TranslationDictionary } from "../../../i18n";
import {
  MetricIcon,
  MetricLabel,
  MetricRow,
  Metrics,
  MetricValue,
} from "../Weather.styles";

interface MetricProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface WeatherMetricsProps {
  humidity: number;
  translation: TranslationDictionary;
  windSpeed: string;
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

export const WeatherMetrics = ({
  humidity,
  translation,
  windSpeed,
}: WeatherMetricsProps) => (
  <Metrics>
    <Metric
      icon={<AirRoundedIcon />}
      label={translation.weather.windSpeed}
      value={`${windSpeed} m/s`}
    />
    <Metric
      icon={<WaterDropOutlinedIcon />}
      label={translation.weather.humidity}
      value={`${humidity}%`}
    />
  </Metrics>
);
