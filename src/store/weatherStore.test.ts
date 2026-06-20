import { beforeEach, describe, expect, it, vi } from "vitest";
import { weatherFixture } from "../test/weatherFixture";
import { WeatherStore, type WeatherStoreServices } from "./weatherStore";

let services: WeatherStoreServices;

beforeEach(() => {
  services = {
    defaultCountryService: {
      getDefaultCountryIso: vi.fn().mockReturnValue("US"),
    },
    persistenceService: {
      clearStoredWeather: vi.fn(),
      loadStoredLocation: vi.fn().mockReturnValue(null),
      loadStoredWeather: vi.fn().mockReturnValue(null),
      saveStoredLocation: vi.fn(),
      saveStoredWeather: vi.fn(),
    },
    requestService: {
      fetchWeather: vi.fn(),
    },
  };
});

const createStore = () => new WeatherStore(services);

describe("WeatherStore", () => {
  it("restores stored weather", () => {
    vi.mocked(services.persistenceService.loadStoredWeather).mockReturnValue({
      city: "Kyiv",
      weather: weatherFixture,
    });

    const store = createStore();

    expect(store.city).toBe("Kyiv");
    expect(store.weather).toEqual(weatherFixture);
    expect(store.loading).toBe(false);
  });

  it("restores and updates the selected location", () => {
    vi.mocked(
      services.defaultCountryService.getDefaultCountryIso,
    ).mockReturnValue("CA");
    vi.mocked(services.persistenceService.loadStoredLocation).mockReturnValue({
      city: "Lviv",
      countryIso: "UA",
    });
    const store = createStore();

    expect(store.city).toBe("Lviv");
    expect(store.countryIso).toBe("UA");

    store.setCity("Kyiv");

    expect(
      services.persistenceService.saveStoredLocation,
    ).toHaveBeenLastCalledWith({
      city: "Kyiv",
      countryIso: "UA",
    });
  });

  it("defaults to the timezone country when no stored country exists", () => {
    vi.mocked(
      services.defaultCountryService.getDefaultCountryIso,
    ).mockReturnValue("UA");

    const store = createStore();

    expect(store.countryIso).toBe("UA");
    expect(
      services.persistenceService.saveStoredLocation,
    ).not.toHaveBeenCalled();
  });

  it("applies a geolocation country while the selection is still automatic", () => {
    vi.mocked(
      services.defaultCountryService.getDefaultCountryIso,
    ).mockReturnValue("US");
    const store = createStore();

    expect(store.applyDetectedCountryIso("UA")).toBe(true);

    expect(store.countryIso).toBe("UA");
    expect(store.city).toBeNull();
    expect(services.persistenceService.clearStoredWeather).toHaveBeenCalled();
    expect(
      services.persistenceService.saveStoredLocation,
    ).not.toHaveBeenCalled();
  });

  it("does not apply a geolocation country over a stored location", () => {
    vi.mocked(services.persistenceService.loadStoredLocation).mockReturnValue({
      city: "Lviv",
      countryIso: "UA",
    });
    const store = createStore();

    expect(store.applyDetectedCountryIso("CA")).toBe(false);

    expect(store.countryIso).toBe("UA");
    expect(store.city).toBe("Lviv");
    expect(
      services.persistenceService.clearStoredWeather,
    ).not.toHaveBeenCalled();
  });

  it("does not apply a late geolocation country after user selection", () => {
    const store = createStore();

    store.setCountryIso("UA");
    vi.clearAllMocks();

    expect(store.applyDetectedCountryIso("CA")).toBe(false);
    expect(store.countryIso).toBe("UA");
    expect(
      services.persistenceService.clearStoredWeather,
    ).not.toHaveBeenCalled();
  });

  it("does not apply a late geolocation country after a weather request", async () => {
    vi.mocked(services.requestService.fetchWeather).mockResolvedValue(
      weatherFixture,
    );
    const store = createStore();

    await store.getWeather("Chicago", "US");
    vi.clearAllMocks();

    expect(store.applyDetectedCountryIso("UA")).toBe(false);
    expect(store.countryIso).toBe("US");
    expect(store.city).toBe("Chicago");
    expect(
      services.persistenceService.clearStoredWeather,
    ).not.toHaveBeenCalled();
  });

  it("clears stale restored weather and city when geolocation changes country", () => {
    vi.mocked(services.persistenceService.loadStoredWeather).mockReturnValue({
      city: "Chicago",
      weather: { ...weatherFixture, name: "Chicago" },
    });
    const store = createStore();

    expect(store.applyDetectedCountryIso("UA")).toBe(true);

    expect(store.countryIso).toBe("UA");
    expect(store.city).toBeNull();
    expect(store.weather).toBeNull();
    expect(services.persistenceService.clearStoredWeather).toHaveBeenCalled();
  });

  it("falls back to United States when detected country is not available", () => {
    vi.mocked(
      services.defaultCountryService.getDefaultCountryIso,
    ).mockReturnValue("GB");
    const store = createStore();

    expect(store.reconcileDetectedCountryOptions(["UA", "US"])).toBe(true);

    expect(store.countryIso).toBe("US");
    expect(
      services.persistenceService.saveStoredLocation,
    ).not.toHaveBeenCalled();
  });

  it("retains the city while a new country is validated", () => {
    const store = createStore();

    store.setCity("Chicago");
    store.setCountryIso("UA");

    expect(store.city).toBe("Chicago");
    expect(store.countryIso).toBe("UA");
    expect(
      services.persistenceService.saveStoredLocation,
    ).toHaveBeenLastCalledWith({
      city: "Chicago",
      countryIso: "UA",
    });
    expect(services.persistenceService.clearStoredWeather).toHaveBeenCalled();
  });

  it("does not invalidate weather for unchanged selections", () => {
    const store = createStore();
    store.setCity("Chicago");
    store.weather = weatherFixture;
    vi.clearAllMocks();

    expect(store.setCity("Chicago")).toBe(false);
    expect(store.setCountryIso("US")).toBe(false);
    expect(store.weather).toEqual(weatherFixture);
    expect(
      services.persistenceService.clearStoredWeather,
    ).not.toHaveBeenCalled();
  });

  it("tracks a successful weather request and persists it", async () => {
    let resolveRequest: ((value: typeof weatherFixture) => void) | undefined;
    vi.mocked(services.requestService.fetchWeather).mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );
    const store = createStore();

    const request = store.getWeather("kyiv", "UA");

    expect(store.loading).toBe(true);

    resolveRequest?.(weatherFixture);
    await request;

    expect(store.loading).toBe(false);
    expect(store.city).toBe("kyiv");
    expect(store.weather).toEqual(weatherFixture);
    expect(services.persistenceService.saveStoredWeather).toHaveBeenCalledWith({
      city: "kyiv",
      weather: weatherFixture,
    });
    expect(
      services.persistenceService.saveStoredLocation,
    ).toHaveBeenLastCalledWith({
      city: "kyiv",
      countryIso: "UA",
    });
  });

  it("stores an error separately from weather data", async () => {
    const errorResponse = { cod: 404, message: "City not found" };
    vi.mocked(services.requestService.fetchWeather).mockResolvedValue(
      errorResponse,
    );
    const store = createStore();

    await store.getWeather("Missing", "US");

    expect(store.loading).toBe(false);
    expect(store.city).toBe("Missing");
    expect(store.weather).toBeNull();
    expect(store.error).toEqual(errorResponse);
    expect(
      services.persistenceService.saveStoredWeather,
    ).not.toHaveBeenCalled();
  });

  it("ignores a response after the city is cleared", async () => {
    let resolveRequest: ((value: typeof weatherFixture) => void) | undefined;
    vi.mocked(services.requestService.fetchWeather).mockReturnValue(
      new Promise((resolve) => {
        resolveRequest = resolve;
      }),
    );
    const store = createStore();

    const request = store.getWeather("Chicago", "US");
    store.setCity(null);
    resolveRequest?.({ ...weatherFixture, name: "Chicago" });
    await request;

    expect(store.city).toBeNull();
    expect(store.weather).toBeNull();
    expect(store.error).toBeNull();
    expect(store.loading).toBe(false);
    expect(
      services.persistenceService.saveStoredWeather,
    ).not.toHaveBeenCalled();
  });

  it("allows only the latest request to update weather", async () => {
    let resolveChicago: ((value: typeof weatherFixture) => void) | undefined;
    let resolveKyiv: ((value: typeof weatherFixture) => void) | undefined;
    vi.mocked(services.requestService.fetchWeather)
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
    const store = createStore();

    const chicagoRequest = store.getWeather("Chicago", "US");
    const kyivRequest = store.getWeather("Kyiv", "UA");

    resolveKyiv?.(weatherFixture);
    await kyivRequest;
    resolveChicago?.({ ...weatherFixture, name: "Chicago" });
    await chicagoRequest;

    expect(store.city).toBe("Kyiv");
    expect(store.countryIso).toBe("UA");
    expect(store.weather).toEqual(weatherFixture);
    expect(services.persistenceService.saveStoredWeather).toHaveBeenCalledTimes(
      1,
    );
    expect(services.persistenceService.saveStoredWeather).toHaveBeenCalledWith({
      city: "Kyiv",
      weather: weatherFixture,
    });
  });
});
