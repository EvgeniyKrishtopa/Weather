import { describe, expect, it } from "vitest";
import {
  createCorsHeaders,
  getAllowedCorsOrigin,
  isCorsOriginAllowed,
  json,
} from "./http";

const createRequest = (headers: Record<string, string> = {}): Request =>
  new Request("https://weather-outfits.example/recommend-outfit", {
    headers,
  });

describe("outfit recommendation Worker HTTP helpers", () => {
  it("allows configured browser origins", () => {
    const request = createRequest({ Origin: "http://localhost:5174" });

    expect(getAllowedCorsOrigin(request)).toBe("http://localhost:5174");
    expect(isCorsOriginAllowed(request)).toBe(true);
    expect(createCorsHeaders(request)).toEqual({
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Origin": "http://localhost:5174",
      Vary: "Origin",
    });
  });

  it("rejects unknown browser origins", () => {
    const request = createRequest({ Origin: "https://unknown.example" });

    expect(getAllowedCorsOrigin(request)).toBeNull();
    expect(isCorsOriginAllowed(request)).toBe(false);
    expect(createCorsHeaders(request)).toEqual({ Vary: "Origin" });
  });

  it("allows requests without an Origin header", () => {
    const request = createRequest();

    expect(getAllowedCorsOrigin(request)).toBe("*");
    expect(isCorsOriginAllowed(request)).toBe(true);
  });

  it("adds CORS headers to JSON responses", async () => {
    const response = json(
      createRequest({ Origin: "http://localhost:5173" }),
      { ok: true },
      { status: 201 },
    );

    expect(response.status).toBe(201);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      "http://localhost:5173",
    );
    await expect(response.json()).resolves.toEqual({ ok: true });
  });
});
