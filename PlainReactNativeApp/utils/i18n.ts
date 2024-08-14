import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {pl, en, de, uk, cz, sk} from '@/languages';

const resources = {
  pl,
  en,
  de,
  uk,
  cz,
  sk,
};

const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: callback => {
    AsyncStorage.getItem('user-language', (err, language) => {
      if (err || !language) {
        // eslint-disable-next-line no-console
        console.error('Error detecting language:', err);
        callback('pl');
      } else {
        callback(language);
      }
    });
  },
  init: () => {},
  cacheUserLanguage: language => {
    AsyncStorage.setItem('user-language', language).catch(err =>
      // eslint-disable-next-line no-console
      console.error('Error caching user language:', err),
    );
  },
};

i18n
  .use(languageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'pl',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
