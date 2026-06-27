import { describe, expect, it } from "vitest";
import { GenderSelection } from "../../../types/location";
import {
  fallbackClothingRecommendations,
  getBasicWeatherCondition,
  getFallbackClothingRecommendation,
  type BasicWeatherCondition,
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
    (gender) => {
      expect(
        Object.keys(fallbackClothingRecommendations[gender]).sort(),
      ).toEqual([...basicWeatherConditions].sort());
    },
  );

  it("normalizes OpenWeather conditions to basic fallback groups", () => {
    expect(getBasicWeatherCondition("Rain")).toBe("rain");
    expect(getBasicWeatherCondition("Clouds")).toBe("clouds");
    expect(getBasicWeatherCondition("Mist")).toBe("atmosphere");
    expect(getBasicWeatherCondition("Volcanic ash")).toBe("current");
  });

  it("returns gender-specific fallback recommendations for the same weather", () => {
    expect(
      getFallbackClothingRecommendation(GenderSelection.Woman, "Rain").items,
    ).toContain("Water-resistant trench coat");
    expect(
      getFallbackClothingRecommendation(GenderSelection.Man, "Rain").items,
    ).toContain("Water-resistant jacket");
  });
});
