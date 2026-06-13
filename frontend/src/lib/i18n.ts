import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// Load all translation json files under /translations using Vite's glob
const modules = (import.meta as any).glob("../translations/*/*.json", { eager: true }) as Record<string, any>;

const resources: Record<string, Record<string, any>> = {};
Object.entries(modules).forEach(([path, mod]) => {
  // path example: ../translations/en/common.json
  const parts = path.split("/");
  const lang = parts[parts.length - 2];
  const nsFile = parts[parts.length - 1];
  const ns = nsFile.replace(/\.json$/, "");
  resources[lang] = resources[lang] || {};
  resources[lang][ns] = (mod as any).default || mod;
});

// ensure supported languages include all translation folders and requested locales
const supportedLngs = [
  'en','hi','ur','bn','ta','te','mr','gu','pa','ar','ml','kn'
];

i18n.use(initReactI18next).init({
  resources,
  fallbackLng: 'en',
  supportedLngs,
  ns: ["common", "home", "dashboard", "consult", "reports", "about", "contact", "auth", "ai"],
  defaultNS: "common",
  interpolation: { escapeValue: false },
  react: { useSuspense: false },
});

// Basic resource key consistency check (dev-time only) — log missing keys compared to English
try {
  const en = resources['en'] || {};
  Object.keys(resources).forEach((lng) => {
    if (lng === 'en') return;
    const missing: string[] = [];
    Object.keys(en).forEach((ns) => {
      const enNs = en[ns] || {};
      const otherNs = (resources[lng] && resources[lng][ns]) || {};
      Object.keys(enNs).forEach((key) => {
        if (!(key in otherNs)) missing.push(`${ns}.${key}`);
      });
    });
    if (missing.length) console.warn(`i18n: Missing keys for '${lng}':`, missing.slice(0, 20));
  });
} catch (e) {
  // ignore in production
}

// Keep document direction updated on language change
i18n.on("languageChanged", (lng) => {
  if (typeof document !== "undefined") {
    document.documentElement.dir = lng === "ur" ? "rtl" : "ltr";
    document.documentElement.lang = lng;
    try {
      localStorage.setItem("sehat:lang", lng);
    } catch (_) {}
  }
});

export default i18n;
