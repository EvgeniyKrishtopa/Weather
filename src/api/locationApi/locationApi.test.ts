import { describe, expect, it } from "vitest";
import { supportedCountryIsoValues } from "../../i18n";
import { getCuratedCityValues, getSupportedCountryOptions } from ".";

describe("location options", () => {
  it("returns supported countries in configured order", () => {
    expect(getSupportedCountryOptions()).toEqual([
      { name: "Ukraine", iso2: "UA" },
      { name: "Russia", iso2: "RU" },
      { name: "United States", iso2: "US" },
      { name: "United Kingdom", iso2: "GB" },
      { name: "Spain", iso2: "ES" },
      { name: "Italy", iso2: "IT" },
      { name: "Germany", iso2: "DE" },
      { name: "France", iso2: "FR" },
    ]);
  });

  it("does not include unsupported countries", () => {
    expect(
      getSupportedCountryOptions().some((country) => country.iso2 === "CA"),
    ).toBe(false);
  });

  it("returns 40 curated city values for every supported country", () => {
    supportedCountryIsoValues.forEach((countryIso) => {
      expect(getCuratedCityValues(countryIso)).toHaveLength(40);
    });
  });
});
