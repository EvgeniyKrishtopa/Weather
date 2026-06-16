import { beforeEach, describe, expect, it, vi } from "vitest";
import { fetchWeather } from "../api/weatherApi";
import { weatherFixture } from "../test/weatherFixture";
import {
  loadStoredLocation,
  saveStoredLocation,
} from "../utils/locationStorage";
import {
  clearStoredWeather,
  loadStoredWeather,
  saveStoredWeather,
} from "../utils/weatherStorage";
import { WeatherStore } from "./weatherStore";

vi.mock("../api/weatherApi", () => ({
  fetchWeather: vi.fn(),
}));

vi.mock("../utils/weatherStorage", () => ({
  clearStoredWeather: vi.fn(),
  loadStoredWeather: vi.fn(),
  saveStoredWeather: vi.fn(),
}));

vi.mock("../utils/locationStorage", () => ({
  loadStoredLocation: vi.fn(),
  saveStoredLocation: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(loadStoredWeather).mockReturnValue(null);
  vi.mocked(loadStoredLocation).mockReturnValue(null);
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

  it("restores and updates the selected location", () => {
    vi.mocked(loadStoredLocation).mockReturnValue({
      city: "Lviv",
      countryIso: "UA",
    });
    const store = new WeatherStore();

    expect(store.city).toBe("Lviv");
    expect(store.countryIso).toBe("UA");

    store.setCity("Kyiv");

    expect(saveStoredLocation).toHaveBeenLastCalledWith({
      city: "Kyiv",
      countryIso: "UA",
    });
  });

  it("retains the city while a new country is validated", () => {
    const store = new WeatherStore();

    store.setCity("Chicago");
    store.setCountryIso("UA");

    expect(store.city).toBe("Chicago");
    expect(store.countryIso).toBe("UA");
    expect(saveStoredLocation).toHaveBeenLastCalledWith({
      city: "Chicago",
      countryIso: "UA",
    });
    expect(clearStoredWeather).toHaveBeenCalled();
  });

  it("does not invalidate weather for unchanged selections", () => {
    const store = new WeatherStore();
    store.setCity("Chicago");
    store.weather = weatherFixture;
    vi.clearAllMocks();

    expect(store.setCity("Chicago")).toBe(false);
    expect(store.setCountryIso("US")).toBe(false);
    expect(store.weather).toEqual(weatherFixture);
    expect(clearStoredWeather).not.toHaveBeenCalled();
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
    expect(store.city).toBe("kyiv");
    expect(store.weather).toEqual(weatherFixture);
    expect(saveStoredWeather).toHaveBeenCalledWith({
      city: "kyiv",
      weather: weatherFixture,
    });
    expect(saveStoredLocation).toHaveBeenLastCalledWith({
      city: "kyiv",
      countryIso: "UA",
    });
  });

  it("stores an error separately from weather data", async () => {
    const errorResponse = { cod: 404, message: "City not found" };
    vi.mocked(fetchWeather).mockResolvedValue(errorResponse);
    const store = new WeatherStore();

    await store.getWeather("Missing", "US");

    expect(store.loading).toBe(false);
    expect(store.city).toBe("Missing");
    expect(store.weather).toBeNull();
    expect(store.error).toEqual(errorResponse);
    expect(saveStoredWeather).not.toHaveBeenCalled();
  });

  it("ignores a response after the city is cleared", async () => {
    let resolveRequest: ((value: typeof weatherFixture) => void) | undefined;
    vi.mocked(fetchWeather).mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );
    const store = new WeatherStore();

    const request = store.getWeather("Chicago", "US");
    store.setCity(null);
    resolveRequest?.({ ...weatherFixture, name: "Chicago" });
    await request;

    expect(store.city).toBeNull();
    expect(store.weather).toBeNull();
    expect(store.error).toBeNull();
    expect(store.loading).toBe(false);
    expect(saveStoredWeather).not.toHaveBeenCalled();
  });

  it("allows only the latest request to update weather", async () => {
    let resolveChicago: ((value: typeof weatherFixture) => void) | undefined;
    let resolveKyiv: ((value: typeof weatherFixture) => void) | undefined;
    vi.mocked(fetchWeather)
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveChicago = resolve;
        }),
      )
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveKyiv = resolve;
        }),
      );
    const store = new WeatherStore();

    const chicagoRequest = store.getWeather("Chicago", "US");
    const kyivRequest = store.getWeather("Kyiv", "UA");

    resolveKyiv?.(weatherFixture);
    await kyivRequest;
    resolveChicago?.({ ...weatherFixture, name: "Chicago" });
    await chicagoRequest;

    expect(store.city).toBe("Kyiv");
    expect(store.countryIso).toBe("UA");
    expect(store.weather).toEqual(weatherFixture);
    expect(saveStoredWeather).toHaveBeenCalledTimes(1);
    expect(saveStoredWeather).toHaveBeenCalledWith({
      city: "Kyiv",
      weather: weatherFixture,
    });
  });
});
