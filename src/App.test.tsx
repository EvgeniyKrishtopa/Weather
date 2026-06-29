import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import {
  LAST_WEATHER_STORAGE_KEY,
  OPENWEATHER_API_KEY_ENV,
  OUTFIT_RECOMMENDATION_API_URL_ENV,
  SELECTED_LOCATION_STORAGE_KEY,
} from "./constants";
import { weatherFixture } from "./test/weatherFixture";

const WEATHER_RESULT_TIMEOUT = { timeout: 2500 };

const stubTimeZone = (timeZone?: string) => {
  vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({
    calendar: "gregory",
    locale: "en-US",
    numberingSystem: "latn",
    timeZone,
  } as Intl.ResolvedDateTimeFormatOptions);
};

beforeEach(() => {
  vi.stubEnv(OPENWEATHER_API_KEY_ENV, "test-key");
  vi.stubEnv(OUTFIT_RECOMMENDATION_API_URL_ENV, "");
  stubTimeZone();
});

afterEach(() => {
  vi.useRealTimers();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("App", () => {
  it("shows city helper validation without a submit button", async () => {
    const user = userEvent.setup();
    render(<App />);

    const citySelect = await screen.findByRole("combobox", { name: "City" });
    await waitFor(() => expect(citySelect).toBeEnabled());
    expect(
      screen.queryByRole("button", { name: "Get weather and outfit today" }),
    ).not.toBeInTheDocument();

    await user.click(citySelect);
    await user.tab();

    expect(citySelect).toBeInvalid();
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
      await screen.findByRole("combobox", { name: "Країна" }),
    ).toHaveTextContent("Україна");

    const citySelect = screen.getByRole("combobox", { name: "Місто" });
    await waitFor(() => expect(citySelect).toBeEnabled());
    await user.type(citySelect, "Київ");
    await user.click(await screen.findByRole("option", { name: "Київ" }));

    expect(
      await screen.findByRole(
        "region",
        {
          name: "Поточна погода в Kyiv",
        },
        WEATHER_RESULT_TIMEOUT,
      ),
    ).toBeVisible();
    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get("q")).toBe("Kyiv,UA");
    expect(requestUrl.searchParams.get("lang")).toBe("uk");
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

    const citySelect = screen.getByRole("combobox", { name: "City" });
    await waitFor(() => expect(citySelect).toBeEnabled());
    await user.type(citySelect, "Chicago");
    await user.click(await screen.findByRole("option", { name: "Chicago" }));

    expect(
      await screen.findByRole(
        "region",
        {
          name: "Current weather in Chicago",
        },
        WEATHER_RESULT_TIMEOUT,
      ),
    ).toBeVisible();
    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get("q")).toBe("Chicago,US");
    expect(requestUrl.searchParams.get("lang")).toBe("en");
    expect(screen.getByText("3.8 m/s")).toBeVisible();
    expect(screen.getByText("62%")).toBeVisible();
    expect(screen.getByRole("combobox", { name: "Country" })).toHaveTextContent(
      "United States",
    );
    expect(screen.getByRole("combobox", { name: "City" })).toHaveValue(
      "Chicago",
    );
  });

  it("renders an LLM outfit recommendation after weather loads", async () => {
    vi.stubEnv(
      OUTFIT_RECOMMENDATION_API_URL_ENV,
      "https://weather-outfits.example/recommend-outfit",
    );
    const user = userEvent.setup();
    let resolveRecommendation:
      | ((value: {
          ok: boolean;
          json: () => Promise<{
            title: string;
            items: string[];
            description: string;
          }>;
        }) => void)
      | undefined;
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          ...weatherFixture,
          name: "Chicago",
          main: { temp: 4, feels_like: -1, humidity: 82 },
          weather: [{ main: "Rain" }],
          wind: { speed: 8 },
        }),
      })
      .mockReturnValueOnce(
        new Promise((resolve) => {
          resolveRecommendation = resolve;
        }),
      );
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);

    const citySelect = await screen.findByRole("combobox", { name: "City" });
    await waitFor(() => expect(citySelect).toBeEnabled());
    await user.type(citySelect, "Chicago");
    await user.click(await screen.findByRole("option", { name: "Chicago" }));

    expect(
      await screen.findByRole(
        "region",
        {
          name: "Current weather in Chicago",
        },
        WEATHER_RESULT_TIMEOUT,
      ),
    ).toBeVisible();
    expect(screen.getByText("Preparing outfit recommendation")).toBeVisible();
    resolveRecommendation?.({
      ok: true,
      json: async () => ({
        title: "Rain-ready warm layers",
        items: ["Water-resistant coat", "Warm base layer"],
        description: "Stay warm and dry with compact rain layers.",
      }),
    });
    expect(
      await screen.findByText("Rain-ready warm layers", undefined, {
        timeout: 2500,
      }),
    ).toBeVisible();
    expect(screen.getByText("Water-resistant coat")).toBeVisible();
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("keeps weather visible and falls back when outfit recommendation fails", async () => {
    vi.stubEnv(
      OUTFIT_RECOMMENDATION_API_URL_ENV,
      "https://weather-outfits.example/recommend-outfit",
    );
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({
        json: vi.fn().mockResolvedValue({
          ...weatherFixture,
          name: "Chicago",
        }),
      })
      .mockRejectedValueOnce(new Error("offline"));
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);

    const citySelect = await screen.findByRole("combobox", { name: "City" });
    await waitFor(() => expect(citySelect).toBeEnabled());
    await user.type(citySelect, "Chicago");
    await user.click(await screen.findByRole("option", { name: "Chicago" }));

    expect(
      await screen.findByRole(
        "region",
        {
          name: "Current weather in Chicago",
        },
        WEATHER_RESULT_TIMEOUT,
      ),
    ).toBeVisible();
    expect(
      await screen.findByText("Light clear-weather outfit", undefined, {
        timeout: 2500,
      }),
    ).toBeVisible();
    expect(screen.getByText("Light jacket")).toBeVisible();
  });

  it("clears visible weather without requesting when city text changes", async () => {
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
    await screen.findByRole(
      "region",
      {
        name: "Current weather in Chicago",
      },
      WEATHER_RESULT_TIMEOUT,
    );

    await user.type(citySelect, "x");

    expect(await screen.findByText("Choose a city.")).toBeVisible();
    expect(
      screen.queryByRole("region", {
        name: "Current weather in Chicago",
      }),
    ).not.toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("updates cities by selected country and sends the selected ISO", async () => {
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

    const citySelect = await screen.findByRole("combobox", { name: "Місто" });
    await waitFor(() => expect(citySelect).toBeEnabled());
    await user.type(citySelect, "Київ");
    await user.click(await screen.findByRole("option", { name: "Київ" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get("q")).toBe("Kyiv,UA");
    expect(requestUrl.searchParams.get("lang")).toBe("uk");
  });

  it("changes app language when Italy or Germany is selected", async () => {
    const user = userEvent.setup();
    render(<App />);

    const countrySelect = await screen.findByRole("combobox", {
      name: "Country",
    });

    await user.click(countrySelect);
    await user.click(screen.getByRole("option", { name: "Italy" }));

    expect(
      await screen.findByRole("combobox", { name: "Paese" }),
    ).toHaveTextContent("Italia");
    expect(
      await screen.findByRole("combobox", { name: "Città" }),
    ).toBeVisible();

    await user.click(screen.getByRole("combobox", { name: "Paese" }));
    await user.click(screen.getByRole("option", { name: "Germania" }));

    expect(
      await screen.findByRole("combobox", { name: "Land" }),
    ).toHaveTextContent("Deutschland");
    expect(
      await screen.findByRole("combobox", { name: "Stadt" }),
    ).toBeVisible();
  });

  it("shows localized city labels while requesting weather with canonical city names", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        ...weatherFixture,
        name: "Rome",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
    render(<App />);

    const countrySelect = await screen.findByRole("combobox", {
      name: "Country",
    });
    await user.click(countrySelect);
    await user.click(screen.getByRole("option", { name: "Italy" }));

    const citySelect = await screen.findByRole("combobox", { name: "Città" });
    await waitFor(() => expect(citySelect).toBeEnabled());
    await user.type(citySelect, "Roma");
    await user.click(await screen.findByRole("option", { name: "Roma" }));

    expect(
      await screen.findByRole(
        "region",
        {
          name: "Meteo attuale a Rome",
        },
        WEATHER_RESULT_TIMEOUT,
      ),
    ).toBeVisible();
    const requestUrl = new URL(fetchMock.mock.calls[0][0] as string);
    expect(requestUrl.searchParams.get("q")).toBe("Rome,IT");
    expect(requestUrl.searchParams.get("lang")).toBe("it");
  });

  it("does not offer cities outside the curated city list", async () => {
    const user = userEvent.setup();
    render(<App />);

    const citySelect = await screen.findByRole("combobox", { name: "City" });
    await waitFor(() => expect(citySelect).toBeEnabled());
    await user.type(citySelect, "Smallville");

    expect(await screen.findByText("No cities found")).toBeVisible();
    expect(screen.queryByRole("option", { name: "Smallville" })).toBeNull();
  });

  it("restores cached weather on initial render", () => {
    localStorage.setItem(
      SELECTED_LOCATION_STORAGE_KEY,
      JSON.stringify({ city: "Kyiv", countryIso: "UA" }),
    );
    localStorage.setItem(
      LAST_WEATHER_STORAGE_KEY,
      JSON.stringify({ city: "Kyiv", weather: weatherFixture }),
    );

    render(<App />);

    expect(
      screen.getByRole("region", { name: "Поточна погода в Kyiv" }),
    ).toBeVisible();
  });

  it("restores the selected city and country after reload", async () => {
    localStorage.setItem(
      SELECTED_LOCATION_STORAGE_KEY,
      JSON.stringify({ city: "Kyiv", countryIso: "UA" }),
    );

    render(<App />);

    expect(
      await screen.findByRole("combobox", { name: "Країна" }),
    ).toHaveTextContent("Україна");

    const citySelect = screen.getByRole("combobox", { name: "Місто" });
    await waitFor(() => expect(citySelect).toBeEnabled());
    expect(citySelect).toHaveValue("Київ");
  });

  it("requests missing weather after a selected city field is blurred", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        ...weatherFixture,
        name: "Kyiv",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
    localStorage.setItem(
      SELECTED_LOCATION_STORAGE_KEY,
      JSON.stringify({ city: "Kyiv", countryIso: "UA" }),
    );
    render(<App />);

    const citySelect = await screen.findByRole("combobox", { name: "Місто" });
    await waitFor(() => expect(citySelect).toBeEnabled());
    await user.click(citySelect);
    await user.tab();

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(
      await screen.findByRole(
        "region",
        {
          name: "Поточна погода в Kyiv",
        },
        WEATHER_RESULT_TIMEOUT,
      ),
    ).toBeVisible();
  });

  it("requests missing weather after changing outfit profile with a selected city", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue({
        ...weatherFixture,
        name: "Chicago",
      }),
    });
    vi.stubGlobal("fetch", fetchMock);
    localStorage.setItem(
      SELECTED_LOCATION_STORAGE_KEY,
      JSON.stringify({ city: "Chicago", countryIso: "US" }),
    );
    render(<App />);

    await user.click(await screen.findByRole("checkbox", { name: "Man" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(
      await screen.findByRole(
        "region",
        {
          name: "Current weather in Chicago",
        },
        WEATHER_RESULT_TIMEOUT,
      ),
    ).toBeVisible();
  });

  it("clears weather and the city when it is invalid for a new country", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    localStorage.setItem(
      SELECTED_LOCATION_STORAGE_KEY,
      JSON.stringify({ city: "Chicago", countryIso: "US" }),
    );
    localStorage.setItem(
      LAST_WEATHER_STORAGE_KEY,
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
      expect(screen.getByRole("combobox", { name: "Місто" })).toHaveValue(""),
    );
    expect(
      screen.queryByRole("region", { name: "Current weather in Chicago" }),
    ).not.toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("clears visible weather without requesting when the city is cleared", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    localStorage.setItem(
      SELECTED_LOCATION_STORAGE_KEY,
      JSON.stringify({ city: "Chicago", countryIso: "US" }),
    );
    localStorage.setItem(
      LAST_WEATHER_STORAGE_KEY,
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
