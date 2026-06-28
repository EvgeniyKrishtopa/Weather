import {
  DEFAULT_LANGUAGE,
  getTranslation,
  type SupportedLanguage,
} from "../../i18n";

export function currentDate(
  language: SupportedLanguage = DEFAULT_LANGUAGE,
): string {
  return new Intl.DateTimeFormat(getTranslation(language).locale, {
    month: "long",
    day: "2-digit",
    year: "numeric",
  }).format(new Date());
}
