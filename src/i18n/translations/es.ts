import { GenderSelection } from "../../types/location";
import type { TranslationDictionary } from "../types";

export const es: TranslationDictionary = {
  countries: {
    DE: "Alemania",
    ES: "España",
    FR: "Francia",
    GB: "Reino Unido",
    IT: "Italia",
    RU: "Rusia",
    UA: "Ucrania",
    US: "Estados Unidos",
  },
  errors: {
    unableToConnectWeather: "No se pudo conectar con el servicio meteorológico",
    weatherApiKeyMissing: "La clave de Weather API no está configurada",
    weatherInvalidResponse:
      "El servicio meteorológico devolvió una respuesta no válida",
    weatherUnavailableTitle: "El tiempo no está disponible",
  },
  fallbackRecommendations: {
    descriptions: {
      atmosphere:
        "Las capas cubiertas funcionan bien cuando la niebla o el polvo reducen la visibilidad.",
      clear:
        "Las capas transpirables mantienen la comodidad y permiten cambios de temperatura.",
      clouds:
        "Las capas suaves aportan calor para un día nublado sin añadir demasiado volumen.",
      current: "Un conjunto ligero por capas ayuda si la temperatura cambia.",
      drizzle:
        "Una protección ligera contra la lluvia mantiene la comodidad sin pesar demasiado.",
      rain: "La ropa exterior resistente al agua y el calzado cerrado son prácticos para la humedad.",
      snow: "Las capas aislantes y las botas impermeables protegen del frío y la nieve húmeda.",
      thunderstorm:
        "La ropa impermeable y el calzado seguro ayudan durante una tormenta.",
    },
    items: {
      [GenderSelection.Woman]: {
        atmosphere: [
          "Chaqueta ligera",
          "Top de punto suave",
          "Pantalones cómodos",
          "Zapatos cerrados",
        ],
        clear: [
          "Chaqueta ligera",
          "Blusa transpirable",
          "Pantalones cómodos",
          "Zapatos cerrados",
        ],
        clouds: [
          "Cárdigan suave",
          "Top de manga larga",
          "Pantalones de vestir",
          "Mocasines cómodos",
        ],
        current: [
          "Chaqueta ligera",
          "Top de manga larga",
          "Pantalones cómodos",
          "Zapatos cerrados",
        ],
        drizzle: [
          "Chaqueta ligera de lluvia",
          "Blusa de manga larga",
          "Pantalones ajustados",
          "Bailarinas resistentes al agua",
        ],
        rain: [
          "Gabardina resistente al agua",
          "Capa de punto cálida",
          "Pantalones cómodos",
          "Botines impermeables",
        ],
        snow: [
          "Parka aislante",
          "Camiseta térmica",
          "Pantalones con forro polar",
          "Botas cálidas impermeables",
        ],
        thunderstorm: [
          "Abrigo impermeable con capucha",
          "Capa de punto cálida",
          "Pantalones rectos",
          "Botines antideslizantes",
        ],
      },
      [GenderSelection.Man]: {
        atmosphere: [
          "Chaqueta ligera",
          "Camisa de algodón",
          "Chinos",
          "Zapatillas cerradas",
        ],
        clear: [
          "Abrigo ligero",
          "Camisa de algodón",
          "Chinos",
          "Zapatillas casuales",
        ],
        clouds: [
          "Chaqueta ligera de campo",
          "Camisa oxford",
          "Chinos",
          "Mocasines",
        ],
        current: [
          "Abrigo ligero",
          "Camisa de algodón",
          "Chinos",
          "Zapatillas casuales",
        ],
        drizzle: [
          "Chaqueta ligera de lluvia",
          "Camisa oxford",
          "Chinos",
          "Zapatillas resistentes al agua",
        ],
        rain: [
          "Chaqueta resistente al agua",
          "Sudadera cálida",
          "Chinos",
          "Zapatillas impermeables",
        ],
        snow: [
          "Parka aislante",
          "Sudadera térmica",
          "Chinos forrados",
          "Botas cálidas impermeables",
        ],
        thunderstorm: [
          "Chaqueta impermeable con capucha",
          "Sudadera cálida",
          "Chinos resistentes",
          "Botas antideslizantes",
        ],
      },
    },
    titles: {
      atmosphere: "Capas urbanas para baja visibilidad",
      clear: "Conjunto ligero para cielo despejado",
      clouds: "Capas suaves para un día nublado",
      current: "Conjunto ligero por capas",
      drizzle: "Conjunto para llovizna ligera",
      rain: "Capas cálidas listas para la lluvia",
      snow: "Conjunto cálido para nieve",
      thunderstorm: "Capas protegidas para tormenta",
    },
  },
  form: {
    cityLabel: "Ciudad",
    countryLabel: "País",
    description:
      "Busca condiciones actuales e ideas de ropa por ciudad y país.",
    noCities: "No se encontraron ciudades",
    outfitFor: "Ropa para",
    outfitProfileAria: "Perfil de ropa",
    title: "Asesor de ropa según el tiempo",
    validationChooseCity: "Elige una ciudad.",
  },
  language: "es",
  languageName: "Spanish",
  loader: {
    loadingWeather: "Cargando el tiempo...",
    loadingWeatherAria: "Cargando el tiempo",
  },
  locale: "es",
  outfitProfiles: {
    [GenderSelection.Woman]: "mujer",
    [GenderSelection.Man]: "hombre",
  },
  recommendation: {
    forAudience: (audience) => `Para ${audience}`,
    loadingAria: "Cargando recomendación de ropa",
    loadingDescription: "Eligiendo ideas de ropa según el tiempo...",
    preparingTitle: "Preparando recomendación de ropa",
    recommendedClothingLabel: "Ropa recomendada",
    regionLabel: "Recomendación de ropa",
  },
  weather: {
    currentCondition: "Actual",
    currentWeather: "Tiempo actual",
    humidity: "Humedad",
    regionLabel: (cityName) => `Tiempo actual en ${cityName}`,
    windSpeed: "Velocidad del viento",
  },
};
