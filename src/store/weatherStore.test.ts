import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchWeather } from "../api/weatherApi";
import { weatherFixture } from "../test/weatherFixture";
import { loadStoredWeather, saveStoredWeather } from "../utils/weatherStorage";
import { WeatherStore } from "./weatherStore";

vi.mock("../api/weatherApi", () => ({
  fetchWeather: vi.fn(),
}));

vi.mock("../utils/weatherStorage", () => ({
  loadStoredWeather: vi.fn(),
  saveStoredWeather: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(loadStoredWeather).mockReturnValue(null);
});

describe("WeatherStore", () => {
  it("restores stored weather", () => {
    vi.mocked(loadStoredWeather).mockReturnValue({
      city: "Kyiv",
      weather: weatherFixture,
    });

    const store = new WeatherStore();

    expect(store.city).toBe("Kyiv");
    expect(store.weather).toEqual(weatherFixture);
    expect(store.loading).toBe(false);
  });

  it("tracks a successful weather request and persists it", async () => {
    let resolveRequest: ((value: typeof weatherFixture) => void) | undefined;
    vi.mocked(fetchWeather).mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );
    const store = new WeatherStore();

    const request = store.getWeather("kyiv", "UA");

    expect(store.loading).toBe(true);

    resolveRequest?.(weatherFixture);
    await request;

    expect(store.loading).toBe(false);
    expect(store.city).toBe(weatherFixture.name);
    expect(store.weather).toEqual(weatherFixture);
    expect(saveStoredWeather).toHaveBeenCalledWith({
      city: weatherFixture.name,
      weather: weatherFixture,
    });
  });

  it("keeps the requested city for an error response", async () => {
    const errorResponse = { cod: 404, message: "City not found" };
    vi.mocked(fetchWeather).mockResolvedValue(errorResponse);
    const store = new WeatherStore();

    await store.getWeather("Missing", "US");

    expect(store.loading).toBe(false);
    expect(store.city).toBe("Missing");
    expect(store.weather).toEqual(errorResponse);
    expect(saveStoredWeather).not.toHaveBeenCalled();
  });
});
