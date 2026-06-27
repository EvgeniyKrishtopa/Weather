import { GenderSelection } from "../../../types/location";
import type { OutfitRecommendation } from "../../../types/outfitRecommendation";

export type BasicWeatherCondition =
  | "thunderstorm"
  | "drizzle"
  | "rain"
  | "snow"
  | "atmosphere"
  | "clear"
  | "clouds"
  | "current";

const atmosphereConditions = new Set([
  "atmosphere",
  "mist",
  "smoke",
  "haze",
  "dust",
  "fog",
  "sand",
  "ash",
  "squall",
  "tornado",
]);

export const getBasicWeatherCondition = (
  condition: string,
): BasicWeatherCondition => {
  const normalizedCondition = condition.toLowerCase();

  if (
    normalizedCondition === "thunderstorm" ||
    normalizedCondition === "drizzle" ||
    normalizedCondition === "rain" ||
    normalizedCondition === "snow" ||
    normalizedCondition === "clear" ||
    normalizedCondition === "clouds"
  ) {
    return normalizedCondition;
  }

  if (atmosphereConditions.has(normalizedCondition)) {
    return "atmosphere";
  }

  return "current";
};

export const fallbackClothingRecommendations: Record<
  GenderSelection,
  Record<BasicWeatherCondition, OutfitRecommendation>
> = {
  [GenderSelection.Woman]: {
    thunderstorm: {
      title: "Storm-safe covered layers",
      items: [
        "Waterproof hooded coat",
        "Warm knit layer",
        "Straight-leg trousers",
        "Non-slip ankle boots",
      ],
      description:
        "A waterproof outer layer and secure shoes help keep the outfit practical during stormy weather.",
    },
    drizzle: {
      title: "Light drizzle outfit",
      items: [
        "Light rain jacket",
        "Long-sleeve blouse",
        "Slim trousers",
        "Water-resistant flats",
      ],
      description:
        "Light rain protection keeps the look comfortable without feeling too heavy for drizzle.",
    },
    rain: {
      title: "Rain-ready warm layers",
      items: [
        "Water-resistant trench coat",
        "Warm knit layer",
        "Comfortable trousers",
        "Waterproof ankle boots",
      ],
      description:
        "Water-resistant outerwear and covered shoes keep the outfit practical for damp conditions.",
    },
    snow: {
      title: "Snow-ready warm outfit",
      items: [
        "Insulated parka",
        "Thermal top",
        "Fleece-lined trousers",
        "Warm waterproof boots",
      ],
      description:
        "Insulated layers and waterproof boots help protect against cold, wet snow.",
    },
    atmosphere: {
      title: "Low-visibility city layers",
      items: [
        "Light jacket",
        "Soft knit top",
        "Comfortable trousers",
        "Closed shoes",
      ],
      description:
        "Covered, easy layers work well when fog, haze, or dusty air makes conditions feel less clear.",
    },
    clear: {
      title: "Light clear-weather outfit",
      items: [
        "Light jacket",
        "Breathable blouse",
        "Comfortable trousers",
        "Closed shoes",
      ],
      description:
        "Breathable layers keep the outfit comfortable while leaving room for temperature changes.",
    },
    clouds: {
      title: "Cloudy-day soft layers",
      items: [
        "Soft cardigan",
        "Long-sleeve top",
        "Tailored trousers",
        "Comfortable loafers",
      ],
      description:
        "Soft layers add enough warmth for overcast conditions without making the outfit feel bulky.",
    },
    current: {
      title: "Light layered outfit",
      items: [
        "Light jacket",
        "Long-sleeve top",
        "Comfortable trousers",
        "Closed shoes",
      ],
      description:
        "A breathable layered look keeps you comfortable if the temperature shifts, while closed shoes add enough coverage for mild wind.",
    },
  },
  [GenderSelection.Man]: {
    thunderstorm: {
      title: "Storm-safe practical layers",
      items: [
        "Waterproof hooded jacket",
        "Warm crewneck layer",
        "Durable chinos",
        "Non-slip boots",
      ],
      description:
        "Waterproof outerwear and sturdy shoes help keep the outfit practical during stormy weather.",
    },
    drizzle: {
      title: "Light drizzle layers",
      items: [
        "Light rain jacket",
        "Oxford shirt",
        "Chinos",
        "Water-resistant sneakers",
      ],
      description:
        "A light rain shell adds enough protection for drizzle while keeping the outfit easy to wear.",
    },
    rain: {
      title: "Rain-ready casual layers",
      items: [
        "Water-resistant jacket",
        "Warm crewneck layer",
        "Chinos",
        "Waterproof sneakers",
      ],
      description:
        "A water-resistant jacket and covered shoes keep the outfit comfortable in damp conditions.",
    },
    snow: {
      title: "Snow-ready warm outfit",
      items: [
        "Insulated parka",
        "Thermal crewneck",
        "Lined chinos",
        "Warm waterproof boots",
      ],
      description:
        "Insulated layers and waterproof boots help protect against cold, wet snow.",
    },
    atmosphere: {
      title: "Low-visibility city layers",
      items: ["Light jacket", "Cotton shirt", "Chinos", "Closed sneakers"],
      description:
        "Simple covered layers work well when fog, haze, or dusty air makes conditions feel less clear.",
    },
    clear: {
      title: "Smart casual clear-weather outfit",
      items: ["Light coat", "Cotton shirt", "Chinos", "Casual sneakers"],
      description:
        "Easy layers give enough comfort without feeling heavy in clear conditions.",
    },
    clouds: {
      title: "Cloudy-day smart layers",
      items: ["Light field jacket", "Oxford shirt", "Chinos", "Loafers"],
      description:
        "A light jacket adds enough coverage for overcast weather while keeping the outfit polished.",
    },
    current: {
      title: "Smart casual layers",
      items: ["Light coat", "Cotton shirt", "Chinos", "Casual sneakers"],
      description:
        "Easy layers give enough warmth without feeling heavy, and casual sneakers keep the outfit practical for mild outdoor conditions.",
    },
  },
};

export const getFallbackClothingRecommendation = (
  outfitProfile: GenderSelection,
  condition: string,
): OutfitRecommendation =>
  fallbackClothingRecommendations[outfitProfile][
    getBasicWeatherCondition(condition)
  ];
