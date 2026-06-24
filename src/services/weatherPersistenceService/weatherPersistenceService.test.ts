import { describe, expect, it, vi } from "vitest";
import {
  loadStoredLocation,
  saveStoredLocation,
} from "../../utils/locationStorage";
import {
  clearStoredWeather,
  loadStoredWeather,
  saveStoredWeather,
} from "../../utils/weatherStorage";
import type { StoredLocation } from "../../types/location";
import { weatherFixture } from "../../test/weatherFixture";
import { weatherPersistenceService } from ".";

vi.mock("../../utils/locationStorage", () => ({
  loadStoredLocation: vi.fn(),
  saveStoredLocation: vi.fn(),
}));

vi.mock("../../utils/weatherStorage", () => ({
  clearStoredWeather: vi.fn(),
  loadStoredWeather: vi.fn(),
  saveStoredWeather: vi.fn(),
}));

describe("weatherPersistenceService", () => {
  it("delegates selected location persistence", () => {
    const location: StoredLocation = {
      city: "Kyiv",
      countryIso: "UA",
      gender: "woman",
    };
    vi.mocked(loadStoredLocation).mockReturnValue(location);

    expect(weatherPersistenceService.loadStoredLocation()).toEqual(location);

    weatherPersistenceService.saveStoredLocation(location);

    expect(saveStoredLocation).toHaveBeenCalledWith(location);
  });

  it("delegates weather cache persistence", () => {
    const weather = { city: "Kyiv", weather: weatherFixture };
    vi.mocked(loadStoredWeather).mockReturnValue(weather);

    expect(weatherPersistenceService.loadStoredWeather()).toEqual(weather);

    weatherPersistenceService.saveStoredWeather(weather);
    weatherPersistenceService.clearStoredWeather();

    expect(saveStoredWeather).toHaveBeenCalledWith(weather);
    expect(clearStoredWeather).toHaveBeenCalled();
  });
});
