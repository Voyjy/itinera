import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from './locales/fr.json';
import en from './locales/en.json';

const LANG_KEY = 'solea_lang';

// Get saved language or default to French
const savedLang = localStorage.getItem(LANG_KEY) || 'fr';

i18n
    .use(initReactI18next)
    .init({
        resources: {
            fr: { translation: fr },
            en: { translation: en }
        },
        lng: savedLang,
        fallbackLng: 'fr',
        interpolation: {
            escapeValue: false // React already escapes
        }
    });

// Save language preference on change
i18n.on('languageChanged', (lng) => {
    localStorage.setItem(LANG_KEY, lng);
});

export default i18n;
