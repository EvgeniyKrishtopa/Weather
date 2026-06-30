import { useEffect, useMemo, useState } from "react";
import {
  fetchOutfitRecommendation,
  hasOutfitRecommendationProvider,
} from "../../../api/outfitRecommendationApi";
import { getLanguageName, type SupportedLanguage } from "../../../i18n";
import type { GenderSelection } from "../../../types/location";
import type {
  OutfitRecommendation,
  OutfitRecommendationRequest,
} from "../../../types/outfitRecommendation";
import type { WeatherSuccess } from "../../../types/weather";
import { getFallbackClothingRecommendation } from "../ClothingRecommendation/fallbackRecommendations";

interface OutfitRecommendationState {
  fallbackRecommendation: OutfitRecommendation;
  loading: boolean;
  recommendation: OutfitRecommendation | null;
}

interface OutfitRecommendationResult {
  recommendation: OutfitRecommendation | null;
  requestKey: string;
}

const MIN_OUTFIT_RECOMMENDATION_LOADING_MS = 1000;

const waitForMinimumLoading = (): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, MIN_OUTFIT_RECOMMENDATION_LOADING_MS);
  });

const createOutfitRecommendationRequest = (
  weatherData: {
    city: string;
    condition: string;
    feelsLike: number;
    humidity: number;
    temperature: number;
    windSpeed: number;
  },
  outfitProfile: GenderSelection,
  language: SupportedLanguage,
  countryIso: string,
): OutfitRecommendationRequest => ({
  temperature: weatherData.temperature,
  feelsLike: weatherData.feelsLike,
  windSpeed: weatherData.windSpeed,
  humidity: weatherData.humidity,
  condition: weatherData.condition,
  city: weatherData.city,
  countryIso,
  language,
  languageName: getLanguageName(language),
  outfitProfile,
});

export const useOutfitRecommendation = (
  weather: WeatherSuccess,
  outfitProfile: GenderSelection,
  language: SupportedLanguage,
  countryIso: string,
): OutfitRecommendationState => {
  const city = weather.name;
  const condition = (weather.weather[0]?.main ?? "current").toLowerCase();
  const feelsLike = weather.main.feels_like;
  const humidity = weather.main.humidity;
  const temperature = weather.main.temp;
  const windSpeed = weather.wind.speed;
  const fallbackRecommendation = getFallbackClothingRecommendation(
    outfitProfile,
    condition,
    language,
  );
  const providerAvailable = hasOutfitRecommendationProvider();
  const recommendationRequest = useMemo(
    () =>
      createOutfitRecommendationRequest(
        {
          city,
          condition,
          feelsLike,
          humidity,
          temperature,
          windSpeed,
        },
        outfitProfile,
        language,
        countryIso,
      ),
    [
      city,
      condition,
      countryIso,
      feelsLike,
      outfitProfile,
      humidity,
      language,
      temperature,
      windSpeed,
    ],
  );
  const requestKey = useMemo(
    () => JSON.stringify(recommendationRequest),
    [recommendationRequest],
  );
  const [result, setResult] = useState<OutfitRecommendationResult>({
    recommendation: null,
    requestKey: "",
  });

  const resultMatchesRequest = result.requestKey === requestKey;

  useEffect(() => {
    if (!providerAvailable) {
      return;
    }

    let active = true;

    void Promise.all([
      fetchOutfitRecommendation(recommendationRequest),
      waitForMinimumLoading(),
    ])
      .then(([nextRecommendation]) => {
        if (active) {
          setResult({
            recommendation: nextRecommendation,
            requestKey,
          });
        }
      })
      .catch(() => {
        if (active) {
          setResult({
            recommendation: null,
            requestKey,
          });
        }
      });

    return () => {
      active = false;
    };
  }, [providerAvailable, recommendationRequest, requestKey]);

  return {
    fallbackRecommendation,
    loading: providerAvailable && !resultMatchesRequest,
    recommendation: resultMatchesRequest ? result.recommendation : null,
  };
};
