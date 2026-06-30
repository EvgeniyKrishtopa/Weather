import { describe, expect, it, vi } from "vitest";
import {
  createMessages,
  createRecommendation,
  MODEL_POLICY,
  parseAiResponse,
  runRecommendationModel,
} from "./recommendationModel";
import type { Env, OutfitRecommendationRequest } from "./types";

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

const recommendation = {
  title: "Rain layers",
  items: ["Trench", "Boots"],
  description: "Useful in rain.",
};

describe("outfit recommendation model orchestration", () => {
  it("uses Gemma 4 as the primary model and Llama as the fallback model", () => {
    expect(MODEL_POLICY.primary).toBe("@cf/google/gemma-4-26b-a4b-it");
    expect(MODEL_POLICY.fallback).toBe("@cf/meta/llama-3.2-3b-instruct");
  });

  it.each([
    recommendation,
    { response: recommendation },
    { response: JSON.stringify(recommendation) },
    { response: `Here is JSON: ${JSON.stringify(recommendation)}` },
  ])("parses Workers AI response variants: %j", (response) => {
    expect(parseAiResponse(response)).toEqual(recommendation);
  });

  it.each([null, {}, { response: "" }, { response: "{bad json" }])(
    "returns null for invalid AI responses: %j",
    (response) => {
      expect(parseAiResponse(response)).toBeNull();
    },
  );

  it("creates localized gender-aware model messages", () => {
    const messages = createMessages(request);

    expect(messages).toEqual([
      expect.objectContaining({
        content: expect.stringContaining("Italian"),
        role: "system",
      }),
      expect.objectContaining({
        content: expect.stringContaining(
          "woman; use conventionally feminine outfit wording",
        ),
        role: "user",
      }),
    ]);
    expect(messages[0].content).toContain(
      "All title, every items[] value, and description must be written only in Italian.",
    );
    expect(messages[0].content).toContain("Do not mix languages.");
  });

  it("forbids English or mixed-language output for Ukrainian recommendations", () => {
    const messages = createMessages({
      ...request,
      language: "uk",
      languageName: "Ukrainian",
    });

    expect(messages[0].content).toContain(
      "All title, every items[] value, and description must be written only in Ukrainian.",
    );
    expect(messages[0].content).toContain(
      "Do not use translations in another language, transliteration, or English fallback unless responseLanguage is English (en).",
    );
  });

  it("runs the selected model and normalizes a valid recommendation", async () => {
    const env: Env = {
      AI: {
        run: vi.fn().mockResolvedValue({
          response: JSON.stringify({
            title: " Rain layers ",
            items: [" Trench ", " Boots "],
            description: " Useful in rain. ",
          }),
        }),
      },
    };

    await expect(
      runRecommendationModel(env, MODEL_POLICY.primary, request),
    ).resolves.toEqual(recommendation);
    expect(env.AI.run).toHaveBeenCalledWith(
      MODEL_POLICY.primary,
      expect.not.objectContaining({
        max_tokens: expect.anything(),
      }),
    );
    expect(env.AI.run).toHaveBeenCalledWith(
      MODEL_POLICY.primary,
      expect.objectContaining({
        max_completion_tokens: 180,
      }),
    );
  });

  it("tries the fallback model when the primary model fails", async () => {
    const run = vi
      .fn()
      .mockRejectedValueOnce(new Error("primary offline"))
      .mockResolvedValueOnce({ response: JSON.stringify(recommendation) });
    const env: Env = { AI: { run } };

    await expect(createRecommendation(env, request)).resolves.toEqual(
      recommendation,
    );
    expect(run).toHaveBeenNthCalledWith(
      1,
      MODEL_POLICY.primary,
      expect.any(Object),
    );
    expect(run).toHaveBeenNthCalledWith(
      2,
      MODEL_POLICY.fallback,
      expect.any(Object),
    );
  });

  it("rejects invalid model output", async () => {
    const env: Env = {
      AI: {
        run: vi.fn().mockResolvedValue({ response: "{}" }),
      },
    };

    await expect(
      runRecommendationModel(env, MODEL_POLICY.primary, request),
    ).rejects.toThrow("Workers AI returned an invalid outfit recommendation");
  });
});
