import { isLanguageSupported, normalizeLanguage } from '../utils/language.js';

export function resolveConversationLanguage(preferredLanguage?: string) {
  if (!preferredLanguage) {
    return 'en';
  }

  const normalized = normalizeLanguage(preferredLanguage);
  return isLanguageSupported(normalized) ? normalized : 'en';
}

export function formatLanguageResponse(text: string, language: string) {
  return text.trim();
}
