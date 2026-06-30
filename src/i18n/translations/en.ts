import { GenderSelection } from "../../types/location";
import type { TranslationDictionary } from "../types";

export const en: TranslationDictionary = {
  countries: {
    DE: "Germany",
    ES: "Spain",
    FR: "France",
    GB: "United Kingdom",
    IT: "Italy",
    RU: "Russia",
    UA: "Ukraine",
    US: "United States",
  },
  errors: {
    unableToConnectWeather: "Unable to connect to the weather service",
    weatherApiKeyMissing: "Weather API key is not configured",
    weatherInvalidResponse: "Weather service returned an invalid response",
    weatherUnavailableTitle: "Weather unavailable",
  },
  fallbackRecommendations: {
    descriptions: {
      atmosphere:
        "Covered, easy layers work well when fog, haze, or dusty air makes conditions feel less clear.",
      clear:
        "Breathable layers keep the outfit comfortable while leaving room for temperature changes.",
      clouds:
        "Soft layers add enough warmth for overcast conditions without making the outfit feel bulky.",
      current:
        "A breathable layered look keeps you comfortable if the temperature shifts.",
      drizzle:
        "Light rain protection keeps the look comfortable without feeling too heavy.",
      rain: "Water-resistant outerwear and covered shoes keep the outfit practical for damp conditions.",
      snow: "Insulated layers and waterproof boots help protect against cold, wet snow.",
      thunderstorm:
        "Waterproof outerwear and secure shoes help keep the outfit practical during stormy weather.",
    },
    items: {
      [GenderSelection.Woman]: {
        atmosphere: [
          "Light jacket",
          "Soft knit top",
          "Comfortable trousers",
          "Closed shoes",
        ],
        clear: [
          "Light jacket",
          "Breathable blouse",
          "Comfortable trousers",
          "Closed shoes",
        ],
        clouds: [
          "Soft cardigan",
          "Long-sleeve top",
          "Tailored trousers",
          "Comfortable loafers",
        ],
        current: [
          "Light jacket",
          "Long-sleeve top",
          "Comfortable trousers",
          "Closed shoes",
        ],
        drizzle: [
          "Light rain jacket",
          "Long-sleeve blouse",
          "Slim trousers",
          "Water-resistant flats",
        ],
        rain: [
          "Water-resistant trench coat",
          "Warm knit layer",
          "Comfortable trousers",
          "Waterproof ankle boots",
        ],
        snow: [
          "Insulated parka",
          "Thermal top",
          "Fleece-lined trousers",
          "Warm waterproof boots",
        ],
        thunderstorm: [
          "Waterproof hooded coat",
          "Warm knit layer",
          "Straight-leg trousers",
          "Non-slip ankle boots",
        ],
      },
      [GenderSelection.Man]: {
        atmosphere: [
          "Light jacket",
          "Cotton shirt",
          "Chinos",
          "Closed sneakers",
        ],
        clear: ["Light coat", "Cotton shirt", "Chinos", "Casual sneakers"],
        clouds: ["Light field jacket", "Oxford shirt", "Chinos", "Loafers"],
        current: ["Light coat", "Cotton shirt", "Chinos", "Casual sneakers"],
        drizzle: [
          "Light rain jacket",
          "Oxford shirt",
          "Chinos",
          "Water-resistant sneakers",
        ],
        rain: [
          "Water-resistant jacket",
          "Warm crewneck layer",
          "Chinos",
          "Waterproof sneakers",
        ],
        snow: [
          "Insulated parka",
          "Thermal crewneck",
          "Lined chinos",
          "Warm waterproof boots",
        ],
        thunderstorm: [
          "Waterproof hooded jacket",
          "Warm crewneck layer",
          "Durable chinos",
          "Non-slip boots",
        ],
      },
    },
    titles: {
      atmosphere: "Low-visibility city layers",
      clear: "Light clear-weather outfit",
      clouds: "Cloudy-day soft layers",
      current: "Light layered outfit",
      drizzle: "Light drizzle outfit",
      rain: "Rain-ready warm layers",
      snow: "Snow-ready warm outfit",
      thunderstorm: "Storm-safe covered layers",
    },
  },
  form: {
    cityLabel: "City",
    countryLabel: "Country",
    description:
      "Search current conditions and outfit ideas by city and country.",
    noCities: "No cities found",
    outfitFor: "Outfit for",
    outfitProfileAria: "Outfit profile",
    title: "Weather Outfit Advisor",
    validationChooseCity: "Choose a city.",
  },
  language: "en",
  languageName: "English",
  loader: {
    loadingWeather: "Loading weather...",
    loadingWeatherAria: "Loading weather",
  },
  locale: "en",
  outfitProfiles: {
    [GenderSelection.Woman]: "Woman",
    [GenderSelection.Man]: "Man",
  },
  recommendation: {
    forAudience: (audience) => `For ${audience}`,
    loadingAria: "Loading clothing recommendation",
    loadingDescription: "Choosing weather-aware outfit ideas...",
    preparingTitle: "Preparing outfit recommendation",
    recommendedClothingLabel: "Recommended clothing",
    regionLabel: "Clothing recommendation",
  },
  weather: {
    currentCondition: "Current",
    currentWeather: "Current weather",
    humidity: "Humidity",
    regionLabel: (cityName) => `Current weather in ${cityName}`,
    windSpeed: "Wind speed",
  },
};
