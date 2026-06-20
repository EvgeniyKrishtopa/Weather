import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { fetchCities, fetchCountries } from "../../../api/locationApi";
import type { WeatherStore } from "../../../store/weatherStore";
import { useLocationOptions } from ".";

vi.mock("../../../api/locationApi", () => ({
  fetchCities: vi.fn(),
  fetchCountries: vi.fn(),
}));

type LocationOptionsStore = Pick<
  WeatherStore,
  | "city"
  | "countryIso"
  | "getWeather"
  | "reconcileDetectedCountryOptions"
  | "setCity"
>;

const createStore = (
  overrides: Partial<LocationOptionsStore> = {},
): LocationOptionsStore => ({
  city: null,
  countryIso: "UA",
  getWeather: vi.fn(),
  reconcileDetectedCountryOptions: vi.fn(),
  setCity: vi.fn(),
  ...overrides,
});

interface TestComponentProps {
  store: LocationOptionsStore;
}

const TestComponent = ({ store }: TestComponentProps) => {
  const {
    cities,
    citiesLoading,
    countries,
    countriesLoading,
    locationError,
    prepareCountryChange,
    selectedCountry,
  } = useLocationOptions(store);

  return (
    <div>
      <div data-testid="countries-loading">{String(countriesLoading)}</div>
      <div data-testid="cities-loading">{String(citiesLoading)}</div>
      <div data-testid="countries">
        {countries.map(({ name }) => name).join(",")}
      </div>
      <div data-testid="cities">{cities.join(",")}</div>
      <div data-testid="selected-country">{selectedCountry?.name ?? ""}</div>
      <div data-testid="location-error">{locationError}</div>
      <button type="button" onClick={() => prepareCountryChange("CA")}>
        Prepare country change
      </button>
    </div>
  );
};

describe("useLocationOptions", () => {
  it("loads countries, reconciles options, and loads cities for the selected country", async () => {
    const store = createStore();
    vi.mocked(fetchCountries).mockResolvedValue([
      { name: "Ukraine", iso2: "UA" },
      { name: "United States", iso2: "US" },
    ]);
    vi.mocked(fetchCities).mockResolvedValue(["Kyiv", "Lviv"]);

    render(<TestComponent store={store} />);

    await waitFor(() =>
      expect(screen.getByTestId("countries-loading")).toHaveTextContent(
        "false",
      ),
    );

    expect(screen.getByTestId("countries")).toHaveTextContent(
      "Ukraine,United States",
    );
    expect(screen.getByTestId("selected-country")).toHaveTextContent("Ukraine");
    expect(store.reconcileDetectedCountryOptions).toHaveBeenCalledWith([
      "UA",
      "US",
    ]);

    await waitFor(() =>
      expect(screen.getByTestId("cities")).toHaveTextContent("Kyiv,Lviv"),
    );
    expect(fetchCities).toHaveBeenCalledWith(
      "Ukraine",
      expect.any(AbortSignal),
    );
  });

  it("requests weather for a retained city after a prepared country change", async () => {
    const store = createStore({
      city: "Toronto",
      countryIso: "CA",
    });
    vi.mocked(fetchCountries).mockResolvedValue([
      { name: "Canada", iso2: "CA" },
    ]);
    vi.mocked(fetchCities).mockResolvedValue(["Toronto"]);

    render(<TestComponent store={store} />);

    screen.getByRole("button", { name: "Prepare country change" }).click();

    await waitFor(() =>
      expect(store.getWeather).toHaveBeenCalledWith("Toronto", "CA"),
    );
    expect(store.setCity).not.toHaveBeenCalled();
  });

  it("clears a retained city when it is invalid for the loaded country", async () => {
    const store = createStore({
      city: "Chicago",
      countryIso: "CA",
    });
    vi.mocked(fetchCountries).mockResolvedValue([
      { name: "Canada", iso2: "CA" },
    ]);
    vi.mocked(fetchCities).mockResolvedValue(["Toronto"]);

    render(<TestComponent store={store} />);

    screen.getByRole("button", { name: "Prepare country change" }).click();

    await waitFor(() => expect(store.setCity).toHaveBeenCalledWith(null));
    expect(store.getWeather).not.toHaveBeenCalled();
  });

  it("shows a location loading error", async () => {
    const store = createStore();
    vi.mocked(fetchCountries).mockRejectedValue(
      new Error("Unable to load countries."),
    );

    render(<TestComponent store={store} />);

    expect(await screen.findByText("Unable to load countries.")).toBeVisible();
    expect(screen.getByTestId("countries-loading")).toHaveTextContent("false");
  });
});
