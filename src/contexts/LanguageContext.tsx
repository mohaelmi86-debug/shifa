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

// Apply RTL/LTR to the html element directly (for full-page RTL support)
function applyDocumentDir(lang: Language) {
  if (typeof window === 'undefined') return;
  const dir = isRTL(lang) ? 'rtl' : 'ltr';
  document.documentElement.dir = dir;
  document.documentElement.lang = lang;
  // Apply Arabic font stack to body when RTL
  if (lang === 'ar') {
    document.documentElement.style.fontFamily = LANGUAGE_FONTS['ar'];
  } else if (lang === 'zh') {
    document.documentElement.style.fontFamily = LANGUAGE_FONTS['zh'];
  } else {
    document.documentElement.style.fontFamily = '';
  }
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('fr');
  const [mounted, setMounted] = useState(false);

  // On mount: restore language from localStorage and apply dir immediately
  useEffect(() => {
    const stored = localStorage.getItem('shifa_language') as Language | null;
    if (stored && SUPPORTED_LANGUAGES.find(l => l.code === stored)) {
      setLanguageState(stored);
      applyDocumentDir(stored);
    }
    setMounted(true);
  }, []);

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('shifa_language', lang);
    applyDocumentDir(lang);
  }, []);

  const rtl = isRTL(language);
  const dir: 'ltr' | 'rtl' = rtl ? 'rtl' : 'ltr';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, rtl, dir }}>
      <div
        dir={dir}
        lang={language}
        className={rtl ? 'rtl-layout' : ''}
        style={{
          fontFamily: LANGUAGE_FONTS[language],
          textAlign: rtl ? 'right' : 'left',
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
