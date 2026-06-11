import { env } from '../config/env.js';

const supportedLanguages = new Map([
  ['en', 'English'],
  ['hi', 'Hindi'],
  ['ur', 'Urdu'],
  ['bn', 'Bengali'],
  ['ta', 'Tamil'],
  ['te', 'Telugu'],
]);

export const languageAliases = new Map<string, string>([
  ['english', 'en'],
  ['hindi', 'hi'],
  ['urdu', 'ur'],
  ['bengali', 'bn'],
  ['bangla', 'bn'],
  ['tamil', 'ta'],
  ['telugu', 'te'],
]);

export function normalizeLanguage(language?: string): string {
  if (!language) {
    return 'en';
  }

  const code = language.trim().toLowerCase();
  if (supportedLanguages.has(code)) {
    return code;
  }

  if (languageAliases.has(code)) {
    return languageAliases.get(code)!;
  }

  return 'en';
}

export function getDisplayLanguage(code: string): string {
  return supportedLanguages.get(code) || 'English';
}

export function supportedLanguageCodes(): string[] {
  return Array.from(supportedLanguages.keys());
}

export function isLanguageSupported(code: string): boolean {
  return supportedLanguages.has(normalizeLanguage(code));
}
