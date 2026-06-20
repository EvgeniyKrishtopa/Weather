import type { CountryOption } from "../../types/location";

const COUNTRIES_API_URL = "https://countriesnow.space/api/v0.1/countries/iso";
const CITIES_API_URL = "https://countriesnow.space/api/v0.1/countries/cities";

interface CountriesNowResponse {
  error: boolean;
  msg: string;
  data: unknown;
}

interface CountriesNowCountry {
  name: string;
  Iso2: string;
}

const isCountriesNowResponse = (
  value: unknown,
): value is CountriesNowResponse =>
  !!value &&
  typeof value === "object" &&
  "error" in value &&
  typeof value.error === "boolean" &&
  "msg" in value &&
  typeof value.msg === "string" &&
  "data" in value;

const isCountriesNowCountry = (value: unknown): value is CountriesNowCountry =>
  !!value &&
  typeof value === "object" &&
  "name" in value &&
  typeof value.name === "string" &&
  "Iso2" in value &&
  typeof value.Iso2 === "string" &&
  /^[A-Z]{2}$/.test(value.Iso2);

const compareNames = (first: string, second: string): number =>
  first.localeCompare(second, "en");

export const fetchCountries = async (
  signal?: AbortSignal,
): Promise<CountryOption[]> => {
  const response = await fetch(COUNTRIES_API_URL, { signal });
  const body: unknown = await response.json();

  if (
    !response.ok ||
    !isCountriesNowResponse(body) ||
    body.error ||
    !Array.isArray(body.data) ||
    !body.data.every(isCountriesNowCountry)
  ) {
    throw new Error("Unable to load countries.");
  }

  return body.data
    .map(({ name, Iso2 }) => ({ name, iso2: Iso2 }))
    .sort((first, second) => compareNames(first.name, second.name));
};

export const fetchCities = async (
  countryName: string,
  signal?: AbortSignal,
): Promise<string[]> => {
  const response = await fetch(CITIES_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ country: countryName }),
    signal,
  });
  const body: unknown = await response.json();

  if (
    !response.ok ||
    !isCountriesNowResponse(body) ||
    body.error ||
    !Array.isArray(body.data) ||
    !body.data.every((city) => typeof city === "string")
  ) {
    throw new Error("Unable to load cities.");
  }

  return [...new Set(body.data)].sort(compareNames);
};
