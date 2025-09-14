// src/i18n/index.ts
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpBackend from "i18next-http-backend";

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        supportedLngs: ["en", "ar"],
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: "/locales/{{lng}}/translation.json",
        },
        detection: {
            order: ["localStorage", "navigator"],
            caches: ["localStorage"],
        },
    });

export default i18n;
