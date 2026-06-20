import { describe, expect, it, vi } from "vitest";
import { DEFAULT_COUNTRY_ISO } from "../../constants";
import { getDefaultCountryIso } from "../../utils/localeCountry";
import { defaultCountryService } from ".";

vi.mock("../../utils/localeCountry", () => ({
  getDefaultCountryIso: vi.fn(),
}));

describe("defaultCountryService", () => {
  it("returns the default country from locale detection with the app fallback", () => {
    vi.mocked(getDefaultCountryIso).mockReturnValue("UA");

    expect(defaultCountryService.getDefaultCountryIso()).toBe("UA");
    expect(getDefaultCountryIso).toHaveBeenCalledWith(DEFAULT_COUNTRY_ISO);
  });
});
