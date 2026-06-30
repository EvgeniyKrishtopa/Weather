import { isOutfitRecommendation, normalizeRecommendation } from "./contracts";
import type {
  Env,
  OutfitRecommendation,
  OutfitRecommendationRequest,
  WorkersAiInput,
} from "./types";

export const MODEL_POLICY = {
  primary: "@cf/google/gemma-4-26b-a4b-it",
  fallback: "@cf/meta/llama-3.2-3b-instruct",
  upgrade: "@cf/meta/llama-3.1-8b-instruct-fast",
} as const;

const recommendationSchema = {
  title: "Short outfit title",
  items: ["Three to five practical clothing items"],
  description: "One concise sentence explaining the weather fit",
};

export const parseAiResponse = (response: unknown): unknown => {
  if (isOutfitRecommendation(response)) {
    return response;
  }

  if (!response || typeof response !== "object") {
    return null;
  }

  const responseRecord = response as Record<string, unknown>;
  const responseValue = responseRecord.response;

  if (isOutfitRecommendation(responseValue)) {
    return responseValue;
  }

  if (typeof responseValue !== "string") {
    return null;
  }

  const trimmedResponse = responseValue.trim();
  const jsonStart = trimmedResponse.indexOf("{");
  const jsonEnd = trimmedResponse.lastIndexOf("}");

  if (jsonStart !== -1 && jsonEnd > jsonStart) {
    try {
      return JSON.parse(
        trimmedResponse.slice(jsonStart, jsonEnd + 1),
      ) as unknown;
    } catch {
      return null;
    }
  }

  try {
    return JSON.parse(trimmedResponse) as unknown;
  } catch {
    return null;
  }
};

export const createMessages = (
  request: OutfitRecommendationRequest,
): WorkersAiInput["messages"] => [
  {
    role: "system",
    content:
      "You are a concise outfit recommendation service. Return only JSON with this shape: " +
      JSON.stringify(recommendationSchema) +
      `. All title, every items[] value, and description must be written only in ${request.languageName}. ` +
      `Do not mix languages. Do not use translations in another language, transliteration, or English fallback unless responseLanguage is English (en). ` +
      "Use the gender field to tailor the clothing item names. Return distinct item lists for woman and man for the same weather. Do not include markdown, comments, or extra keys.",
  },
  {
    role: "user",
    content: JSON.stringify({
      ...request,
      audience:
        request.gender === "woman"
          ? "woman; use conventionally feminine outfit wording"
          : "man; use conventionally masculine outfit wording",
      responseLanguage: `${request.languageName} (${request.language})`,
    }),
  },
];

export const runRecommendationModel = async (
  env: Env,
  model: string,
  request: OutfitRecommendationRequest,
): Promise<OutfitRecommendation> => {
  const response = await env.AI.run(model, {
    messages: createMessages(request),
    max_completion_tokens: 180,
    temperature: 0.2,
  });
  const parsedResponse = parseAiResponse(response);

  if (!isOutfitRecommendation(parsedResponse)) {
    throw new Error("Workers AI returned an invalid outfit recommendation");
  }

  return normalizeRecommendation(parsedResponse);
};

export const createRecommendation = async (
  env: Env,
  request: OutfitRecommendationRequest,
): Promise<OutfitRecommendation> => {
  try {
    return await runRecommendationModel(env, MODEL_POLICY.primary, request);
  } catch {
    return runRecommendationModel(env, MODEL_POLICY.fallback, request);
  }
};
