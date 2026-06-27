interface Env {
  AI: {
    run: (model: string, input: WorkersAiInput) => Promise<unknown>;
  };
}

interface OutfitRecommendationRequest {
  temperature: number;
  feelsLike: number;
  windSpeed: number;
  humidity: number;
  condition: string;
  city: string;
  gender: "woman" | "man";
}

interface OutfitRecommendation {
  title: string;
  items: string[];
  description: string;
}

interface WorkersAiInput {
  messages: Array<{
    role: "system" | "user";
    content: string;
  }>;
  max_tokens: number;
  temperature: number;
}

export const MODEL_POLICY = {
  primary: "@cf/meta/llama-3.2-3b-instruct",
  fallback: "@cf/meta/llama-3.2-1b-instruct",
  upgrade: "@cf/meta/llama-3.1-8b-instruct-fast",
} as const;

const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://EvgeniyKrishtopa.github.io",
  "https://evgeniykrishtopa.github.io",
]);

const recommendationSchema = {
  title: "Short outfit title",
  items: ["Three to five practical clothing items"],
  description: "One concise sentence explaining the weather fit",
};

const fallbackRecommendationItems = {
  woman: {
    cold: [
      "Insulated coat",
      "Thermal knit top",
      "Lined trousers",
      "Warm boots",
    ],
    mild: [
      "Light trench coat",
      "Long-sleeve blouse",
      "Tailored trousers",
      "Loafers",
    ],
    rainy: [
      "Water-resistant trench coat",
      "Warm knit layer",
      "Slim trousers",
      "Waterproof ankle boots",
    ],
    warm: [
      "Breathable blouse",
      "Light midi skirt",
      "Comfortable flats",
      "Sun hat",
    ],
    windy: [
      "Windproof jacket",
      "Layered blouse",
      "Straight-leg trousers",
      "Closed flats",
    ],
  },
  man: {
    cold: ["Warm parka", "Thermal crewneck", "Insulated chinos", "Warm boots"],
    mild: ["Light field jacket", "Oxford shirt", "Chinos", "Casual sneakers"],
    rainy: [
      "Water-resistant jacket",
      "Warm crewneck layer",
      "Chinos",
      "Waterproof sneakers",
    ],
    warm: ["Breathable polo", "Light chinos", "Comfortable sneakers", "Cap"],
    windy: ["Windbreaker", "Layered shirt", "Chinos", "Closed sneakers"],
  },
} as const;

const createCorsHeaders = (request: Request): HeadersInit => {
  const origin = request.headers.get("Origin");
  const allowOrigin = origin && allowedOrigins.has(origin) ? origin : "*";

  return {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Origin": allowOrigin,
    Vary: "Origin",
  };
};

const json = (
  request: Request,
  body: unknown,
  init: ResponseInit = {},
): Response =>
  Response.json(body, {
    ...init,
    headers: {
      ...createCorsHeaders(request),
      ...init.headers,
    },
  });

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const isOutfitRecommendationRequest = (
  value: unknown,
): value is OutfitRecommendationRequest => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const request = value as Record<string, unknown>;

  return (
    isFiniteNumber(request.temperature) &&
    isFiniteNumber(request.feelsLike) &&
    isFiniteNumber(request.windSpeed) &&
    isFiniteNumber(request.humidity) &&
    typeof request.condition === "string" &&
    request.condition.trim().length > 0 &&
    typeof request.city === "string" &&
    request.city.trim().length > 0 &&
    (request.gender === "woman" || request.gender === "man")
  );
};

const isOutfitRecommendation = (
  value: unknown,
): value is OutfitRecommendation => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const recommendation = value as Record<string, unknown>;

  return (
    typeof recommendation.title === "string" &&
    recommendation.title.trim().length > 0 &&
    Array.isArray(recommendation.items) &&
    recommendation.items.length > 0 &&
    recommendation.items.every(
      (item) => typeof item === "string" && item.trim().length > 0,
    ) &&
    typeof recommendation.description === "string" &&
    recommendation.description.trim().length > 0
  );
};

