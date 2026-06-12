import React from "react";
import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { WeatherContext } from "../../context/weatherContext";
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

describe("weather information", () => {
  it("uses a fallback icon for unknown weather conditions", () => {
    render(
      <WeatherContext.Provider
        value={{
          getWeather: vi.fn(),
          weather: unknownWeather,
          city: "Kyiv",
          loading: false,
        }}
      >
        <Info />
      </WeatherContext.Provider>,
    );

    expect(screen.getAllByTestId("AirRoundedIcon")).toHaveLength(2);
    expect(screen.getByText("Volcanic ash")).toBeVisible();
  });

  it("uses fallback text when no weather description is available", () => {
    render(
      <WeatherContext.Provider
        value={{
          getWeather: vi.fn(),
          weather: { ...unknownWeather, weather: [] },
          city: "Kyiv",
          loading: false,
        }}
      >
        <Info />
      </WeatherContext.Provider>,
    );

    expect(screen.getByText("Current")).toBeVisible();
    expect(screen.getAllByTestId("AirRoundedIcon")).toHaveLength(2);
  });
});
