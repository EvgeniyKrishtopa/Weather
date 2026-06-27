import React from "react";
import type { SvgIconComponent } from "@mui/icons-material";
import type { GenderSelection } from "../../../types/location";
import type { WeatherSuccess } from "../../../types/weather";
import { ClothingRecommendation } from "../ClothingRecommendation";
import { WeatherCard, WeatherContent } from "../Weather.styles";
import { WeatherConditionSummary } from "../WeatherConditionSummary";
import { WeatherHeader } from "../WeatherHeader";
import { WeatherMetrics } from "../WeatherMetrics";
import { useOutfitRecommendation } from "../useOutfitRecommendation";

interface WeatherComponentProps {
  currentWeather: WeatherSuccess;
  gender: GenderSelection;
  WeatherIcon: SvgIconComponent;
}

export const WeatherComponent = ({
  currentWeather,
  gender,
  WeatherIcon,
}: WeatherComponentProps) => {
  const outfitRecommendation = useOutfitRecommendation(currentWeather, gender);
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
        <WeatherHeader cityName={currentWeather.name} />
        <WeatherConditionSummary
          temperature={temperature}
          weatherDescription={weatherDescription}
          WeatherIcon={WeatherIcon}
        />
        <WeatherMetrics
          humidity={currentWeather.main.humidity}
          windSpeed={windSpeed}
        />
        <ClothingRecommendation gender={gender} {...outfitRecommendation} />
      </WeatherContent>
    </WeatherCard>
  );
};
