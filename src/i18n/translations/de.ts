import { GenderSelection } from "../../types/location";
import type { TranslationDictionary } from "../types";

export const de: TranslationDictionary = {
  countries: {
    DE: "Deutschland",
    ES: "Spanien",
    FR: "Frankreich",
    GB: "Vereinigtes Königreich",
    IT: "Italien",
    RU: "Russland",
    UA: "Ukraine",
    US: "USA",
  },
  errors: {
    unableToConnectWeather: "Keine Verbindung zum Wetterdienst möglich",
    weatherApiKeyMissing: "Der Weather-API-Schlüssel ist nicht konfiguriert",
    weatherInvalidResponse:
      "Der Wetterdienst hat eine ungültige Antwort geliefert",
    weatherUnavailableTitle: "Wetter nicht verfügbar",
  },
  fallbackRecommendations: {
    descriptions: {
      atmosphere:
        "Bedeckte, bequeme Schichten passen gut, wenn Nebel oder Staub die Sicht mindern.",
      clear:
        "Atmungsaktive Schichten bleiben angenehm und lassen Spielraum für Temperaturwechsel.",
      clouds:
        "Weiche Schichten geben an bewölkten Tagen Wärme ohne zu viel Volumen.",
      current:
        "Ein leichter Lagenlook hilft, wenn sich die Temperatur verändert.",
      drizzle:
        "Leichter Regenschutz hält angenehm trocken, ohne zu schwer zu wirken.",
      rain: "Wasserabweisende Oberbekleidung und geschlossene Schuhe sind bei Nässe praktisch.",
      snow: "Isolierende Schichten und wasserdichte Stiefel schützen vor kaltem, nassem Schnee.",
      thunderstorm:
        "Wasserdichte Oberbekleidung und sichere Schuhe helfen bei Gewitter.",
    },
    items: {
      [GenderSelection.Woman]: {
        atmosphere: [
          "Leichte Jacke",
          "Weiches Strickoberteil",
          "Bequeme Hose",
          "Geschlossene Schuhe",
        ],
        clear: [
          "Leichte Jacke",
          "Atmungsaktive Bluse",
          "Bequeme Hose",
          "Geschlossene Schuhe",
        ],
        clouds: [
          "Weicher Cardigan",
          "Langarmtop",
          "Elegante Hose",
          "Bequeme Loafer",
        ],
        current: [
          "Leichte Jacke",
          "Langarmtop",
          "Bequeme Hose",
          "Geschlossene Schuhe",
        ],
        drizzle: [
          "Leichte Regenjacke",
          "Langarmbluse",
          "Schmale Hose",
          "Wasserabweisende Ballerinas",
        ],
        rain: [
          "Wasserabweisender Trenchcoat",
          "Warme Strickschicht",
          "Bequeme Hose",
          "Wasserdichte Stiefeletten",
        ],
        snow: [
          "Isolierter Parka",
          "Thermooberteil",
          "Fleecegefütterte Hose",
          "Warme wasserdichte Stiefel",
        ],
        thunderstorm: [
          "Wasserdichter Kapuzenmantel",
          "Warme Strickschicht",
          "Gerade Hose",
          "Rutschfeste Stiefeletten",
        ],
      },
      [GenderSelection.Man]: {
        atmosphere: [
          "Leichte Jacke",
          "Baumwollhemd",
          "Chinos",
          "Geschlossene Sneaker",
        ],
        clear: [
          "Leichter Mantel",
          "Baumwollhemd",
          "Chinos",
          "Freizeit-Sneaker",
        ],
        clouds: ["Leichte Fieldjacket", "Oxford-Hemd", "Chinos", "Loafer"],
        current: [
          "Leichter Mantel",
          "Baumwollhemd",
          "Chinos",
          "Freizeit-Sneaker",
        ],
        drizzle: [
          "Leichte Regenjacke",
          "Oxford-Hemd",
          "Chinos",
          "Wasserabweisende Sneaker",
        ],
        rain: [
          "Wasserabweisende Jacke",
          "Warme Sweatshirt-Schicht",
          "Chinos",
          "Wasserdichte Sneaker",
        ],
        snow: [
          "Isolierter Parka",
          "Thermo-Sweatshirt",
          "Gefütterte Chinos",
          "Warme wasserdichte Stiefel",
        ],
        thunderstorm: [
          "Wasserdichte Kapuzenjacke",
          "Warme Sweatshirt-Schicht",
          "Robuste Chinos",
          "Rutschfeste Stiefel",
        ],
      },
    },
    titles: {
      atmosphere: "City-Lagen für schlechte Sicht",
      clear: "Leichtes Outfit für klares Wetter",
      clouds: "Weiche Schichten für Wolkentage",
      current: "Leichter Lagenlook",
      drizzle: "Outfit für leichten Nieselregen",
      rain: "Warme Schichten für Regen",
      snow: "Warmes Outfit für Schnee",
      thunderstorm: "Geschützte Schichten für Gewitter",
    },
  },
  form: {
    cityLabel: "Stadt",
    countryLabel: "Land",
    description:
      "Suche aktuelle Bedingungen und Outfit-Ideen nach Stadt und Land.",
    noCities: "Keine Städte gefunden",
    outfitFor: "Outfit für",
    outfitProfileAria: "Outfit-Profil",
    title: "Wetter-Outfit-Berater",
    validationChooseCity: "Wähle eine Stadt.",
  },
  language: "de",
  languageName: "German",
  loader: {
    loadingWeather: "Wetter wird geladen...",
    loadingWeatherAria: "Wetter wird geladen",
  },
  locale: "de",
  outfitProfiles: {
    [GenderSelection.Woman]: "Frauen",
    [GenderSelection.Man]: "Männer",
  },
  recommendation: {
    forAudience: (audience) => `Für ${audience}`,
    loadingAria: "Kleidungsempfehlung wird geladen",
    loadingDescription: "Wettergerechte Outfit-Ideen werden ausgewählt...",
    preparingTitle: "Outfit-Empfehlung wird vorbereitet",
    recommendedClothingLabel: "Empfohlene Kleidung",
    regionLabel: "Kleidungsempfehlung",
  },
  weather: {
    currentCondition: "Aktuell",
    currentWeather: "Aktuelles Wetter",
    humidity: "Luftfeuchtigkeit",
    regionLabel: (cityName) => `Aktuelles Wetter in ${cityName}`,
    windSpeed: "Windgeschwindigkeit",
  },
};
