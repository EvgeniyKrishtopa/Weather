import React from "react";
import AirRoundedIcon from "@mui/icons-material/AirRounded";
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OUTFIT_RECOMMENDATION_API_URL_ENV } from "../../../constants";
import { weatherFixture } from "../../../test/weatherFixture";
import { GenderSelection } from "../../../types/location";
import { WeatherComponent } from ".";

beforeEach(() => {
  vi.stubEnv(OUTFIT_RECOMMENDATION_API_URL_ENV, "");
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("WeatherComponent", () => {
  it("renders formatted weather details", () => {
    render(
      <WeatherComponent
        currentWeather={{
          ...weatherFixture,
          name: "Kyiv",
          main: { temp: 12.34, feels_like: 10.2, humidity: 81 },
          weather: [{ main: "Clouds" }],
          wind: { speed: 5.67 },
        }}
        gender={GenderSelection.Woman}
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
    expect(
      screen.getByRole("region", { name: "Clothing recommendation" }),
    ).toBeVisible();
  });

  it("renders an outfit recommendation from the provider", async () => {
    vi.stubEnv(
      OUTFIT_RECOMMENDATION_API_URL_ENV,
      "https://weather-outfits.example/recommend-outfit",
    );
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          title: "Rain-ready warm layers",
          items: ["Water-resistant coat", "Warm base layer"],
          description: "Stay warm and dry with compact rain layers.",
        }),
      }),
    );

    render(
      <WeatherComponent
        currentWeather={{
          ...weatherFixture,
          name: "Kyiv",
          main: { temp: 4, feels_like: -1, humidity: 82 },
          weather: [{ main: "Rain" }],
          wind: { speed: 8 },
        }}
        gender={GenderSelection.Woman}
        WeatherIcon={AirRoundedIcon}
      />,
    );

    expect(screen.getByText("Preparing outfit recommendation")).toBeVisible();
    expect(await screen.findByText("Rain-ready warm layers")).toBeVisible();
    expect(screen.getByText("Water-resistant coat")).toBeVisible();
  });

  it("keeps fallback recommendations visible when the provider fails", async () => {
    vi.stubEnv(
      OUTFIT_RECOMMENDATION_API_URL_ENV,
      "https://weather-outfits.example/recommend-outfit",
    );
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    render(
      <WeatherComponent
        currentWeather={weatherFixture}
        gender={GenderSelection.Woman}
        WeatherIcon={AirRoundedIcon}
      />,
    );

    expect(screen.getByText("Preparing outfit recommendation")).toBeVisible();
    expect(await screen.findByText("Light clear-weather outfit")).toBeVisible();
    expect(
      screen.getByRole("region", { name: "Current weather in Kyiv" }),
    ).toBeVisible();
  });

  it("shows a brief loader while refreshing after a gender change", async () => {
    vi.useFakeTimers();
    vi.stubEnv(
      OUTFIT_RECOMMENDATION_API_URL_ENV,
      "https://weather-outfits.example/recommend-outfit",
    );
    vi.stubGlobal(
      "fetch",
      vi
        .fn()
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({
            title: "Woman rain layers",
            items: ["Water-resistant trench coat", "Warm knit layer"],
            description: "Stay warm and dry with compact rain layers.",
          }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: vi.fn().mockResolvedValue({
            title: "Man rain layers",
            items: ["Water-resistant jacket", "Warm crewneck layer"],
            description: "Stay warm and dry with compact rain layers.",
          }),
        }),
    );

    const { rerender } = render(
      <WeatherComponent
        currentWeather={weatherFixture}
        gender={GenderSelection.Woman}
        WeatherIcon={AirRoundedIcon}
      />,
    );

    expect(screen.getByText("Preparing outfit recommendation")).toBeVisible();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(300);
    });

    expect(screen.getByText("Woman rain layers")).toBeVisible();

    rerender(
      <WeatherComponent
        currentWeather={weatherFixture}
        gender={GenderSelection.Man}
        WeatherIcon={AirRoundedIcon}
      />,
    );

    expect(screen.getByText("Preparing outfit recommendation")).toBeVisible();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(299);
    });

    expect(screen.getByText("Preparing outfit recommendation")).toBeVisible();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(screen.getByText("Man rain layers")).toBeVisible();
  });

  it("uses fallback weather description text", () => {
    render(
      <WeatherComponent
        currentWeather={{
          ...weatherFixture,
          weather: [],
        }}
        gender={GenderSelection.Woman}
        WeatherIcon={AirRoundedIcon}
      />,
    );

    expect(screen.getByText("Current")).toBeVisible();
  });
});
