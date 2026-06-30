export interface Env {
  AI: {
    run: (model: string, input: WorkersAiInput) => Promise<unknown>;
  };
}

export interface OutfitRecommendationRequest {
  temperature: number;
  feelsLike: number;
  windSpeed: number;
  humidity: number;
  condition: string;
  city: string;
  countryIso: string;
  gender: "woman" | "man";
  language: SupportedLanguage;
  languageName: string;
}

export interface OutfitRecommendation {
  title: string;
  items: string[];
  description: string;
}

export interface WorkersAiInput {
  messages: Array<{
    role: "system" | "user";
    content: string;
  }>;
  max_completion_tokens: number;
  temperature: number;
}

export type SupportedLanguage = "en" | "uk" | "ru" | "es" | "it" | "de" | "fr";
export type FallbackWeatherFeel = "cold" | "mild" | "rainy" | "warm" | "windy";
