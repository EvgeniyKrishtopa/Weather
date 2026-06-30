import { describe, expect, it, vi } from "vitest";
import worker from "./index";

const createRequest = (
  body: unknown,
  headers: Record<string, string> = {},
): Request =>
  new Request("https://weather-outfits.example/recommend-outfit", {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json", ...headers },
    method: "POST",
  });

const createOptionsRequest = (origin: string): Request =>
  new Request("https://weather-outfits.example/recommend-outfit", {
    headers: {
      "Access-Control-Request-Method": "POST",
      Origin: origin,
    },
    method: "OPTIONS",
  });

const validPayload = {
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

describe("outfit recommendation Worker localization", () => {
  it("allows configured browser origins in preflight responses", async () => {
    const response = await worker.fetch(
      createOptionsRequest("http://localhost:5174"),
      {
        AI: {
          run: vi.fn(),
        },
      },
    );

    expect(response.status).toBe(204);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBe(
      "http://localhost:5174",
    );
    expect(response.headers.get("Access-Control-Allow-Methods")).toBe(
      "POST, OPTIONS",
    );
  });

  it("rejects unknown browser origins before running Workers AI", async () => {
    const run = vi.fn();
    const response = await worker.fetch(
      createRequest(validPayload, { Origin: "https://unknown.example" }),
      {
        AI: { run },
      },
    );

    expect(response.status).toBe(403);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
    await expect(response.json()).resolves.toEqual({
      message: "Origin not allowed",
    });
    expect(run).not.toHaveBeenCalled();
  });

  it("rejects unknown browser origins in preflight responses", async () => {
    const response = await worker.fetch(
      createOptionsRequest("https://unknown.example"),
      {
        AI: {
          run: vi.fn(),
        },
      },
    );

    expect(response.status).toBe(403);
    expect(response.headers.get("Access-Control-Allow-Origin")).toBeNull();
  });

  it("returns not found for unsupported routes", async () => {
    const response = await worker.fetch(
      new Request("https://weather-outfits.example/unknown", {
        method: "POST",
      }),
      {
        AI: {
          run: vi.fn(),
        },
      },
    );

    expect(response.status).toBe(404);
    await expect(response.json()).resolves.toEqual({
      message: "Not found",
    });
  });

  it("rejects invalid JSON bodies", async () => {
    const response = await worker.fetch(
      new Request("https://weather-outfits.example/recommend-outfit", {
        body: "{bad json",
        headers: { "Content-Type": "application/json" },
        method: "POST",
      }),
      {
        AI: {
          run: vi.fn(),
        },
      },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: "Invalid JSON body",
    });
  });

  it("rejects unsupported languages", async () => {
    const response = await worker.fetch(
      createRequest({
        ...validPayload,
        language: "pt",
        languageName: "Portuguese",
      }),
      {
        AI: {
          run: vi.fn(),
        },
      },
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      message: "Invalid outfit recommendation request",
    });
  });

  it("asks Workers AI to respond in the selected language", async () => {
    const run = vi.fn().mockResolvedValue({
      response: JSON.stringify({
        title: "Strati per la pioggia",
        items: ["Trench impermeabile", "Stivaletti"],
        description: "Una risposta in italiano.",
      }),
    });

    const response = await worker.fetch(createRequest(validPayload), {
      AI: { run },
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      title: "Strati per la pioggia",
      items: ["Trench impermeabile", "Stivaletti"],
      description: "Una risposta in italiano.",
    });
    expect(run).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        messages: expect.arrayContaining([
          expect.objectContaining({
            content: expect.stringContaining("Italian"),
            role: "system",
          }),
        ]),
      }),
    );
  });

  it("returns localized fallback recommendations when AI fails", async () => {
    const response = await worker.fetch(createRequest(validPayload), {
      AI: {
        run: vi.fn().mockRejectedValue(new Error("offline")),
      },
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
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
});
