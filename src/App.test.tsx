import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { weatherFixture } from "./test/weatherFixture";

beforeEach(() => {
  vi.stubEnv("VITE_OPENWEATHER_API_KEY", "test-key");
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("App", () => {
  it("shows validation when required fields are empty", async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole("button", { name: "Get weather" }));

    expect(
      screen.getByText("Enter both a city and a country.")
    ).toBeVisible();
  });

  it("requests and displays current weather", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue(weatherFixture),
      })
    );
    render(<App />);

    await user.type(screen.getByLabelText("Country"), " UA ");
    await user.type(screen.getByLabelText("City"), " Kyiv ");
    await user.click(screen.getByRole("button", { name: "Get weather" }));

    expect(
      await screen.findByRole("region", {
        name: "Current weather in Kyiv",
      })
    ).toBeVisible();
    expect(screen.getByText("21.4°C")).toBeVisible();
    expect(screen.getByText("3.8 m/s")).toBeVisible();
    expect(screen.getByText("62%")).toBeVisible();
    expect(screen.getByLabelText("Country")).toHaveValue("");
    expect(screen.getByLabelText("City")).toHaveValue("");
  });

  it("displays API errors", async () => {
    const user = userEvent.setup();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        json: vi.fn().mockResolvedValue({
          cod: "404",
          message: "city not found",
        }),
      })
    );
    render(<App />);

    await user.type(screen.getByLabelText("Country"), "UA");
    await user.type(screen.getByLabelText("City"), "Unknown");
    await user.click(screen.getByRole("button", { name: "Get weather" }));

    expect(await screen.findByText("city not found")).toBeVisible();
    expect(screen.getByText("Weather unavailable")).toBeVisible();
  });

  it("restores cached weather on initial render", () => {
    localStorage.setItem(
      "weather-app:last-weather",
      JSON.stringify({ city: "Kyiv", weather: weatherFixture })
    );

    render(<App />);

    expect(
      screen.getByRole("region", { name: "Current weather in Kyiv" })
    ).toBeVisible();
  });
});
