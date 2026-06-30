import { isOutfitRecommendationRequest } from "./contracts";
import { createFallbackRecommendation } from "./fallbackRecommendations";
import { createCorsHeaders, isCorsOriginAllowed, json } from "./http";
import { createRecommendation, MODEL_POLICY } from "./recommendationModel";
import type { Env } from "./types";

export { MODEL_POLICY };

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      if (!isCorsOriginAllowed(request)) {
        return new Response(null, {
          headers: { Vary: "Origin" },
          status: 403,
        });
      }

      return new Response(null, {
        headers: createCorsHeaders(request),
        status: 204,
      });
    }

    const url = new URL(request.url);

    if (request.method !== "POST" || url.pathname !== "/recommend-outfit") {
      return json(request, { message: "Not found" }, { status: 404 });
    }

    if (!isCorsOriginAllowed(request)) {
      return json(request, { message: "Origin not allowed" }, { status: 403 });
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
