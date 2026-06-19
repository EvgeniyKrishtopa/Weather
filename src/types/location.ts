export interface CountryOption {
  name: string;
  iso2: string;
}

export interface CurrentCoordinates {
  latitude: number;
  longitude: number;
}

export interface StoredLocation {
  city: string | null;
  countryIso: string;
}
