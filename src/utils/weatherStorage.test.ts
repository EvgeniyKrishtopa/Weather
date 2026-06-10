import { describe, expect, it, vi } from "vitest";
import { loadStoredWeather, saveStoredWeather } from "./weatherStorage";
import { weatherFixture } from "../test/weatherFixture";

const storageKey = "weather-app:last-weather";

describe("weatherStorage", () => {
  it("saves and loads valid weather data", () => {
    saveStoredWeather({ city: "Kyiv", weather: weatherFixture });

    expect(loadStoredWeather()).toEqual({
      city: "Kyiv",
      weather: weatherFixture,
    });
  });

  it.each([
    "{invalid json",
    JSON.stringify({ city: "Kyiv" }),
    JSON.stringify({ city: 10, weather: weatherFixture }),
    JSON.stringify({
      city: "Kyiv",
      weather: { cod: "404", message: "not found" },
    }),
  ])("ignores invalid cached data", (value) => {
    localStorage.setItem(storageKey, value);
    expect(loadStoredWeather()).toBeNull();
  });

  it("returns null when the cache is empty", () => {
    expect(loadStoredWeather()).toBeNull();
  });

  it("does not throw when localStorage rejects writes", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });

    expect(() =>
      saveStoredWeather({ city: "Kyiv", weather: weatherFixture })
    ).not.toThrow();
  });
});
