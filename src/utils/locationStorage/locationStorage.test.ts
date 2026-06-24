import { describe, expect, it, vi } from "vitest";
import { loadStoredLocation, saveStoredLocation } from ".";
import { SELECTED_LOCATION_STORAGE_KEY } from "../../constants";

const storageKey = SELECTED_LOCATION_STORAGE_KEY;

describe("locationStorage", () => {
  it("saves and loads a selected location", () => {
    saveStoredLocation({ city: "Kyiv", countryIso: "UA", gender: "woman" });

    expect(loadStoredLocation()).toEqual({
      city: "Kyiv",
      countryIso: "UA",
      gender: "woman",
    });
  });

  it("defaults missing stored gender to woman", () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ city: "Kyiv", countryIso: "UA" }),
    );

    expect(loadStoredLocation()).toEqual({
      city: "Kyiv",
      countryIso: "UA",
      gender: "woman",
    });
  });

  it.each([
    "{invalid json",
    JSON.stringify({ city: 10, countryIso: "UA" }),
    JSON.stringify({ city: "Kyiv", countryIso: "Ukraine" }),
    JSON.stringify({ city: "Kyiv", countryIso: "UA", gender: "other" }),
  ])("ignores invalid stored locations", (value) => {
    localStorage.setItem(storageKey, value);

    expect(loadStoredLocation()).toBeNull();
  });

  it("does not throw when localStorage rejects writes", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });

    expect(() =>
      saveStoredLocation({ city: "Kyiv", countryIso: "UA", gender: "woman" }),
    ).not.toThrow();
  });
});
