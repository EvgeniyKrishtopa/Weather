import React from "react";
import AirRoundedIcon from "@mui/icons-material/AirRounded";
import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { weatherFixture } from "../../../test/weatherFixture";
import { WeatherComponent } from ".";

describe("WeatherComponent", () => {
  it("renders formatted weather details", () => {
    render(
      <WeatherComponent
        currentWeather={{
          ...weatherFixture,
          name: "Kyiv",
          main: { temp: 12.34, humidity: 81 },
          weather: [{ main: "Clouds" }],
          wind: { speed: 5.67 },
        }}
        WeatherIcon={AirRoundedIcon}
      />,
    );

    expect(
      screen.getByRole("region", { name: "Current weather in Kyiv" }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Kyiv" })).toBeVisible();
    expect(screen.getByText("12.3")).toBeVisible();
    expect(screen.getByText("Clouds")).toBeVisible();
    expect(screen.getByText("5.7 m/s")).toBeVisible();
    expect(screen.getByText("81%")).toBeVisible();
  });

  it("uses fallback weather description text", () => {
    render(
      <WeatherComponent
        currentWeather={{
          ...weatherFixture,
          weather: [],
        }}
        WeatherIcon={AirRoundedIcon}
      />,
    );

    expect(screen.getByText("Current")).toBeVisible();
  });
});
