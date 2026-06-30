import { GenderSelection } from "../../types/location";
import type { TranslationDictionary } from "../types";

export const it: TranslationDictionary = {
  countries: {
    DE: "Germania",
    ES: "Spagna",
    FR: "Francia",
    GB: "Regno Unito",
    IT: "Italia",
    RU: "Russia",
    UA: "Ucraina",
    US: "Stati Uniti",
  },
  errors: {
    unableToConnectWeather: "Impossibile connettersi al servizio meteo",
    weatherApiKeyMissing: "La chiave Weather API non è configurata",
    weatherInvalidResponse:
      "Il servizio meteo ha restituito una risposta non valida",
    weatherUnavailableTitle: "Meteo non disponibile",
  },
  fallbackRecommendations: {
    descriptions: {
      atmosphere:
        "Strati coperti e comodi sono utili quando nebbia o polvere riducono la visibilità.",
      clear:
        "Strati traspiranti mantengono il comfort e lasciano margine ai cambi di temperatura.",
      clouds:
        "Strati morbidi aggiungono calore nelle giornate nuvolose senza troppo volume.",
      current: "Un look leggero a strati aiuta se la temperatura cambia.",
      drizzle:
        "Una protezione leggera dalla pioggia mantiene il comfort senza appesantire.",
      rain: "Capispalla resistenti all'acqua e scarpe chiuse sono pratici con l'umidità.",
      snow: "Strati isolanti e stivali impermeabili proteggono da freddo e neve bagnata.",
      thunderstorm:
        "Capispalla impermeabili e scarpe sicure aiutano durante un temporale.",
    },
    items: {
      [GenderSelection.Woman]: {
        atmosphere: [
          "Giacca leggera",
          "Top morbido in maglia",
          "Pantaloni comodi",
          "Scarpe chiuse",
        ],
        clear: [
          "Giacca leggera",
          "Blusa traspirante",
          "Pantaloni comodi",
          "Scarpe chiuse",
        ],
        clouds: [
          "Cardigan morbido",
          "Top a maniche lunghe",
          "Pantaloni sartoriali",
          "Mocassini comodi",
        ],
        current: [
          "Giacca leggera",
          "Top a maniche lunghe",
          "Pantaloni comodi",
          "Scarpe chiuse",
        ],
        drizzle: [
          "Giacca leggera antipioggia",
          "Blusa a maniche lunghe",
          "Pantaloni slim",
          "Ballerine resistenti all'acqua",
        ],
        rain: [
          "Trench resistente all'acqua",
          "Maglia calda",
          "Pantaloni comodi",
          "Stivaletti impermeabili",
        ],
        snow: [
          "Parka imbottito",
          "Maglia termica",
          "Pantaloni foderati in pile",
          "Stivali caldi impermeabili",
        ],
        thunderstorm: [
          "Cappotto impermeabile con cappuccio",
          "Maglia calda",
          "Pantaloni dritti",
          "Stivaletti antiscivolo",
        ],
      },
      [GenderSelection.Man]: {
        atmosphere: [
          "Giacca leggera",
          "Camicia di cotone",
          "Chino",
          "Sneaker chiuse",
        ],
        clear: [
          "Cappotto leggero",
          "Camicia di cotone",
          "Chino",
          "Sneaker casual",
        ],
        clouds: [
          "Field jacket leggera",
          "Camicia oxford",
          "Chino",
          "Mocassini",
        ],
        current: [
          "Cappotto leggero",
          "Camicia di cotone",
          "Chino",
          "Sneaker casual",
        ],
        drizzle: [
          "Giacca leggera antipioggia",
          "Camicia oxford",
          "Chino",
          "Sneaker resistenti all'acqua",
        ],
        rain: [
          "Giacca resistente all'acqua",
          "Felpa calda",
          "Chino",
          "Sneaker impermeabili",
        ],
        snow: [
          "Parka imbottito",
          "Felpa termica",
          "Chino foderati",
          "Stivali caldi impermeabili",
        ],
        thunderstorm: [
          "Giacca impermeabile con cappuccio",
          "Felpa calda",
          "Chino resistenti",
          "Stivali antiscivolo",
        ],
      },
    },
    titles: {
      atmosphere: "Strati urbani per bassa visibilità",
      clear: "Look leggero per tempo sereno",
      clouds: "Strati morbidi per giornata nuvolosa",
      current: "Look leggero a strati",
      drizzle: "Look per pioviggine leggera",
      rain: "Strati caldi pronti per la pioggia",
      snow: "Look caldo per la neve",
      thunderstorm: "Strati protetti per temporale",
    },
  },
  form: {
    cityLabel: "Città",
    countryLabel: "Paese",
    description: "Cerca condizioni attuali e idee outfit per città e paese.",
    noCities: "Nessuna città trovata",
    outfitFor: "Outfit per",
    outfitProfileAria: "Profilo outfit",
    title: "Consulente outfit meteo",
    validationChooseCity: "Scegli una città.",
  },
  language: "it",
  languageName: "Italian",
  loader: {
    loadingWeather: "Caricamento meteo...",
    loadingWeatherAria: "Caricamento meteo",
  },
  locale: "it",
  outfitProfiles: {
    [GenderSelection.Woman]: "donna",
    [GenderSelection.Man]: "uomo",
  },
  recommendation: {
    forAudience: (audience) => `Per ${audience}`,
    loadingAria: "Caricamento raccomandazione outfit",
    loadingDescription: "Scelta di idee outfit adatte al meteo...",
    preparingTitle: "Preparazione raccomandazione outfit",
    recommendedClothingLabel: "Abbigliamento consigliato",
    regionLabel: "Raccomandazione outfit",
  },
  weather: {
    currentCondition: "Attuale",
    currentWeather: "Meteo attuale",
    humidity: "Umidità",
    regionLabel: (cityName) => `Meteo attuale a ${cityName}`,
    windSpeed: "Velocità del vento",
  },
};
