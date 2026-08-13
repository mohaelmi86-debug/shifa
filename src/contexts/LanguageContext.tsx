'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Language, SUPPORTED_LANGUAGES, isRTL, LANGUAGE_FONTS } from '@/lib/i18n';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  rtl: boolean;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextValue>({
  language: 'fr',
  setLanguage: () => {},
  rtl: false,
  dir: 'ltr',
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');

  useEffect(() => {
    const stored = (typeof window !== 'undefined' ? localStorage.getItem('shifa_language') : null) as Language | null;
    if (stored && SUPPORTED_LANGUAGES.find(l => l.code === stored)) {
      setLanguageState(stored);
    }
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('shifa_language', lang);
      // Update html dir attribute for RTL support
      document.documentElement.dir = isRTL(lang) ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  }, []);

  const rtl = isRTL(language);
  const dir: 'ltr' | 'rtl' = rtl ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, rtl, dir }}>
      <div
        dir={dir}
        lang={language}
        style={{
          fontFamily: LANGUAGE_FONTS[language],
        }}
      >
        {children}
      </div>
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
