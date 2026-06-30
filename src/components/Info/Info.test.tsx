import React from "react";
import { render, screen } from "@testing-library/react";
import { runInAction } from "mobx";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OUTFIT_RECOMMENDATION_API_URL_ENV } from "../../constants";
import { WeatherContext } from "../../context/weatherContext";
import { WeatherStore } from "../../store/weatherStore";
import { GenderSelection } from "../../types/location";
import type { WeatherSuccess } from "../../types/weather";
import Info from ".";

const unknownWeather: WeatherSuccess = {
  cod: 200,
  name: "Kyiv",
  main: {
    temp: 10,
    feels_like: 8,
    humidity: 50,
  },
  weather: [{ main: "Volcanic ash" }],
  wind: {
    speed: 2,
  },
};

const createStore = (
  weather: WeatherSuccess,
  city = weather.name,
  countryIso = "US",
): WeatherStore => {
  const store = new WeatherStore();

  runInAction(() => {
    store.countryIso = countryIso;
    store.weather = weather;
    store.city = city;
  });

  return store;
};

beforeEach(() => {
  vi.stubEnv(OUTFIT_RECOMMENDATION_API_URL_ENV, "");
});

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("weather information", () => {
  it("uses a fallback icon for unknown weather conditions", () => {
    render(
      <WeatherContext.Provider value={createStore(unknownWeather)}>
        <Info />
      </WeatherContext.Provider>,
    );

    expect(screen.getAllByTestId("AirRoundedIcon")).toHaveLength(2);
    expect(screen.getByText("Volcanic ash")).toBeVisible();
  });

  it("uses the selected city display label and consistently formatted measurements", () => {
    const store = createStore(
      {
        ...unknownWeather,
        name: "Dnipro",
        main: { temp: 10, feels_like: 8, humidity: 50 },
        weather: [{ main: "Clouds", description: "хмарно" }],
        wind: { speed: 2 },
      },
      "Dnipro",
      "UA",
    );

    render(
      <WeatherContext.Provider value={store}>
        <Info />
      </WeatherContext.Provider>,
    );

    expect(
      screen.getByRole("region", {
        name: "Поточна погода в Дніпро",
      }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Дніпро" })).toBeVisible();
    expect(screen.getByText("хмарно")).toBeVisible();
    expect(screen.getByText("10.0")).toBeVisible();
    expect(screen.getByText("2.0 m/s")).toBeVisible();
    expect(screen.getByText("50%")).toBeVisible();
  });

  it("renders the clothing recommendation for the selected outfit profile", () => {
    const store = createStore(unknownWeather);

    runInAction(() => {
      store.outfitProfile = GenderSelection.Man;
    });

    render(
      <WeatherContext.Provider value={store}>
        <Info />
      </WeatherContext.Provider>,
    );

    expect(screen.getByText("For Man")).toBeVisible();
    expect(screen.getByText("Light layered outfit")).toBeVisible();
  });

  it("uses fallback text when no weather description is available", () => {
    render(
      <WeatherContext.Provider
        value={createStore({ ...unknownWeather, weather: [] })}
      >
        <Info />
      </WeatherContext.Provider>,
    );

    expect(screen.getByText("Current")).toBeVisible();
    expect(screen.getAllByTestId("AirRoundedIcon")).toHaveLength(2);
  });
});
