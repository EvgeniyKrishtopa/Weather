import { describe, expect, it } from "vitest";
import {
  createCityOptions,
  filterSupportedCountries,
  getCityDisplayName,
  getCountryDisplayName,
  getCuratedCityList,
  getLanguageForCountryIso,
  supportedCountryIsoValues,
  supportedCountryLanguages,
} from ".";

describe("i18n country and language helpers", () => {
  it("resolves each supported country to its configured language", () => {
    expect(
      Object.fromEntries(
        Object.keys(supportedCountryLanguages).map((countryIso) => [
          countryIso,
          getLanguageForCountryIso(countryIso),
        ]),
      ),
    ).toEqual(supportedCountryLanguages);
  });

  it("falls back to English for unsupported countries", () => {
    expect(getLanguageForCountryIso("CA")).toBe("en");
  });

  it("filters unsupported countries and keeps supported country order", () => {
    expect(
      filterSupportedCountries([
        { name: "Canada", iso2: "CA" },
        { name: "Italy", iso2: "IT" },
        { name: "Ukraine", iso2: "UA" },
        { name: "Germany", iso2: "DE" },
      ]),
    ).toEqual([
      { name: "Ukraine", iso2: "UA" },
      { name: "Italy", iso2: "IT" },
      { name: "Germany", iso2: "DE" },
    ]);
  });

  it("returns localized country display names", () => {
    expect(getCountryDisplayName("IT", "it")).toBe("Italia");
    expect(getCountryDisplayName("DE", "de")).toBe("Deutschland");
    expect(getCountryDisplayName("GB", "en")).toBe("United Kingdom");
  });

  it("returns localized city display names for mapped cities", () => {
    expect(getCityDisplayName("Rome", "IT", "it")).toBe("Roma");
    expect(getCityDisplayName("Kyiv", "UA", "uk")).toBe("Київ");
    expect(getCityDisplayName("Munich", "DE", "de")).toBe("München");
    expect(getCityDisplayName("Moscow", "RU", "ru")).toBe("Москва");
  });

  it("falls back to the canonical city name when a localized city label is unavailable", () => {
    expect(getCityDisplayName("Unknown City", "IT", "it")).toBe("Unknown City");
  });

  it("creates city options with canonical values and localized labels", () => {
    expect(createCityOptions(["Rome", "Unknown City"], "IT", "it")).toEqual([
      { value: "Rome", label: "Roma" },
      { value: "Unknown City", label: "Unknown City" },
    ]);
  });

  it("defines exactly 40 unique curated cities for every supported country", () => {
    supportedCountryIsoValues.forEach((countryIso) => {
      const cityList = getCuratedCityList(countryIso);
      const cityValues = cityList.map(({ value }) => value);

      expect(cityList).toHaveLength(40);
      expect(new Set(cityValues).size).toBe(40);
    });
  });

  it("defines a label for each country's selected language", () => {
    supportedCountryIsoValues.forEach((countryIso) => {
      const language = supportedCountryLanguages[countryIso];

      getCuratedCityList(countryIso).forEach(({ labels }) => {
        expect(labels[language]).toBeTruthy();
      });
    });
  });
});
