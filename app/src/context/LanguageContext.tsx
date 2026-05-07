'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language, en, uz, Translations } from '@/lib/i18n/translations';

const LANGUAGE_KEY = 'learnviz_language';

interface LanguageContextValue {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translations;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('en');

  // Read saved language after mount to avoid hydration mismatch
  useEffect(() => {
    const saved = localStorage.getItem(LANGUAGE_KEY) as Language | null;
    if (saved === 'en' || saved === 'uz') {
      setLanguageState(saved);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem(LANGUAGE_KEY, lang);
  };

  const translations = language === 'uz' ? uz : en;

  const value: LanguageContextValue = {
    language,
    setLanguage,
    t: translations,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

/**
 * useLanguage Hook
 * 
 * Use this hook to access language context and translations
 */
export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext);

  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return context;
};

export default LanguageContext;
