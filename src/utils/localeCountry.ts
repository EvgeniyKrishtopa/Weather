import { rawTimeZones } from "@vvo/tzdb";

const COUNTRY_ISO_PATTERN = /^[A-Z]{2}$/;

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

export const getDefaultCountryIso = (fallbackCountryIso = "US"): string => {
  const countryIso = getBrowserTimeZone();

  if (!countryIso) {
    return fallbackCountryIso;
  }

  return getCountryIsoByTimezone(countryIso) ?? fallbackCountryIso;
};
