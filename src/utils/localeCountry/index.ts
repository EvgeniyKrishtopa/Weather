import { rawTimeZones } from "@vvo/tzdb";
import { COUNTRY_ISO_PATTERN, DEFAULT_COUNTRY_ISO } from "../../constants";

const normalizeCountryIso = (countryIso: string): string | null => {
  const normalizedCountryIso = countryIso.toUpperCase();

  return COUNTRY_ISO_PATTERN.test(normalizedCountryIso)
    ? normalizedCountryIso
    : null;
};

const getCountryIsoByTimezone = (timeZone: string): string | null => {
  const matchedTimeZone = rawTimeZones.find(
    ({ group, name }) => name === timeZone || group.includes(timeZone),
  );

  if (!matchedTimeZone) {
    return null;
  }

  return normalizeCountryIso(matchedTimeZone.countryCode);
};

const getBrowserTimeZone = (): string | null => {
  const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (typeof timeZone !== "string" || timeZone.trim() === "") {
    return null;
  }

  return timeZone;
};

export const getDefaultCountryIso = (
  fallbackCountryIso = DEFAULT_COUNTRY_ISO,
): string => {
  const countryIso = getBrowserTimeZone();

  if (!countryIso) {
    return fallbackCountryIso;
  }

  return getCountryIsoByTimezone(countryIso) ?? fallbackCountryIso;
};
