import React from "react";
import type { SvgIconComponent } from "@mui/icons-material";
import {
  getCityDisplayName,
  type SupportedLanguage,
  type TranslationDictionary,
} from "../../../i18n";
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
  selectedCity: string | null;
  translation: TranslationDictionary;
  WeatherIcon: SvgIconComponent;
}

export const WeatherComponent = ({
  countryIso,
  currentWeather,
  language,
  outfitProfile,
  selectedCity,
  translation,
  WeatherIcon,
}: WeatherComponentProps) => {
  const outfitRecommendation = useOutfitRecommendation(
    currentWeather,
    outfitProfile,
    language,
    countryIso,
  );
  const displayCityName = getCityDisplayName(
    selectedCity ?? currentWeather.name,
    countryIso,
    language,
  );
  const currentCondition = currentWeather.weather[0];
  const weatherDescription =
    currentCondition?.description ??
    currentCondition?.main ??
    translation.weather.currentCondition;
  const temperature = currentWeather.main.temp.toFixed(1);
  const windSpeed = currentWeather.wind.speed.toFixed(1);

  return (
    <WeatherCard
      elevation={12}
      role="region"
      aria-label={translation.weather.regionLabel(displayCityName)}
    >
      <WeatherContent>
        <WeatherHeader cityName={displayCityName} translation={translation} />
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
