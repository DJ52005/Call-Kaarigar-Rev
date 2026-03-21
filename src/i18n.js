import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appName: "Call Kaarigar",
      settings: "System Settings",
      general: "General",
      security: "Security",
      maintenance: "Enable maintenance mode",
      language: "Language",
      radius: "Service Radius (km)"
    }
  },
  hi: {
    translation: {
      appName: "कॉल कारीगर",
      settings: "सिस्टम सेटिंग्स",
      general: "सामान्य",
      security: "सुरक्षा",
      maintenance: "मेंटेनेंस मोड सक्षम करें",
      language: "भाषा",
      radius: "सेवा त्रिज्या (कि.मी.)"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "en",
    fallbackLng: "en",
    interpolation: { escapeValue: false },
  });

export default i18n;