const normalizeRecommendation = (
  recommendation: OutfitRecommendation,
): OutfitRecommendation => ({
  title: recommendation.title.trim(),
  items: recommendation.items.map((item) => item.trim()).slice(0, 5),
  description: recommendation.description.trim(),
});

const parseAiResponse = (response: unknown): unknown => {
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

const createMessages = (
  request: OutfitRecommendationRequest,
): WorkersAiInput["messages"] => [
  {
    role: "system",
    content:
      "You are a concise outfit recommendation service. Return only JSON with this shape: " +
      JSON.stringify(recommendationSchema) +
      ". Use the gender field to tailor the clothing item names. Return distinct item lists for woman and man for the same weather. Do not include markdown, comments, or extra keys.",
  },
  {
    role: "user",
    content: JSON.stringify({
      ...request,
      audience:
        request.gender === "woman"
          ? "woman; use conventionally feminine outfit wording"
          : "man; use conventionally masculine outfit wording",
    }),
  },
];

const runRecommendationModel = async (
  env: Env,
  model: string,
  request: OutfitRecommendationRequest,
): Promise<OutfitRecommendation> => {
  const response = await env.AI.run(model, {
    messages: createMessages(request),
    max_tokens: 180,
    temperature: 0.2,
  });
  const parsedResponse = parseAiResponse(response);

  if (!isOutfitRecommendation(parsedResponse)) {
    throw new Error("Workers AI returned an invalid outfit recommendation");
  }

  return normalizeRecommendation(parsedResponse);
};

const createRecommendation = async (
  env: Env,
  request: OutfitRecommendationRequest,
): Promise<OutfitRecommendation> => {
  try {
    return await runRecommendationModel(env, MODEL_POLICY.primary, request);
  } catch {
    return runRecommendationModel(env, MODEL_POLICY.fallback, request);
  }
};

const createFallbackRecommendation = (
  request: OutfitRecommendationRequest,
): OutfitRecommendation => {
  const condition = request.condition.toLowerCase();
  const items = fallbackRecommendationItems[request.gender];
  const feelsCold = request.feelsLike <= 5;
  const feelsWarm = request.feelsLike >= 24;
  const feelsRainy =
    condition.includes("rain") ||
    condition.includes("drizzle") ||
    request.humidity >= 85;
  const feelsWindy = request.windSpeed >= 8;

  if (feelsRainy) {
    return {
      title: "Rain-ready warm layers",
      items: [...items.rainy],
      description:
        "Water-resistant outerwear and covered shoes keep the outfit practical for damp conditions.",
    };
  }

  if (feelsCold) {
    return {
      title: "Warm layered outfit",
      items: [...items.cold],
      description:
        "Insulating layers and warm shoes help balance the low feels-like temperature.",
    };
  }

  if (feelsWindy) {
    return {
      title: "Wind-smart layers",
      items: [...items.windy],
      description:
        "A windproof outer layer keeps the outfit comfortable without adding too much bulk.",
    };
  }

  if (feelsWarm) {
    return {
      title: "Light warm-weather outfit",
      items: [...items.warm],
      description:
        "Breathable pieces keep the outfit comfortable in warm current conditions.",
    };
  }

  return {
    title: "Comfortable everyday layers",
    items: [...items.mild],
    description:
      "Light layers provide enough flexibility for the current temperature and wind.",
  };
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: createCorsHeaders(request),
        status: 204,
      });
    }

    const url = new URL(request.url);

    if (request.method !== "POST" || url.pathname !== "/recommend-outfit") {
      return json(request, { message: "Not found" }, { status: 404 });
    }

    let payload: unknown;

    try {
      payload = await request.json();
    } catch {
      return json(request, { message: "Invalid JSON body" }, { status: 400 });
    }

    if (!isOutfitRecommendationRequest(payload)) {
      return json(
        request,
        { message: "Invalid outfit recommendation request" },
        { status: 400 },
      );
    }

    try {
      return json(request, await createRecommendation(env, payload));
    } catch (error) {
      console.error(
        error instanceof Error
          ? error.message
          : "Unable to create outfit recommendation",
      );

      return json(request, createFallbackRecommendation(payload));
    }
  },
};
