const allowedOrigins = new Set([
  "http://localhost:5173",
  "http://localhost:5174",
  "http://127.0.0.1:5173",
  "http://127.0.0.1:5174",
  "https://EvgeniyKrishtopa.github.io",
  "https://evgeniykrishtopa.github.io",
]);

export const getAllowedCorsOrigin = (request: Request): string | null => {
  const origin = request.headers.get("Origin");

  if (!origin) {
    return "*";
  }

  return allowedOrigins.has(origin) ? origin : null;
};

export const createCorsHeaders = (request: Request): HeadersInit => {
  const allowOrigin = getAllowedCorsOrigin(request);

  if (!allowOrigin) {
    return {
      Vary: "Origin",
    };
  }

  return {
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Origin": allowOrigin,
    Vary: "Origin",
  };
};

export const isCorsOriginAllowed = (request: Request): boolean =>
  getAllowedCorsOrigin(request) !== null;

export const json = (
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
