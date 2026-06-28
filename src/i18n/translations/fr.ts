import { GenderSelection } from "../../types/location";
import type { TranslationDictionary } from "../types";

export const fr: TranslationDictionary = {
  countries: {
    DE: "Allemagne",
    ES: "Espagne",
    FR: "France",
    GB: "Royaume-Uni",
    IT: "Italie",
    RU: "Russie",
    UA: "Ukraine",
    US: "États-Unis",
  },
  errors: {
    unableToConnectWeather: "Impossible de se connecter au service météo",
    weatherApiKeyMissing: "La clé Weather API n'est pas configurée",
    weatherInvalidResponse: "Le service météo a renvoyé une réponse non valide",
    weatherUnavailableTitle: "Météo indisponible",
  },
  fallbackRecommendations: {
    descriptions: {
      atmosphere:
        "Des couches couvrantes et faciles conviennent lorsque le brouillard ou la poussière réduit la visibilité.",
      clear:
        "Des couches respirantes gardent le confort tout en laissant de la marge aux changements de température.",
      clouds:
        "Des couches douces ajoutent assez de chaleur par temps couvert sans trop de volume.",
      current: "Une tenue légère en couches aide si la température change.",
      drizzle:
        "Une protection légère contre la pluie garde le confort sans être trop lourde.",
      rain: "Un extérieur déperlant et des chaussures fermées restent pratiques par temps humide.",
      snow: "Des couches isolantes et des bottes imperméables protègent du froid et de la neige mouillée.",
      thunderstorm:
        "Un extérieur imperméable et des chaussures stables aident pendant l'orage.",
    },
    items: {
      [GenderSelection.Woman]: {
        atmosphere: [
          "Veste légère",
          "Haut en maille douce",
          "Pantalon confortable",
          "Chaussures fermées",
        ],
        clear: [
          "Veste légère",
          "Blouse respirante",
          "Pantalon confortable",
          "Chaussures fermées",
        ],
        clouds: [
          "Cardigan doux",
          "Haut à manches longues",
          "Pantalon ajusté",
          "Mocassins confortables",
        ],
        current: [
          "Veste légère",
          "Haut à manches longues",
          "Pantalon confortable",
          "Chaussures fermées",
        ],
        drizzle: [
          "Veste de pluie légère",
          "Blouse à manches longues",
          "Pantalon slim",
          "Ballerines résistantes à l'eau",
        ],
        rain: [
          "Trench déperlant",
          "Couche en maille chaude",
          "Pantalon confortable",
          "Bottines imperméables",
        ],
        snow: [
          "Parka isolante",
          "Haut thermique",
          "Pantalon doublé polaire",
          "Bottes chaudes imperméables",
        ],
        thunderstorm: [
          "Manteau imperméable à capuche",
          "Couche en maille chaude",
          "Pantalon droit",
          "Bottines antidérapantes",
        ],
      },
      [GenderSelection.Man]: {
        atmosphere: [
          "Veste légère",
          "Chemise en coton",
          "Chino",
          "Baskets fermées",
        ],
        clear: ["Manteau léger", "Chemise en coton", "Chino", "Baskets casual"],
        clouds: [
          "Veste de terrain légère",
          "Chemise oxford",
          "Chino",
          "Mocassins",
        ],
        current: [
          "Manteau léger",
          "Chemise en coton",
          "Chino",
          "Baskets casual",
        ],
        drizzle: [
          "Veste de pluie légère",
          "Chemise oxford",
          "Chino",
          "Baskets déperlantes",
        ],
        rain: [
          "Veste déperlante",
          "Sweat chaud",
          "Chino",
          "Baskets imperméables",
        ],
        snow: [
          "Parka isolante",
          "Sweat thermique",
          "Chino doublé",
          "Bottes chaudes imperméables",
        ],
        thunderstorm: [
          "Veste imperméable à capuche",
          "Sweat chaud",
          "Chino robuste",
          "Bottes antidérapantes",
        ],
      },
    },
    titles: {
      atmosphere: "Couches urbaines pour faible visibilité",
      clear: "Tenue légère pour ciel clair",
      clouds: "Couches douces pour journée nuageuse",
      current: "Tenue légère en couches",
      drizzle: "Tenue pour fine bruine",
      rain: "Couches chaudes prêtes pour la pluie",
      snow: "Tenue chaude pour la neige",
      thunderstorm: "Couches protégées pour orage",
    },
  },
  form: {
    cityLabel: "Ville",
    countryLabel: "Pays",
    description:
      "Recherchez la météo actuelle et des idées de tenue par ville et pays.",
    noCities: "Aucune ville trouvée",
    outfitFor: "Tenue pour",
    outfitProfileAria: "Profil de tenue",
    submit: "Voir la météo et la tenue du jour",
    title: "Conseiller tenue météo",
    validationChooseCity: "Choisissez une ville.",
  },
  language: "fr",
  languageName: "French",
  loader: {
    loadingWeather: "Chargement de la météo...",
    loadingWeatherAria: "Chargement de la météo",
  },
  locale: "fr",
  outfitProfiles: {
    [GenderSelection.Woman]: "femme",
    [GenderSelection.Man]: "homme",
  },
  recommendation: {
    forAudience: (audience) => `Pour ${audience}`,
    loadingAria: "Chargement de la recommandation de tenue",
    loadingDescription: "Choix d'idées de tenue adaptées à la météo...",
    preparingTitle: "Préparation de la recommandation de tenue",
    recommendedClothingLabel: "Vêtements recommandés",
    regionLabel: "Recommandation de tenue",
  },
  weather: {
    currentCondition: "Actuel",
    currentWeather: "Météo actuelle",
    humidity: "Humidité",
    regionLabel: (cityName) => `Météo actuelle à ${cityName}`,
    windSpeed: "Vitesse du vent",
  },
};
