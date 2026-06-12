import { renderHook } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { useWeatherContext } from "./weatherContext";

describe("useWeatherContext", () => {
  it("throws when used outside WeatherState", () => {
    expect(() => renderHook(() => useWeatherContext())).toThrow(
      "useWeatherContext must be used within WeatherState",
    );
  });
});
