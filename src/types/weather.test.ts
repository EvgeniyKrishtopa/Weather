import { describe, expect, it } from "vitest";
import { isWeatherResponse, isWeatherSuccess } from "./weather";
import { weatherFixture } from "../test/weatherFixture";

describe("weather type guards", () => {
  it("recognizes a successful weather response", () => {
    expect(isWeatherResponse(weatherFixture)).toBe(true);
    expect(isWeatherSuccess(weatherFixture)).toBe(true);
  });

  it("recognizes an API error response", () => {
    const error = { cod: "404", message: "city not found" };

    expect(isWeatherResponse(error)).toBe(true);
    expect(isWeatherSuccess(error)).toBe(false);
  });

  it.each([
    null,
    {},
    { cod: 200 },
    { ...weatherFixture, name: 123 },
    { ...weatherFixture, main: { temp: "21", humidity: 62 } },
    { ...weatherFixture, weather: [] },
    { ...weatherFixture, wind: { speed: "fast" } },
    { cod: 500 },
  ])("rejects malformed responses: %j", (value) => {
    expect(isWeatherResponse(value)).toBe(false);
  });
});
