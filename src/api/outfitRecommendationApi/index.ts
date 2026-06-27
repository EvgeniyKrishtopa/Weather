import { OUTFIT_RECOMMENDATION_API_URL_ENV } from "../../constants";
import {
  isOutfitRecommendation,
  type OutfitRecommendation,
  type OutfitRecommendationRequest,
} from "../../types/outfitRecommendation";
import { GenderSelection } from "../../types/location";

const getWorkerGender = (outfitProfile: GenderSelection): "woman" | "man" =>
  outfitProfile === GenderSelection.Man ? "man" : "woman";

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
    const { outfitProfile, ...weatherRequest } = recommendationRequest;

    const response = await fetch(apiUrl, {
      body: JSON.stringify({
        ...weatherRequest,
        gender: getWorkerGender(outfitProfile),
      }),
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
