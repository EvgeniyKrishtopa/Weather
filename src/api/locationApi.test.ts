import { afterEach, describe, expect, it, vi } from "vitest";
import { fetchCities, fetchCountries } from "./locationApi";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("location API", () => {
  it("maps and sorts country names with ISO2 values", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          error: false,
          msg: "countries",
          data: [
            { name: "Ukraine", Iso2: "UA", Iso3: "UKR" },
            { name: "United States", Iso2: "US", Iso3: "USA" },
          ],
        }),
      })
    );

    await expect(fetchCountries()).resolves.toEqual([
      { name: "Ukraine", iso2: "UA" },
      { name: "United States", iso2: "US" },
    ]);
  });

  it("requests cities by full country name and removes duplicates", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({
        error: false,
        msg: "cities",
        data: ["New York", "Chicago", "Chicago"],
      }),
    });
    vi.stubGlobal("fetch", fetchMock);

    await expect(fetchCities("United States")).resolves.toEqual([
      "Chicago",
      "New York",
    ]);
    expect(fetchMock).toHaveBeenCalledWith(
      "https://countriesnow.space/api/v0.1/countries/cities",
      expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ country: "United States" }),
      })
    );
  });

  it("rejects malformed country data", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue({
          error: false,
          msg: "countries",
          data: [{ name: "United States", Iso2: "USA" }],
        }),
      })
    );

    await expect(fetchCountries()).rejects.toThrow(
      "Unable to load countries."
    );
  });

  it("rejects failed city responses", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: vi.fn().mockResolvedValue({
          error: true,
          msg: "failed",
          data: null,
        }),
      })
    );

    await expect(fetchCities("United States")).rejects.toThrow(
      "Unable to load cities."
    );
  });
});
