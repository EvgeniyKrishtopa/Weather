import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchOutfitRecommendation, hasOutfitRecommendationProvider } from ".";
import { OUTFIT_RECOMMENDATION_API_URL_ENV } from "../../constants";
import { GenderSelection } from "../../types/location";
import type { OutfitRecommendationRequest } from "../../types/outfitRecommendation";

const recommendationRequest: OutfitRecommendationRequest = {
  temperature: 4,
  feelsLike: -1,
  windSpeed: 8,
  humidity: 82,
  condition: "rain",
  city: "Kyiv",
  outfitProfile: GenderSelection.Woman,
};

const recommendation = {
  title: "Rain-ready warm layers",
  items: [
    "Water-resistant coat",
    "Warm base layer",
    "Trousers",
    "Waterproof shoes",
  ],
  description: "Short weather-aware outfit guidance.",
};

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("fetchOutfitRecommendation", () => {
  it("returns null when the provider URL is not configured", async () => {
    vi.stubEnv(OUTFIT_RECOMMENDATION_API_URL_ENV, "");
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      fetchOutfitRecommendation(recommendationRequest),
    ).resolves.toBeNull();

    expect(hasOutfitRecommendationProvider()).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("posts the weather payload and returns a valid recommendation", async () => {
    vi.stubEnv(
      OUTFIT_RECOMMENDATION_API_URL_ENV,
      "https://weather-outfits.example/recommend-outfit",
    );
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(recommendation),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      fetchOutfitRecommendation(recommendationRequest),
    ).resolves.toEqual(recommendation);

    expect(hasOutfitRecommendationProvider()).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://weather-outfits.example/recommend-outfit",
      {
        body: JSON.stringify({
          temperature: 4,
          feelsLike: -1,
          windSpeed: 8,
          humidity: 82,
          condition: "rain",
          city: "Kyiv",
          gender: "woman",
        }),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        signal: undefined,
      },
    );
  });

  it("returns null for malformed service data", async () => {
    vi.stubEnv(
      OUTFIT_RECOMMENDATION_API_URL_ENV,
      "https://weather-outfits.example/recommend-outfit",
    );
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({ title: "Layers" }),
      }),
    );

    await expect(
      fetchOutfitRecommendation(recommendationRequest),
    ).resolves.toBeNull();
  });

  it("returns null when the request fails", async () => {
    vi.stubEnv(
      OUTFIT_RECOMMENDATION_API_URL_ENV,
      "https://weather-outfits.example/recommend-outfit",
    );
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    await expect(
      fetchOutfitRecommendation(recommendationRequest),
    ).resolves.toBeNull();
  });

  it("throws aborted requests so callers can treat them as control flow", async () => {
    vi.stubEnv(
      OUTFIT_RECOMMENDATION_API_URL_ENV,
      "https://weather-outfits.example/recommend-outfit",
    );
    const controller = new AbortController();
    controller.abort();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new DOMException("Aborted", "AbortError")),
    );

    await expect(
      fetchOutfitRecommendation(recommendationRequest, controller.signal),
    ).rejects.toThrow();
  });
});
