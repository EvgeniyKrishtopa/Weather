import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { fetchCities, fetchCountries } from "./api/locationApi";
import { weatherFixture } from "./test/weatherFixture";

vi.mock("./api/locationApi", () => ({
  fetchCountries: vi.fn(),
  fetchCities: vi.fn(),
}));

beforeEach(() => {
  vi.stubEnv("VITE_OPENWEATHER_API_KEY", "test-key");
  vi.mocked(fetchCountries).mockResolvedValue([
    { name: "Ukraine", iso2: "UA" },
    { name: "United States", iso2: "US" },
  ]);
  vi.mocked(fetchCities).mockImplementation(async (countryName) =>
    countryName === "Ukraine" ? ["Kyiv", "Lviv"] : ["Chicago", "New York"]
  );
});

afterEach(() => {
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("App", () => {
  it("shows validation when a city is not selected", async () => {
    const user = userEvent.setup();
    render(<App />);

    const citySelect = await screen.findByRole("combobox", { name: "City" });
    await waitFor(() => expect(citySelect).toBeEnabled());
    await user.click(screen.getByRole("button", { name: "Get weather" }));

    expect(screen.getByText("Choose a city.")).toBeVisible();
  });

  it("defaults to United States and requests weather with its ISO", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        ...weatherFixture,
        name: "Chicago",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);

    expect(
      await screen.findByRole("combobox", { name: "Country" })
    ).toHaveTextContent("United States");
    expect(fetchCities).toHaveBeenCalledWith(
      "United States",
      expect.any(AbortSignal)
    );

    const citySelect = screen.getByRole("combobox", { name: "City" });
    await waitFor(() => expect(citySelect).toBeEnabled());
    await user.type(citySelect, "Chicago");
    await user.click(await screen.findByRole("option", { name: "Chicago" }));
    await user.click(screen.getByRole("button", { name: "Get weather" }));

    expect(
      await screen.findByRole("region", {
        name: "Current weather in Chicago",
      })
    ).toBeVisible();
    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get("q")).toBe("Chicago,US");
    expect(screen.getByText("3.8 m/s")).toBeVisible();
    expect(screen.getByText("62%")).toBeVisible();
    expect(screen.getByRole("combobox", { name: "Country" })).toHaveTextContent(
      "United States"
    );
    expect(screen.getByRole("combobox", { name: "City" })).toHaveValue(
      "Chicago"
    );
  });

  it("reloads cities by country name and sends the selected ISO", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(weatherFixture),
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);

    const countrySelect = await screen.findByRole("combobox", {
      name: "Country",
    });
    await user.click(countrySelect);
    await user.click(screen.getByRole("option", { name: "Ukraine" }));

    expect(fetchCities).toHaveBeenLastCalledWith(
      "Ukraine",
      expect.any(AbortSignal)
    );

    const citySelect = await screen.findByRole("combobox", { name: "City" });
    await waitFor(() => expect(citySelect).toBeEnabled());
    await user.type(citySelect, "Kyiv");
    await user.click(await screen.findByRole("option", { name: "Kyiv" }));
    await user.click(screen.getByRole("button", { name: "Get weather" }));

    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get("q")).toBe("Kyiv,UA");
  });

  it("displays location loading errors", async () => {
    vi.mocked(fetchCountries).mockRejectedValue(
      new Error("Unable to load countries.")
    );

    render(<App />);

    expect(await screen.findByText("Unable to load countries.")).toBeVisible();
    expect(screen.getByRole("button", { name: "Get weather" })).toBeDisabled();
  });

  it("displays city loading errors", async () => {
    vi.mocked(fetchCities).mockRejectedValue(
      new Error("Unable to load cities.")
    );

    render(<App />);

    expect(await screen.findByText("Unable to load cities.")).toBeVisible();
    expect(screen.getByRole("button", { name: "Get weather" })).toBeDisabled();
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
