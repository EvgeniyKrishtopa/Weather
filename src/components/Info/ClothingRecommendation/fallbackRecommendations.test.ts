import { describe, expect, it } from "vitest";
import {
  supportedLanguageValues,
  type BasicWeatherCondition,
} from "../../../i18n";
import { GenderSelection } from "../../../types/location";
import {
  fallbackClothingRecommendations,
  getBasicWeatherCondition,
  getFallbackClothingRecommendation,
} from "./fallbackRecommendations";

const basicWeatherConditions: BasicWeatherCondition[] = [
  "thunderstorm",
  "drizzle",
  "rain",
  "snow",
  "atmosphere",
  "clear",
  "clouds",
  "current",
];

describe("fallback clothing recommendations", () => {
  it.each([GenderSelection.Woman, GenderSelection.Man])(
    "defines fallback variants for all basic weather conditions for %s",
    (outfitProfile) => {
      expect(
        Object.keys(
          fallbackClothingRecommendations.items[outfitProfile],
        ).sort(),
      ).toEqual([...basicWeatherConditions].sort());
    },
  );

  it("normalizes OpenWeather conditions to basic fallback groups", () => {
    expect(getBasicWeatherCondition("Rain")).toBe("rain");
    expect(getBasicWeatherCondition("Clouds")).toBe("clouds");
    expect(getBasicWeatherCondition("Mist")).toBe("atmosphere");
    expect(getBasicWeatherCondition("Volcanic ash")).toBe("current");
  });

  it("returns outfit profile-specific fallback recommendations for the same weather", () => {
    expect(
      getFallbackClothingRecommendation(GenderSelection.Woman, "Rain", "en")
        .items,
    ).toContain("Water-resistant trench coat");
    expect(
      getFallbackClothingRecommendation(GenderSelection.Man, "Rain", "en")
        .items,
    ).toContain("Water-resistant jacket");
  });

  it.each(supportedLanguageValues)(
    "returns translated fallback recommendations for %s",
    (language) => {
      const recommendation = getFallbackClothingRecommendation(
        GenderSelection.Woman,
        "Rain",
        language,
      );

      expect(recommendation.title).toBeTruthy();
      expect(recommendation.items.length).toBeGreaterThan(0);
      expect(recommendation.description).toBeTruthy();
    },
  );
});
