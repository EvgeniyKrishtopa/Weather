import { describe, expect, it, vi } from "vitest";
import worker from "./index";

const createRequest = (body: unknown): Request =>
  new Request("https://weather-outfits.example/recommend-outfit", {
    body: JSON.stringify(body),
    headers: { "Content-Type": "application/json" },
    method: "POST",
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

  it.each([
    {
      expectedTitle: "Warm layered outfit",
      payload: {
        ...validPayload,
        condition: "Clear",
        feelsLike: 0,
        humidity: 40,
        language: "en",
        languageName: "English",
      },
    },
    {
      expectedTitle: "Wind-smart layers",
      payload: {
        ...validPayload,
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
      payload: {
        ...validPayload,
        condition: "Clear",
        feelsLike: 27,
        humidity: 40,
        language: "en",
        languageName: "English",
      },
    },
    {
      expectedTitle: "Comfortable everyday layers",
      payload: {
        ...validPayload,
        condition: "Clear",
        feelsLike: 15,
        humidity: 40,
        language: "en",
        languageName: "English",
      },
    },
  ])(
    "returns the $expectedTitle fallback branch",
    async ({ expectedTitle, payload }) => {
      const response = await worker.fetch(createRequest(payload), {
        AI: {
          run: vi.fn().mockRejectedValue(new Error("offline")),
        },
      });

      expect(response.status).toBe(200);
      await expect(response.json()).resolves.toEqual(
        expect.objectContaining({
          title: expectedTitle,
        }),
      );
    },
  );
});
