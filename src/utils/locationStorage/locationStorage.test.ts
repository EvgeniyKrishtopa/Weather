import { describe, expect, it, vi } from "vitest";
import { loadStoredLocation, saveStoredLocation } from ".";
import { SELECTED_LOCATION_STORAGE_KEY } from "../../constants";
import { GenderSelection } from "../../types/location";

const storageKey = SELECTED_LOCATION_STORAGE_KEY;

describe("locationStorage", () => {
  it("saves and loads a selected location", () => {
    saveStoredLocation({
      city: "Kyiv",
      countryIso: "UA",
      outfitProfile: GenderSelection.Woman,
    });

    expect(loadStoredLocation()).toEqual({
      city: "Kyiv",
      countryIso: "UA",
      outfitProfile: GenderSelection.Woman,
    });
  });

  it("stores the outfit profile under a neutral key and value", () => {
    saveStoredLocation({
      city: "Kyiv",
      countryIso: "UA",
      outfitProfile: GenderSelection.Woman,
    });

    expect(localStorage.getItem(storageKey)).toBe(
      JSON.stringify({
        city: "Kyiv",
        countryIso: "UA",
        outfitProfile: "profile-a",
      }),
    );
  });

  it("defaults missing stored outfit profile to woman", () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ city: "Kyiv", countryIso: "UA" }),
    );

    expect(loadStoredLocation()).toEqual({
      city: "Kyiv",
      countryIso: "UA",
      outfitProfile: GenderSelection.Woman,
    });
  });

  it("restores the legacy stored gender field as an outfit profile", () => {
    localStorage.setItem(
      storageKey,
      JSON.stringify({ city: "Kyiv", countryIso: "UA", gender: "man" }),
    );

    expect(loadStoredLocation()).toEqual({
      city: "Kyiv",
      countryIso: "UA",
      outfitProfile: GenderSelection.Man,
    });
  });

  it.each([
    "{invalid json",
    JSON.stringify({ city: 10, countryIso: "UA" }),
    JSON.stringify({ city: "Kyiv", countryIso: "Ukraine" }),
    JSON.stringify({ city: "Kyiv", countryIso: "UA", outfitProfile: "other" }),
  ])("ignores invalid stored locations", (value) => {
    localStorage.setItem(storageKey, value);

    expect(loadStoredLocation()).toBeNull();
  });

  it("does not throw when localStorage rejects writes", () => {
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("quota exceeded");
    });

    expect(() =>
      saveStoredLocation({
        city: "Kyiv",
        countryIso: "UA",
        outfitProfile: GenderSelection.Woman,
      }),
    ).not.toThrow();
  });
});
