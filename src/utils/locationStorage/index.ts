import {
  COUNTRY_ISO_PATTERN,
  SELECTED_LOCATION_STORAGE_KEY,
} from "../../constants";
import {
  DEFAULT_GENDER_SELECTION,
  GenderSelection,
  isGenderSelection,
  type StoredLocation,
} from "../../types/location";

const getStoredOutfitProfile = (location: Record<string, unknown>): unknown => {
  const value = location.outfitProfile ?? location.gender;

  if (value === "profile-a" || value === "woman") {
    return GenderSelection.Woman;
  }

  if (value === "profile-b" || value === "man") {
    return GenderSelection.Man;
  }

  return value;
};

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
    const outfitProfile = getStoredOutfitProfile(location);

    if (
      (location.city !== null && typeof location.city !== "string") ||
      typeof location.countryIso !== "string" ||
      !COUNTRY_ISO_PATTERN.test(location.countryIso) ||
      (outfitProfile !== undefined && !isGenderSelection(outfitProfile))
    ) {
      return null;
    }

    return {
      city: location.city,
      countryIso: location.countryIso,
      outfitProfile: isGenderSelection(outfitProfile)
        ? outfitProfile
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
      JSON.stringify({
        city: location.city,
        countryIso: location.countryIso,
        outfitProfile:
          location.outfitProfile === GenderSelection.Man
            ? "profile-b"
            : "profile-a",
      }),
    );
  } catch {
    // Location persistence is optional and must not block form interaction.
  }
};
