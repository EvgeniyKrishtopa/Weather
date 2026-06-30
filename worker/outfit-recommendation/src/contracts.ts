import { isSupportedLanguage, supportedLanguageNames } from "./languages";
import type {
  OutfitRecommendation,
  OutfitRecommendationRequest,
} from "./types";

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

export const isOutfitRecommendationRequest = (
  value: unknown,
): value is OutfitRecommendationRequest => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const request = value as Record<string, unknown>;

  return (
    isFiniteNumber(request.temperature) &&
    isFiniteNumber(request.feelsLike) &&
    isFiniteNumber(request.windSpeed) &&
    isFiniteNumber(request.humidity) &&
    typeof request.condition === "string" &&
    request.condition.trim().length > 0 &&
    typeof request.city === "string" &&
    request.city.trim().length > 0 &&
    typeof request.countryIso === "string" &&
    request.countryIso.trim().length === 2 &&
    (request.gender === "woman" || request.gender === "man") &&
    isSupportedLanguage(request.language) &&
    request.languageName === supportedLanguageNames[request.language]
  );
};

export const isOutfitRecommendation = (
  value: unknown,
): value is OutfitRecommendation => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const recommendation = value as Record<string, unknown>;

  return (
    typeof recommendation.title === "string" &&
    recommendation.title.trim().length > 0 &&
    Array.isArray(recommendation.items) &&
    recommendation.items.length > 0 &&
    recommendation.items.every(
      (item) => typeof item === "string" && item.trim().length > 0,
    ) &&
    typeof recommendation.description === "string" &&
    recommendation.description.trim().length > 0
  );
};

export const normalizeRecommendation = (
  recommendation: OutfitRecommendation,
): OutfitRecommendation => ({
  title: recommendation.title.trim(),
  items: recommendation.items.map((item) => item.trim()).slice(0, 5),
  description: recommendation.description.trim(),
});
