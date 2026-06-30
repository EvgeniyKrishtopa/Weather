import { describe, expect, it } from "vitest";
import {
  isOutfitRecommendation,
  isOutfitRecommendationRequest,
  normalizeRecommendation,
} from "./contracts";

const validRequest = {
  temperature: 12,
  feelsLike: 10,
  windSpeed: 3,
  humidity: 65,
  condition: "Rain",
  city: "Rome",
  countryIso: "IT",
  gender: "woman",
  language: "it",
  languageName: "Italian",
};

describe("outfit recommendation Worker contracts", () => {
  it("recognizes a valid recommendation request", () => {
    expect(isOutfitRecommendationRequest(validRequest)).toBe(true);
  });

  it.each([
    { ...validRequest, temperature: Number.NaN },
    { ...validRequest, condition: "" },
    { ...validRequest, city: "" },
    { ...validRequest, countryIso: "ITA" },
    { ...validRequest, gender: "other" },
    { ...validRequest, language: "pt", languageName: "Portuguese" },
    { ...validRequest, language: "it", languageName: "Italiano" },
  ])("rejects malformed recommendation requests: %j", (request) => {
    expect(isOutfitRecommendationRequest(request)).toBe(false);
  });

  it("recognizes and normalizes a valid recommendation", () => {
    const recommendation = {
      title: "  Rain layers  ",
      items: [" Coat ", " Boots ", " Scarf ", " Hat ", " Gloves ", " Bag "],
      description: "  Useful in rain.  ",
    };

    expect(isOutfitRecommendation(recommendation)).toBe(true);
    expect(normalizeRecommendation(recommendation)).toEqual({
      title: "Rain layers",
      items: ["Coat", "Boots", "Scarf", "Hat", "Gloves"],
      description: "Useful in rain.",
    });
  });

  it.each([
    null,
    {},
    { title: "", items: ["Coat"], description: "Valid" },
    { title: "Valid", items: [], description: "Valid" },
    { title: "Valid", items: [" "], description: "Valid" },
    { title: "Valid", items: ["Coat"], description: "" },
  ])("rejects malformed recommendations: %j", (value) => {
    expect(isOutfitRecommendation(value)).toBe(false);
  });
});
