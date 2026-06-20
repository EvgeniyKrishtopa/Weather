import { describe, expect, it, vi } from "vitest";
import { getDefaultCountryIso } from ".";

const stubTimeZone = (timeZone?: string) => {
  vi.spyOn(Intl.DateTimeFormat.prototype, "resolvedOptions").mockReturnValue({
    calendar: "gregory",
    locale: "en-US",
    numberingSystem: "latn",
    timeZone,
  } as Intl.ResolvedDateTimeFormatOptions);
};

describe("localeCountry", () => {
  it("maps Europe/Kyiv to Ukraine", () => {
    stubTimeZone("Europe/Kyiv");

    expect(getDefaultCountryIso()).toBe("UA");
  });

  it("maps America/New_York to United States", () => {
    stubTimeZone("America/New_York");

    expect(getDefaultCountryIso()).toBe("US");
  });

  it("falls back when a country is not available from the timezone", () => {
    stubTimeZone("Unknown/Nowhere");

    expect(getDefaultCountryIso()).toBe("US");
  });

  it("ignores navigator language when detecting country", () => {
    stubTimeZone("Europe/Kyiv");
    vi.spyOn(window.navigator, "language", "get").mockReturnValue("ru-RU");
    vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["ru-RU"]);

    expect(getDefaultCountryIso()).toBe("UA");
  });
});
