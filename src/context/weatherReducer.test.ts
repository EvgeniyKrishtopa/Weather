import { describe, expect, it } from "vitest";
import weatherReducer, {
  type WeatherAction,
  type WeatherStateValue,
} from "./weatherReducer";
import { weatherFixture } from "../test/weatherFixture";

const initialState: WeatherStateValue = {
  weather: null,
  city: "",
  loading: false,
};

describe("weatherReducer", () => {
  it("marks a request as loading", () => {
    expect(weatherReducer(initialState, { type: "requestStarted" })).toEqual({
      ...initialState,
      loading: true,
    });
  });

  it("stores a completed response and city", () => {
    expect(
      weatherReducer(
        { ...initialState, loading: true },
        {
          type: "requestCompleted",
          payload: weatherFixture,
          city: "Kyiv",
        },
      ),
    ).toEqual({
      weather: weatherFixture,
      city: "Kyiv",
      loading: false,
    });
  });

  it("keeps the current state for an unknown action", () => {
    const unknownAction = { type: "unknown" } as unknown as WeatherAction;

    expect(weatherReducer(initialState, unknownAction)).toBe(initialState);
  });
});
