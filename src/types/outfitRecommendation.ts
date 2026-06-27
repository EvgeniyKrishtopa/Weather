import type { GenderSelection } from "./location";

export interface OutfitRecommendationRequest {
  temperature: number;
  feelsLike: number;
  windSpeed: number;
  humidity: number;
  condition: string;
  city: string;
  outfitProfile: GenderSelection;
}

export interface OutfitRecommendation {
  title: string;
  items: string[];
  description: string;
}

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
