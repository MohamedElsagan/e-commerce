import i18next from "i18next";
import Backend from "i18next-fs-backend";
import i18nextMiddleware from "i18next-http-middleware";

// نهيئ i18next
i18next
  .use(Backend)
  .use(i18nextMiddleware.LanguageDetector)
  .init({
    fallbackLng: "en",
    backend: {
      loadPath: "./locales/{{lng}}/translation.json" // المسار النسبي من مكان تشغيل السيرفر
    },
    detection: {
      order: ["cookie", "querystring", "header"],
      caches: ["cookie"],
      lookupCookie: "lang",
      lookupQuerystring: "lang"
    }
  });

// نصدّر الإعدادات والميدلوير الجاهز
export { i18next, i18nextMiddleware };
