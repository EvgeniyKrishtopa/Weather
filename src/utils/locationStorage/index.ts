import {
  COUNTRY_ISO_PATTERN,
  SELECTED_LOCATION_STORAGE_KEY,
} from "../../constants";
import {
  DEFAULT_GENDER_SELECTION,
  isGenderSelection,
  type StoredLocation,
} from "../../types/location";

export const loadStoredLocation = (): StoredLocation | null => {
  try {
    const serializedLocation = localStorage.getItem(
      SELECTED_LOCATION_STORAGE_KEY,
    );

    if (!serializedLocation) {
      return null;
    }

    const value: unknown = JSON.parse(serializedLocation);

    if (!value || typeof value !== "object") {
      return null;
    }

    const location = value as Record<string, unknown>;

    if (
      (location.city !== null && typeof location.city !== "string") ||
      typeof location.countryIso !== "string" ||
      !COUNTRY_ISO_PATTERN.test(location.countryIso) ||
      (location.gender !== undefined && !isGenderSelection(location.gender))
    ) {
      return null;
    }

    return {
      city: location.city,
      countryIso: location.countryIso,
      gender: isGenderSelection(location.gender)
        ? location.gender
        : DEFAULT_GENDER_SELECTION,
    };
  } catch {
    return null;
  }
};

export const saveStoredLocation = (location: StoredLocation): void => {
  try {
    localStorage.setItem(
      SELECTED_LOCATION_STORAGE_KEY,
      JSON.stringify(location),
    );
  } catch {
    // Location persistence is optional and must not block form interaction.
  }
};
