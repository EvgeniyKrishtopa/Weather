import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCountryIsoByCoordinates } from ".";
import {
  OPENWEATHER_API_KEY_ENV,
  OPENWEATHER_REVERSE_GEOCODING_LIMIT,
} from "../../constants";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("fetchCountryIsoByCoordinates", () => {
  it("returns null without an API key", async () => {
    vi.stubEnv(OPENWEATHER_API_KEY_ENV, "");

    await expect(
      fetchCountryIsoByCoordinates(50.45, 30.52),
    ).resolves.toBeNull();
  });

  it("requests reverse geocoding coordinates and returns a valid ISO code", async () => {
    vi.stubEnv(OPENWEATHER_API_KEY_ENV, "test-key");
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue([{ country: "UA" }]),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchCountryIsoByCoordinates(50.45, 30.52)).resolves.toBe(
      "UA",
    );

    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get("lat")).toBe("50.45");
    expect(requestUrl.searchParams.get("lon")).toBe("30.52");
    expect(requestUrl.searchParams.get("limit")).toBe(
      OPENWEATHER_REVERSE_GEOCODING_LIMIT,
    );
    expect(requestUrl.searchParams.get("appid")).toBe("test-key");
  });

  it("returns null for malformed service data", async () => {
    vi.stubEnv(OPENWEATHER_API_KEY_ENV, "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue([{ country: "Ukraine" }]),
      }),
    );

    await expect(
      fetchCountryIsoByCoordinates(50.45, 30.52),
    ).resolves.toBeNull();
  });

  it("returns null when reverse geocoding fails", async () => {
    vi.stubEnv(OPENWEATHER_API_KEY_ENV, "test-key");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    await expect(
      fetchCountryIsoByCoordinates(50.45, 30.52),
    ).resolves.toBeNull();
  });
});
