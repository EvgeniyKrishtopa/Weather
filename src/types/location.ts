export interface CountryOption {
  name: string;
  iso2: string;
}

export interface CurrentCoordinates {
  latitude: number;
  longitude: number;
}

export const genderSelections = ["woman", "man"] as const;

export type GenderSelection = (typeof genderSelections)[number];

export const DEFAULT_GENDER_SELECTION: GenderSelection = "woman";

export const isGenderSelection = (value: unknown): value is GenderSelection =>
  typeof value === "string" &&
  genderSelections.includes(value as GenderSelection);

export interface StoredLocation {
  city: string | null;
  countryIso: string;
  gender: GenderSelection;
}
