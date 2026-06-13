export const SUPPORTED_LANGUAGES = [
  "en",
  "hi",
  "ur",
  "bn",
  "ta",
  "te",
  "mr",
  "gu",
  "pa",
  "ar"
] as const;

export function detectLanguage(text: string): string {
  const trimmed = text.trim();
  if (!trimmed.length) return "en";

  const arabic = /[\u0600-\u06FF]/.test(trimmed);
  const devanagari = /[\u0900-\u097F]/.test(trimmed);
  const bengali = /[\u0980-\u09FF]/.test(trimmed);
  const tamil = /[\u0B80-\u0BFF]/.test(trimmed);
  const telugu = /[\u0C00-\u0C7F]/.test(trimmed);
  const gujarati = /[\u0A80-\u0AFF]/.test(trimmed);
  const gurmukhi = /[\u0A00-\u0A7F]/.test(trimmed);

  if (arabic) return "ar";
  if (devanagari) return "hi";
  if (bengali) return "bn";
  if (tamil) return "ta";
  if (telugu) return "te";
  if (gujarati) return "gu";
  if (gurmukhi) return "pa";
  if (/\b(doctor|hospital|emergency|symptom|disease)\b/i.test(trimmed)) return "en";
  return "en";
}
