import type { SupportedLanguage } from "./types";

export const supportedLanguageNames: Record<SupportedLanguage, string> = {
  de: "German",
  en: "English",
  es: "Spanish",
  fr: "French",
  it: "Italian",
  ru: "Russian",
  uk: "Ukrainian",
};

export const isSupportedLanguage = (
  value: unknown,
): value is SupportedLanguage =>
  typeof value === "string" && value in supportedLanguageNames;
