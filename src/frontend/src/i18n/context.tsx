import React, { createContext, useContext, useState } from 'react';
import { translations } from './translations';

export type I18nContextType = {
    lang: Lang
    setLang: (lang: Lang) => void
    t: (path: string) => string
}

export type Lang = "ro" | "en" | "ru"

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: {children: React.ReactNode}) {
  const [lang, setLang] = useState<Lang>(() => {
    return (localStorage.getItem("lang") as Lang) || "ro";
  });
  const setLangAndPersist = (newLang: Lang) => {
  localStorage.setItem('lang', newLang);
  setLang(newLang);
  };
  const t = (path: string) => {
    const keys = path.split('.');
    let result: Record<string, unknown> = translations[lang];
    for (const key of keys) {
      result = result?.[key] as Record<string, unknown>;
    }
    return typeof result === "string" ? result : "";
  };
  return (
    <I18nContext.Provider value={{ lang, setLang: setLangAndPersist, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;

}