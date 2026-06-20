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
import { observer } from "mobx-react-lite";
import { useWeatherContext } from "../../context/weatherContext";
import Loader from "../Loader";
import { ErrorWeather } from "./ErrorWeather";
import { WeatherComponent } from "./WeatherComponent";

const weatherIcons: Record<string, SvgIconComponent> = {
  Thunderstorm: ThunderstormRoundedIcon,
  Drizzle: GrainRoundedIcon,
  Rain: WaterDropRoundedIcon,
  Snow: AcUnitRoundedIcon,
  Atmosphere: FoggyIcon,
  Clear: WbSunnyRoundedIcon,
  Clouds: CloudRoundedIcon,
};

const Info = observer(() => {
  const { error, loading, weather } = useWeatherContext();

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorWeather currentWeather={error} />;
  }

  if (!weather) {
    return null;
  }

  const weatherDescription = weather.weather[0]?.main ?? "";
  const WeatherIcon = weatherIcons[weatherDescription] ?? AirRoundedIcon;

  return (
    <WeatherComponent currentWeather={weather} WeatherIcon={WeatherIcon} />
  );
});

export default Info;
