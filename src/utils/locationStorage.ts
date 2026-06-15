const STORAGE_KEY = "weather-app:selected-location";

export interface StoredLocation {
  city: string | null;
  countryIso: string;
}

export const loadStoredLocation = (): StoredLocation | null => {
  try {
    const serializedLocation = localStorage.getItem(STORAGE_KEY);

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
      !/^[A-Z]{2}$/.test(location.countryIso)
    ) {
      return null;
    }

    return {
      city: location.city,
      countryIso: location.countryIso,
    };
  } catch {
    return null;
  }
};

export const saveStoredLocation = (location: StoredLocation): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(location));
  } catch {
    // Location persistence is optional and must not block form interaction.
  }
};
