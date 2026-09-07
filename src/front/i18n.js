import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import useGlobalReducer from "./hooks/useGlobalReducer";
import spanish from "./locales/es.json";
import english from "./locales/en.json";
import languageData from "./locales/translations.json";

const resources = {
  es: {
    translation: Object.fromEntries(
      languageData.es.map((item) => [item.clave, item.titulo]),
    ),
  },
  en: {
    translation: Object.fromEntries(
      languageData.en.map((item) => [item.clave, item.title]),
    ),
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: localStorage.getItem("language") || "es",
  fallbackLng: "es",
  interpolation: {
    escapeValue: false,
  },
});

const originalText = new WeakMap();
const originalElementText = new WeakMap();
const originalAttributes = new WeakMap();

const englishById = Object.fromEntries(
  languageData.en.map((item) => [item.id, item]),
);
const arrayTranslations = {
  es: Object.fromEntries(
    languageData.es.flatMap((item) => [
      [item.titulo, item.titulo],
      [item.descripcion, item.descripcion],
    ]),
  ),
  en: Object.fromEntries(
    languageData.es.flatMap((item) => [
      [item.titulo, englishById[item.id]?.title || item.titulo],
      [item.descripcion, englishById[item.id]?.description || item.descripcion],
    ]),
  ),
};

const translate = (value, language) => {
  const trimmed = value.replace(/\s+/g, " ").trim();
  const legacyTranslations = language === "en" ? english : spanish;
  const translations = arrayTranslations[language] || {};
  const translated = translations[trimmed] || legacyTranslations[trimmed];
  if (!translated) return value;
  return translated;
};

const translateDocument = (language) => {
  document.querySelectorAll("body *").forEach((element) => {
    if (["SCRIPT", "STYLE", "INPUT", "TEXTAREA"].includes(element.tagName))
      return;

    const hasOnlyTextNodes = [...element.childNodes].every(
      (child) => child.nodeType === Node.TEXT_NODE,
    );
    if (!hasOnlyTextNodes || !element.textContent.trim()) return;

    const original = originalElementText.get(element) || element.textContent;
    originalElementText.set(element, original);
    element.textContent = translate(original, language);
  });

  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  const textNodes = [];
  let node;
  while ((node = walker.nextNode())) textNodes.push(node);

  textNodes.forEach((textNode) => {
    if (textNode.parentElement.closest("script, style, input, textarea"))
      return;
    if (originalElementText.has(textNode.parentElement)) return;
    const original = originalText.get(textNode) || textNode.nodeValue;
    originalText.set(textNode, original);
    textNode.nodeValue = translate(original, language);
  });

  document
    .querySelectorAll("[placeholder], [aria-label], [title]")
    .forEach((element) => {
      ["placeholder", "aria-label", "title"].forEach((attribute) => {
        const attributes = originalAttributes.get(element) || {};
        const original =
          attributes[attribute] || element.getAttribute(attribute);
        if (!original) return;
        attributes[attribute] = original;
        originalAttributes.set(element, attributes);
        element.setAttribute(attribute, translate(original, language));
      });
    });
};

export const LanguageTranslator = () => {
  const { store } = useGlobalReducer();
  const location = useLocation();
  const { i18n: translationInstance } = useTranslation();

  useEffect(() => {
    if (translationInstance.language !== (store.language || "es")) {
      translationInstance.changeLanguage(store.language || "es");
    }
    translateDocument(store.language || "es");
  }, [store.language, location.pathname, translationInstance]);

  return null;
};

export default i18n;
