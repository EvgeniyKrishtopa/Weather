import React from "react";
import AirRoundedIcon from "@mui/icons-material/AirRounded";
import WaterDropOutlinedIcon from "@mui/icons-material/WaterDropOutlined";
import { Box } from "@mui/material";
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
  windSpeed,
}: WeatherMetricsProps) => (
  <Metrics>
    <Metric
      icon={<AirRoundedIcon />}
      label="Wind speed"
      value={`${windSpeed} m/s`}
    />
    <Metric
      icon={<WaterDropOutlinedIcon />}
      label="Humidity"
      value={`${humidity}%`}
    />
  </Metrics>
);
