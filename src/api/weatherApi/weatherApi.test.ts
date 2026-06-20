import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchWeather } from ".";
import { weatherFixture } from "../../test/weatherFixture";
import { OPENWEATHER_API_KEY_ENV, OPENWEATHER_UNITS } from "../../constants";

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("fetchWeather", () => {
  it("returns a configuration error without an API key", async () => {
    vi.stubEnv(OPENWEATHER_API_KEY_ENV, "");

    await expect(fetchWeather("Kyiv", "UA")).resolves.toEqual({
      cod: "CLIENT_ERROR",
      message: "Weather API key is not configured",
    });
  });

  it("builds a metric request and returns valid weather data", async () => {
    vi.stubEnv(OPENWEATHER_API_KEY_ENV, "test-key");
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(weatherFixture),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchWeather("Kyiv", "UA")).resolves.toEqual(weatherFixture);

    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get("q")).toBe("Kyiv,UA");
    expect(requestUrl.searchParams.get("appid")).toBe("test-key");
    expect(requestUrl.searchParams.get("units")).toBe(OPENWEATHER_UNITS);
  });

  it("returns an error for malformed service data", async () => {
    vi.stubEnv(OPENWEATHER_API_KEY_ENV, "test-key");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({ cod: 200 }),
      }),
    );

    await expect(fetchWeather("Kyiv", "UA")).resolves.toEqual({
      cod: "CLIENT_ERROR",
      message: "Weather service returned an invalid response",
    });
  });

  it("returns an error when the request fails", async () => {
    vi.stubEnv(OPENWEATHER_API_KEY_ENV, "test-key");
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    await expect(fetchWeather("Kyiv", "UA")).resolves.toEqual({
      cod: "CLIENT_ERROR",
      message: "Unable to connect to the weather service",
    });
  });
});
