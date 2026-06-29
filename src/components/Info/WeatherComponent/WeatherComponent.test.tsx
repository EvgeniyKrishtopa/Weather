import React from "react";
import AirRoundedIcon from "@mui/icons-material/AirRounded";
import { act, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { OUTFIT_RECOMMENDATION_API_URL_ENV } from "../../../constants";
import { getTranslation } from "../../../i18n";
import { weatherFixture } from "../../../test/weatherFixture";
import { GenderSelection } from "../../../types/location";
import { WeatherComponent } from ".";

beforeEach(() => {
  vi.stubEnv(OUTFIT_RECOMMENDATION_API_URL_ENV, "");
});

const localizationProps = {
  countryIso: "UA",
  language: "en" as const,
  selectedCity: "Kyiv",
  translation: getTranslation("en"),
};

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("WeatherComponent", () => {
  it("renders formatted weather details", () => {
    render(
      <WeatherComponent
        {...localizationProps}
        language="uk"
        currentWeather={{
          ...weatherFixture,
          name: "Dnipro",
          main: { temp: 12.34, feels_like: 10.2, humidity: 81 },
          weather: [{ main: "Clouds", description: "хмарно" }],
          wind: { speed: 5.67 },
        }}
        outfitProfile={GenderSelection.Woman}
        selectedCity="Dnipro"
        translation={getTranslation("uk")}
        WeatherIcon={AirRoundedIcon}
      />,
    );

    expect(
      screen.getByRole("region", { name: "Поточна погода в Дніпро" }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Дніпро" })).toBeVisible();
    expect(screen.getByText("12.3")).toBeVisible();
    expect(screen.getByText("хмарно")).toBeVisible();
    expect(screen.getByText("5.7 m/s")).toBeVisible();
    expect(screen.getByText("81%")).toBeVisible();
    expect(
      screen.getByRole("region", { name: "Рекомендація одягу" }),
    ).toBeVisible();
  });

  it("falls back to the API city when no selected city is available", () => {
    render(
      <WeatherComponent
        {...localizationProps}
        currentWeather={{
          ...weatherFixture,
          name: "Kyiv",
        }}
        outfitProfile={GenderSelection.Woman}
        selectedCity={null}
        WeatherIcon={AirRoundedIcon}
      />,
    );

    expect(
      screen.getByRole("region", { name: "Current weather in Kyiv" }),
    ).toBeVisible();
    expect(screen.getByRole("heading", { name: "Kyiv" })).toBeVisible();
  });

  it("renders an outfit recommendation from the provider", async () => {
    vi.useFakeTimers();
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
        {...localizationProps}
        currentWeather={{
          ...weatherFixture,
          name: "Kyiv",
          main: { temp: 4, feels_like: -1, humidity: 82 },
          weather: [{ main: "Rain" }],
          wind: { speed: 8 },
        }}
        outfitProfile={GenderSelection.Woman}
        WeatherIcon={AirRoundedIcon}
      />,
    );

    expect(screen.getByText("Preparing outfit recommendation")).toBeVisible();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(screen.getByText("Rain-ready warm layers")).toBeVisible();
    expect(screen.getByText("Water-resistant coat")).toBeVisible();
  });

  it("keeps fallback recommendations visible when the provider fails", async () => {
    vi.useFakeTimers();
    vi.stubEnv(
      OUTFIT_RECOMMENDATION_API_URL_ENV,
      "https://weather-outfits.example/recommend-outfit",
    );
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));

    render(
      <WeatherComponent
        {...localizationProps}
        currentWeather={weatherFixture}
        outfitProfile={GenderSelection.Woman}
        WeatherIcon={AirRoundedIcon}
      />,
    );

    expect(screen.getByText("Preparing outfit recommendation")).toBeVisible();
    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(screen.getByText("Light clear-weather outfit")).toBeVisible();
    expect(
      screen.getByRole("region", { name: "Current weather in Kyiv" }),
    ).toBeVisible();
  });

  it("shows a brief loader while refreshing after an outfit profile change", async () => {
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
        {...localizationProps}
        currentWeather={weatherFixture}
        outfitProfile={GenderSelection.Woman}
        WeatherIcon={AirRoundedIcon}
      />,
    );

    expect(screen.getByText("Preparing outfit recommendation")).toBeVisible();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(screen.getByText("Woman rain layers")).toBeVisible();

    rerender(
      <WeatherComponent
        {...localizationProps}
        currentWeather={weatherFixture}
        outfitProfile={GenderSelection.Man}
        WeatherIcon={AirRoundedIcon}
      />,
    );

    expect(screen.getByText("Preparing outfit recommendation")).toBeVisible();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(999);
    });

    expect(screen.getByText("Preparing outfit recommendation")).toBeVisible();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1);
    });

    expect(screen.getByText("Man rain layers")).toBeVisible();
  });

  it("ignores stale recommendation responses without aborting requests", async () => {
    vi.useFakeTimers();
    vi.stubEnv(
      OUTFIT_RECOMMENDATION_API_URL_ENV,
      "https://weather-outfits.example/recommend-outfit",
    );
    let resolveWoman:
      | ((value: {
          ok: true;
          json: () => Promise<{
            title: string;
            items: string[];
            description: string;
          }>;
        }) => void)
      | undefined;
    const fetchMock = vi
      .fn()
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveWoman = resolve;
        }),
      )
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({
          title: "Man rain layers",
          items: ["Water-resistant jacket", "Warm crewneck layer"],
          description: "Stay warm and dry with compact rain layers.",
        }),
      });
    vi.stubGlobal("fetch", fetchMock);

    const { rerender } = render(
      <WeatherComponent
        {...localizationProps}
        currentWeather={weatherFixture}
        outfitProfile={GenderSelection.Woman}
        WeatherIcon={AirRoundedIcon}
      />,
    );

    rerender(
      <WeatherComponent
        {...localizationProps}
        currentWeather={weatherFixture}
        outfitProfile={GenderSelection.Man}
        WeatherIcon={AirRoundedIcon}
      />,
    );

    await act(async () => {
      await vi.advanceTimersByTimeAsync(1000);
    });

    expect(screen.getByText("Man rain layers")).toBeVisible();

    resolveWoman?.({
      ok: true,
      json: async () => ({
        title: "Woman rain layers",
        items: ["Water-resistant trench coat", "Warm knit layer"],
        description: "Stay warm and dry with compact rain layers.",
      }),
    });

    await act(async () => {
      await Promise.resolve();
    });

    expect(screen.getByText("Man rain layers")).toBeVisible();
    expect(screen.queryByText("Woman rain layers")).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(fetchMock.mock.calls[0][1]).toHaveProperty("signal", undefined);
    expect(fetchMock.mock.calls[1][1]).toHaveProperty("signal", undefined);
  });

  it("uses fallback weather description text", () => {
    render(
      <WeatherComponent
        {...localizationProps}
        currentWeather={{
          ...weatherFixture,
          weather: [],
        }}
        outfitProfile={GenderSelection.Woman}
        WeatherIcon={AirRoundedIcon}
      />,
    );

    expect(screen.getByText("Current")).toBeVisible();
  });
});
