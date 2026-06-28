import React from "react";
import type { SvgIconComponent } from "@mui/icons-material";
import type { SupportedLanguage, TranslationDictionary } from "../../../i18n";
import type { GenderSelection } from "../../../types/location";
import type { WeatherSuccess } from "../../../types/weather";
import { ClothingRecommendation } from "../ClothingRecommendation";
import { WeatherCard, WeatherContent } from "../Weather.styles";
import { WeatherConditionSummary } from "../WeatherConditionSummary";
import { WeatherHeader } from "../WeatherHeader";
import { WeatherMetrics } from "../WeatherMetrics";
import { useOutfitRecommendation } from "../useOutfitRecommendation";

interface WeatherComponentProps {
  countryIso: string;
  currentWeather: WeatherSuccess;
  language: SupportedLanguage;
  outfitProfile: GenderSelection;
  translation: TranslationDictionary;
  WeatherIcon: SvgIconComponent;
}

export const WeatherComponent = ({
  countryIso,
  currentWeather,
  language,
  outfitProfile,
  translation,
  WeatherIcon,
}: WeatherComponentProps) => {
  const outfitRecommendation = useOutfitRecommendation(
    currentWeather,
    outfitProfile,
    language,
    countryIso,
  );
  const weatherDescription =
    currentWeather.weather[0]?.main ?? translation.weather.currentCondition;
  const temperature = currentWeather.main.temp.toFixed(1);
  const windSpeed = currentWeather.wind.speed.toFixed(1);

  return (
    <WeatherCard
      elevation={12}
      role="region"
      aria-label={translation.weather.regionLabel(currentWeather.name)}
    >
      <WeatherContent>
        <WeatherHeader
          cityName={currentWeather.name}
          translation={translation}
        />
        <WeatherConditionSummary
          temperature={temperature}
          weatherDescription={weatherDescription}
          WeatherIcon={WeatherIcon}
        />
        <WeatherMetrics
          humidity={currentWeather.main.humidity}
          translation={translation}
          windSpeed={windSpeed}
        />
        <ClothingRecommendation
          outfitProfile={outfitProfile}
          translation={translation}
          {...outfitRecommendation}
        />
      </WeatherContent>
    </WeatherCard>
  );
};
