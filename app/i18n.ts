import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslations from '@/data/locales/en.json';

export type SupportedLanguage = 'en' | 'id' | 'de' | 'zh';

export type TranslationKey = keyof typeof enTranslations;

const loadedLanguages = new Set<string>(['en']);

export async function loadLanguage(lang: SupportedLanguage): Promise<void> {
  if (loadedLanguages.has(lang)) {
    await i18n.changeLanguage(lang);
    return;
  }

  try {
    let bundle: Record<string, string>;
    switch (lang) {
      case 'id':
        bundle = (await import('@/data/locales/id.json')).default;
        break;
      case 'de':
        bundle = (await import('@/data/locales/de.json')).default;
        break;
      case 'zh':
        bundle = (await import('@/data/locales/zh.json')).default;
        break;
      default:
        bundle = enTranslations;
    }

    i18n.addResourceBundle(lang, 'translation', bundle, true, true);
    loadedLanguages.add(lang);
    await i18n.changeLanguage(lang);
  } catch (error) {
    console.error(`Failed to load translations for ${lang}:`, error);
    await i18n.changeLanguage('en');
  }
}

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
