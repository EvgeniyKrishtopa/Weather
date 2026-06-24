export interface CountryOption {
  name: string;
  iso2: string;
}

export interface CurrentCoordinates {
  latitude: number;
  longitude: number;
}

export enum GenderSelection {
  Woman = "woman",
  Man = "man",
}

export const genderSelections = Object.values(GenderSelection);

export const DEFAULT_GENDER_SELECTION = GenderSelection.Woman;

export const isGenderSelection = (value: unknown): value is GenderSelection =>
  typeof value === "string" &&
  genderSelections.includes(value as GenderSelection);

export interface StoredLocation {
  city: string | null;
  countryIso: string;
  gender: GenderSelection;
}
