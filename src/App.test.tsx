import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { fetchCountryIsoByCoordinates } from "./api/geocodingApi";
import { fetchCities, fetchCountries } from "./api/locationApi";
import { weatherFixture } from "./test/weatherFixture";
import { getCurrentCoordinates } from "./utils/geolocation";

vi.mock("./api/locationApi", () => ({
  fetchCountries: vi.fn(),
  fetchCities: vi.fn(),
}));

vi.mock("./api/geocodingApi", () => ({
  fetchCountryIsoByCoordinates: vi.fn(),
}));

vi.mock("./utils/geolocation", () => ({
  getCurrentCoordinates: vi.fn(),
}));

const stubTimeZone = (timeZone?: string) => {
  vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({
    calendar: "gregory",
    locale: "en-US",
    numberingSystem: "latn",
    timeZone,
  } as Intl.ResolvedDateTimeFormatOptions);
};

beforeEach(() => {
  vi.stubEnv("VITE_OPENWEATHER_API_KEY", "test-key");
  stubTimeZone();
  vi.mocked(getCurrentCoordinates).mockResolvedValue(null);
  vi.mocked(fetchCountryIsoByCoordinates).mockResolvedValue(null);
  vi.mocked(fetchCountries).mockResolvedValue([
    { name: "Canada", iso2: "CA" },
    { name: "Ukraine", iso2: "UA" },
    { name: "United States", iso2: "US" },
  ]);
  vi.mocked(fetchCities).mockImplementation(async (countryName) => {
    if (countryName === "Canada") {
      return ["Toronto"];
    }

    return countryName === "Ukraine"
      ? ["Kyiv", "Lviv"]
      : ["Chicago", "New York"];
  });
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

  it("defaults to the timezone country and requests weather with its ISO", async () => {
    stubTimeZone("Europe/Kyiv");
    vi.spyOn(window.navigator, "language", "get").mockReturnValue("ru-RU");
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["ru-RU"]);
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        ...weatherFixture,
        name: "Kyiv",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);

    expect(
      await screen.findByRole("combobox", { name: "Country" }),
    ).toHaveTextContent("Ukraine");
    expect(fetchCities).toHaveBeenCalledWith(
      "Ukraine",
      expect.any(AbortSignal),
    );

    const citySelect = screen.getByRole("combobox", { name: "City" });
    await waitFor(() => expect(citySelect).toBeEnabled());
    await user.type(citySelect, "Kyiv");
    await user.click(await screen.findByRole("option", { name: "Kyiv" }));

    expect(
      await screen.findByRole("region", {
        name: "Current weather in Kyiv",
      }),
    ).toBeVisible();
    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get("q")).toBe("Kyiv,UA");
  });

  it("falls back to United States and requests weather with its ISO", async () => {
    stubTimeZone("Unknown/Nowhere");
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
      await screen.findByRole("combobox", { name: "Country" }),
    ).toHaveTextContent("United States");
    expect(fetchCities).toHaveBeenCalledWith(
      "United States",
      expect.any(AbortSignal),
    );

    const citySelect = screen.getByRole("combobox", { name: "City" });
    await waitFor(() => expect(citySelect).toBeEnabled());
    await user.type(citySelect, "Chicago");
    await user.click(await screen.findByRole("option", { name: "Chicago" }));

    expect(
      await screen.findByRole("region", {
        name: "Current weather in Chicago",
      }),
    ).toBeVisible();
    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get("q")).toBe("Chicago,US");
    expect(screen.getByText("3.8 m/s")).toBeVisible();
    expect(screen.getByText("62%")).toBeVisible();
    expect(screen.getByRole("combobox", { name: "Country" })).toHaveTextContent(
      "United States",
    );
    expect(screen.getByRole("combobox", { name: "City" })).toHaveValue(
      "Chicago",
    );
  });

  it("updates the default country when geolocation reverse lookup succeeds", async () => {
    stubTimeZone("America/New_York");
    vi.mocked(getCurrentCoordinates).mockResolvedValue({
      latitude: 43.65,
      longitude: -79.38,
    });
    vi.mocked(fetchCountryIsoByCoordinates).mockResolvedValue("CA");

    render(<App />);

    expect(
      await screen.findByRole("combobox", { name: "Country" }),
    ).toHaveTextContent("Canada");
    expect(fetchCountryIsoByCoordinates).toHaveBeenCalledWith(
      43.65,
      -79.38,
      expect.any(AbortSignal),
    );
    expect(fetchCities).toHaveBeenCalledWith("Canada", expect.any(AbortSignal));
  });

  it("falls back to United States when geolocation returns an unavailable country", async () => {
    stubTimeZone("America/New_York");
    vi.mocked(fetchCountries).mockResolvedValue([
      { name: "Ukraine", iso2: "UA" },
      { name: "United States", iso2: "US" },
    ]);
    vi.mocked(getCurrentCoordinates).mockResolvedValue({
      latitude: 43.65,
      longitude: -79.38,
    });
    vi.mocked(fetchCountryIsoByCoordinates).mockResolvedValue("CA");

    render(<App />);

    await waitFor(() =>
      expect(fetchCountryIsoByCoordinates).toHaveBeenCalled(),
    );
    expect(screen.getByRole("combobox", { name: "Country" })).toHaveTextContent(
      "United States",
    );
  });

  it("forces a new request when Get weather is clicked", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        ...weatherFixture,
        name: "Chicago",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);

    const citySelect = await screen.findByRole("combobox", { name: "City" });
    await waitFor(() => expect(citySelect).toBeEnabled());
    await user.type(citySelect, "Chicago");
    await user.click(await screen.findByRole("option", { name: "Chicago" }));
    await screen.findByRole("region", {
      name: "Current weather in Chicago",
    });

    await user.click(screen.getByRole("button", { name: "Get weather" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(2));
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
      expect.any(AbortSignal),
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
      new Error("Unable to load countries."),
    );

    render(<App />);

    expect(await screen.findByText("Unable to load countries.")).toBeVisible();
    expect(screen.getByRole("button", { name: "Get weather" })).toBeDisabled();
  });

  it("displays city loading errors", async () => {
    vi.mocked(fetchCities).mockRejectedValue(
      new Error("Unable to load cities."),
    );

    render(<App />);

    expect(await screen.findByText("Unable to load cities.")).toBeVisible();
    expect(screen.getByRole("button", { name: "Get weather" })).toBeDisabled();
  });

  it("restores cached weather on initial render", () => {
    localStorage.setItem(
      "weather-app:last-weather",
      JSON.stringify({ city: "Kyiv", weather: weatherFixture }),
    );

    render(<App />);

    expect(
      screen.getByRole("region", { name: "Current weather in Kyiv" }),
    ).toBeVisible();
  });

  it("restores the selected city and country after reload", async () => {
    localStorage.setItem(
      "weather-app:selected-location",
      JSON.stringify({ city: "Kyiv", countryIso: "UA" }),
    );

    render(<App />);

    expect(
      await screen.findByRole("combobox", { name: "Country" }),
    ).toHaveTextContent("Ukraine");
    expect(fetchCities).toHaveBeenCalledWith(
      "Ukraine",
      expect.any(AbortSignal),
    );

    const citySelect = screen.getByRole("combobox", { name: "City" });
    await waitFor(() => expect(citySelect).toBeEnabled());
    expect(citySelect).toHaveValue("Kyiv");
  });

  it("clears weather and the city when it is invalid for a new country", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    localStorage.setItem(
      "weather-app:selected-location",
      JSON.stringify({ city: "Chicago", countryIso: "US" }),
    );
    localStorage.setItem(
      "weather-app:last-weather",
      JSON.stringify({
        city: "Chicago",
        weather: { ...weatherFixture, name: "Chicago" },
      }),
    );
    render(<App />);

    expect(
      screen.getByRole("region", { name: "Current weather in Chicago" }),
    ).toBeVisible();

    const countrySelect = await screen.findByRole("combobox", {
      name: "Country",
    });
    await user.click(countrySelect);
    await user.click(screen.getByRole("option", { name: "Ukraine" }));

    await waitFor(() =>
      expect(screen.getByRole("combobox", { name: "City" })).toHaveValue(""),
    );
    expect(
      screen.queryByRole("region", { name: "Current weather in Chicago" }),
    ).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("requests weather when the current city is valid for a new country", async () => {
    const user = userEvent.setup();
    vi.mocked(fetchCities).mockResolvedValue(["Springfield"]);
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        ...weatherFixture,
        name: "Springfield",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
    localStorage.setItem(
      "weather-app:selected-location",
      JSON.stringify({ city: "Springfield", countryIso: "US" }),
    );
    localStorage.setItem(
      "weather-app:last-weather",
      JSON.stringify({
        city: "Springfield",
        weather: { ...weatherFixture, name: "Springfield" },
      }),
    );
    render(<App />);

    const countrySelect = await screen.findByRole("combobox", {
      name: "Country",
    });
    await user.click(countrySelect);
    await user.click(screen.getByRole("option", { name: "Ukraine" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get("q")).toBe("Springfield,UA");
    expect(
      await screen.findByRole("region", {
        name: "Current weather in Springfield",
      }),
    ).toBeVisible();
  });

  it("clears visible weather without requesting when the city is cleared", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    localStorage.setItem(
      "weather-app:selected-location",
      JSON.stringify({ city: "Chicago", countryIso: "US" }),
    );
    localStorage.setItem(
      "weather-app:last-weather",
      JSON.stringify({
        city: "Chicago",
        weather: { ...weatherFixture, name: "Chicago" },
      }),
    );
    render(<App />);

    const clearButton = await screen.findByLabelText("Clear");
    await user.click(clearButton);

    expect(screen.getByRole("combobox", { name: "City" })).toHaveValue("");
    expect(
      screen.queryByRole("region", { name: "Current weather in Chicago" }),
    ).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});
