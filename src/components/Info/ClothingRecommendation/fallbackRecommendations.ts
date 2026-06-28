import {
  getTranslation,
  type BasicWeatherCondition,
  type SupportedLanguage,
} from "../../../i18n";
import { GenderSelection } from "../../../types/location";
import type { OutfitRecommendation } from "../../../types/outfitRecommendation";

const atmosphereConditions = new Set([
  "atmosphere",
  "mist",
  "smoke",
  "haze",
  "dust",
  "fog",
  "sand",
  "ash",
  "squall",
  "tornado",
]);

export const getBasicWeatherCondition = (
  condition: string,
): BasicWeatherCondition => {
  const normalizedCondition = condition.toLowerCase();

  if (
    normalizedCondition === "thunderstorm" ||
    normalizedCondition === "drizzle" ||
    normalizedCondition === "rain" ||
    normalizedCondition === "snow" ||
    normalizedCondition === "clear" ||
    normalizedCondition === "clouds"
  ) {
    return normalizedCondition;
  }

  if (atmosphereConditions.has(normalizedCondition)) {
    return "atmosphere";
  }

  return "current";
};

export const fallbackClothingRecommendations =
  getTranslation("en").fallbackRecommendations;

export const getFallbackClothingRecommendation = (
  outfitProfile: GenderSelection,
  condition: string,
  language: SupportedLanguage,
): OutfitRecommendation => {
  const fallbackRecommendation =
    getTranslation(language).fallbackRecommendations;
  const basicWeatherCondition = getBasicWeatherCondition(condition);

  return {
    description: fallbackRecommendation.descriptions[basicWeatherCondition],
    items: fallbackRecommendation.items[outfitProfile][basicWeatherCondition],
    title: fallbackRecommendation.titles[basicWeatherCondition],
  };
};
