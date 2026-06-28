import React, { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import type { SupportedLanguage } from "../../../i18n";
import type { WeatherStore } from "../../../store/weatherStore";
import { useLocationOptions } from ".";

type LocationOptionsStore = Pick<
  WeatherStore,
  "city" | "countryIso" | "getWeather" | "setCity"
>;

const createStore = (
  overrides: Partial<LocationOptionsStore> = {},
): LocationOptionsStore => ({
  city: null,
  countryIso: "UA",
  getWeather: vi.fn(),
  setCity: vi.fn(),
  ...overrides,
});

interface TestComponentProps {
  language?: SupportedLanguage;
  nextCountryIso?: string;
  store: LocationOptionsStore;
}

const TestComponent = ({
  language = "en",
  nextCountryIso = "US",
  store,
}: TestComponentProps) => {
  const [countryIso, setCountryIso] = useState(store.countryIso);
  const [, forceRender] = useState(0);
  const currentStore = {
    ...store,
    countryIso,
  };
  const { cities, countries, prepareCountryChange, selectedCountry } =
    useLocationOptions(currentStore, language);

  return (
    <div>
      <div data-testid="countries">
        {countries.map(({ name }) => name).join(",")}
      </div>
      <div data-testid="cities">
        {cities
          .slice(0, 2)
          .map(({ label, value }) => `${label}:${value}`)
          .join(",")}
      </div>
      <div data-testid="selected-country">{selectedCountry?.name ?? ""}</div>
      <button
        type="button"
        onClick={() => {
          prepareCountryChange(nextCountryIso);
          setCountryIso(nextCountryIso);
          forceRender((value) => value + 1);
        }}
      >
        Prepare country change
      </button>
    </div>
  );
};

describe("useLocationOptions", () => {
  it("returns static countries and curated cities for the selected country", () => {
    const store = createStore();

    render(<TestComponent store={store} />);

    expect(screen.getByTestId("countries")).toHaveTextContent(
      "Ukraine,Russia,United States,United Kingdom,Spain,Italy,Germany,France",
    );
    expect(screen.getByTestId("selected-country")).toHaveTextContent("Ukraine");
    expect(screen.getByTestId("cities")).toHaveTextContent(
      "Kyiv:Kyiv,Kharkiv:Kharkiv",
    );
  });

  it("creates localized city labels while keeping canonical city values", () => {
    const store = createStore({ countryIso: "IT" });

    render(<TestComponent language="it" store={store} />);

    expect(screen.getByTestId("cities")).toHaveTextContent(
      "Roma:Rome,Milano:Milan",
    );
  });

  it("requests weather for a retained city after a prepared country change", async () => {
    const store = createStore({
      city: "Chicago",
      countryIso: "US",
    });

    render(<TestComponent nextCountryIso="US" store={store} />);

    screen.getByRole("button", { name: "Prepare country change" }).click();

    await waitFor(() =>
      expect(store.getWeather).toHaveBeenCalledWith("Chicago", "US"),
    );
    expect(store.setCity).not.toHaveBeenCalled();
  });

  it("clears a retained city when it is invalid for the selected country", async () => {
    const store = createStore({
      city: "Chicago",
      countryIso: "UA",
    });

    render(<TestComponent store={store} />);

    await waitFor(() => expect(store.setCity).toHaveBeenCalledWith(null));
    expect(store.getWeather).not.toHaveBeenCalled();
  });
});
