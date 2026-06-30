import { describe, expect, it } from "vitest";
import { createFallbackRecommendation } from "./fallbackRecommendations";
import type { OutfitRecommendationRequest } from "./types";

const request: OutfitRecommendationRequest = {
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

const fallbackCases: Array<{
  expectedTitle: string;
  request: OutfitRecommendationRequest;
}> = [
  {
    expectedTitle: "Warm layered outfit",
    request: {
      ...request,
      condition: "Clear",
      feelsLike: 0,
      humidity: 40,
      language: "en",
      languageName: "English",
    },
  },
  {
    expectedTitle: "Rain-ready warm layers",
    request: {
      ...request,
      condition: "Drizzle",
      feelsLike: 20,
      humidity: 40,
      language: "en",
      languageName: "English",
    },
  },
  {
    expectedTitle: "Rain-ready warm layers",
    request: {
      ...request,
      condition: "Clear",
      feelsLike: 20,
      humidity: 90,
      language: "en",
      languageName: "English",
    },
  },
  {
    expectedTitle: "Wind-smart layers",
    request: {
      ...request,
      condition: "Clear",
      feelsLike: 15,
      humidity: 40,
      language: "en",
      languageName: "English",
      windSpeed: 9,
    },
  },
  {
    expectedTitle: "Light warm-weather outfit",
    request: {
      ...request,
      condition: "Clear",
      feelsLike: 27,
      humidity: 40,
      language: "en",
      languageName: "English",
    },
  },
  {
    expectedTitle: "Comfortable everyday layers",
    request: {
      ...request,
      condition: "Clear",
      feelsLike: 15,
      humidity: 40,
      language: "en",
      languageName: "English",
    },
  },
];

describe("outfit recommendation fallbacks", () => {
  it("returns localized fallback recommendations", () => {
    expect(createFallbackRecommendation(request)).toEqual({
      title: "Strati caldi pronti per la pioggia",
      items: [
        "Trench resistente all'acqua",
        "Maglia calda",
        "Pantaloni slim",
        "Stivaletti impermeabili",
      ],
      description:
        "Capispalla resistenti all'acqua e scarpe chiuse sono pratici con l'umidità.",
    });
  });

  it.each(fallbackCases)(
    "returns the $expectedTitle fallback branch",
    ({ expectedTitle, request }) => {
      expect(createFallbackRecommendation(request)).toEqual(
        expect.objectContaining({
          title: expectedTitle,
        }),
      );
    },
  );

  it("returns gender-specific fallback items", () => {
    expect(
      createFallbackRecommendation({
        ...request,
        condition: "Clear",
        gender: "man",
        language: "en",
        languageName: "English",
      }),
    ).toEqual(
      expect.objectContaining({
        items: [
          "Light field jacket",
          "Oxford shirt",
          "Chinos",
          "Casual sneakers",
        ],
      }),
    );
  });
});
