import { describe, expect, it, vi } from "vitest";
import { fetchWeather } from "../../api/weatherApi";
import { weatherFixture } from "../../test/weatherFixture";
import { weatherRequestService } from ".";

vi.mock("../../api/weatherApi", () => ({
  fetchWeather: vi.fn(),
}));

describe("weatherRequestService", () => {
  it("delegates weather requests to the API boundary", async () => {
    const controller = new AbortController();
    vi.mocked(fetchWeather).mockResolvedValue(weatherFixture);

    await expect(
      weatherRequestService.fetchWeather("Kyiv", "UA", controller.signal),
    ).resolves.toEqual(weatherFixture);

    expect(fetchWeather).toHaveBeenCalledWith("Kyiv", "UA", controller.signal);
  });
});
