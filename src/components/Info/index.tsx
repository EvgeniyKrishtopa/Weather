import React from "react";
import AcUnitRoundedIcon from "@mui/icons-material/AcUnitRounded";
import AirRoundedIcon from "@mui/icons-material/AirRounded";
import CloudRoundedIcon from "@mui/icons-material/CloudRounded";
import FoggyIcon from "@mui/icons-material/Foggy";
import GrainRoundedIcon from "@mui/icons-material/GrainRounded";
import ThunderstormRoundedIcon from "@mui/icons-material/ThunderstormRounded";
import WaterDropRoundedIcon from "@mui/icons-material/WaterDropRounded";
import WbSunnyRoundedIcon from "@mui/icons-material/WbSunnyRounded";
import type { SvgIconComponent } from "@mui/icons-material";
import { useWeatherContext } from "../../context/weatherContext";
import { isWeatherSuccess } from "../../types/weather";
import Loader from "../Loader";
import { ErrorWeather } from "./errorWeather";
import { WeatherComponent } from "./weather";

const weatherIcons: Record<string, SvgIconComponent> = {
  Thunderstorm: ThunderstormRoundedIcon,
  Drizzle: GrainRoundedIcon,
  Rain: WaterDropRoundedIcon,
  Snow: AcUnitRoundedIcon,
  Atmosphere: FoggyIcon,
  Clear: WbSunnyRoundedIcon,
  Clouds: CloudRoundedIcon,
};

const Info = () => {
  const { loading, weather, city } = useWeatherContext();

  if (loading) {
    return <Loader />;
  }

  if (!weather) {
    return null;
  }

  if (!isWeatherSuccess(weather)) {
    return <ErrorWeather currentWeather={weather} />;
  }

  const weatherDescription = weather.weather[0]?.main ?? "";
  const WeatherIcon = weatherIcons[weatherDescription] ?? AirRoundedIcon;

  return (
    <WeatherComponent
      currentCity={city}
      currentWeather={weather}
      WeatherIcon={WeatherIcon}
    />
  );
};

export default Info;
