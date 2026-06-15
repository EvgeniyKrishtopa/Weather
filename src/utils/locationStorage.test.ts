import { describe, expect, it, vi } from "vitest";
import { loadStoredLocation, saveStoredLocation } from "./locationStorage";

const storageKey = "weather-app:selected-location";

describe("locationStorage", () => {
  it("saves and loads a selected location", () => {
    saveStoredLocation({ city: "Kyiv", countryIso: "UA" });

    expect(loadStoredLocation()).toEqual({
      city: "Kyiv",
      countryIso: "UA",
    });
  });

  it.each([
    "{invalid json",
    JSON.stringify({ city: 10, countryIso: "UA" }),
    JSON.stringify({ city: "Kyiv", countryIso: "Ukraine" }),
  ])("ignores invalid stored locations", (value) => {
    localStorage.setItem(storageKey, value);

    expect(loadStoredLocation()).toBeNull();
  });

  it("does not throw when localStorage rejects writes", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });

    expect(() =>
      saveStoredLocation({ city: "Kyiv", countryIso: "UA" }),
    ).not.toThrow();
  });
});
