import { OUTFIT_RECOMMENDATION_API_URL_ENV } from "../../constants";
import {
  isOutfitRecommendation,
  type OutfitRecommendation,
  type OutfitRecommendationRequest,
} from "../../types/outfitRecommendation";

export const hasOutfitRecommendationProvider = (): boolean =>
  Boolean(import.meta.env[OUTFIT_RECOMMENDATION_API_URL_ENV]);

export const fetchOutfitRecommendation = async (
  recommendationRequest: OutfitRecommendationRequest,
  signal?: AbortSignal,
): Promise<OutfitRecommendation | null> => {
  const apiUrl = import.meta.env[OUTFIT_RECOMMENDATION_API_URL_ENV];

  if (!apiUrl) {
    return null;
  }

  try {
    const response = await fetch(apiUrl, {
      body: JSON.stringify(recommendationRequest),
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      signal,
    });
    const data: unknown = await response.json();

    if (!response.ok || !isOutfitRecommendation(data)) {
      return null;
    }

    return data;
  } catch (error) {
    if (signal?.aborted) {
      throw error;
    }

    return null;
  }
};
