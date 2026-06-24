import React from "react";
import { render, screen } from "@testing-library/react";
import { runInAction } from "mobx";
import { describe, expect, it } from "vitest";
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
    humidity: 50,
  },
  weather: [{ main: "Volcanic ash" }],
  wind: {
    speed: 2,
  },
};

const createStore = (weather: WeatherSuccess): WeatherStore => {
  const store = new WeatherStore();

  runInAction(() => {
    store.weather = weather;
    store.city = "Kyiv";
  });

  return store;
};

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

  it("uses the API city and consistently formatted measurements", () => {
    const store = createStore({
      ...unknownWeather,
      name: "Kyiv City",
      main: { temp: 10, humidity: 50 },
      wind: { speed: 2 },
    });

    render(
      <WeatherContext.Provider value={store}>
        <Info />
      </WeatherContext.Provider>,
    );

    expect(
      screen.getByRole("region", {
        name: "Current weather in Kyiv City",
      }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Kyiv City" })).toBeVisible();
    expect(screen.getByText("10.0")).toBeVisible();
    expect(screen.getByText("2.0 m/s")).toBeVisible();
    expect(screen.getByText("50%")).toBeVisible();
  });

  it("renders the clothing recommendation for the selected gender", () => {
    const store = createStore(unknownWeather);

    runInAction(() => {
      store.gender = GenderSelection.Man;
    });

    render(
      <WeatherContext.Provider value={store}>
        <Info />
      </WeatherContext.Provider>,
    );

    expect(screen.getByText("For Man")).toBeVisible();
    expect(screen.getByText("Smart casual layers")).toBeVisible();
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
