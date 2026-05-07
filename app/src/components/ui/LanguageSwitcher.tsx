'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import clsx from 'clsx';

/**
 * LanguageSwitcher Component
 * 
 * Dropdown to switch between English and Uzbek languages
 */
export const LanguageSwitcher: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const handleLanguageChange = (lang: 'en' | 'uz') => {
    setLanguage(lang);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-pastel-pink/45 dark:hover:bg-gray-700 transition-colors text-gray-700 dark:text-gray-300"
        title={t.common.language}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-semibold uppercase">{language}</span>
        <ChevronDown
          className={clsx(
            'w-4 h-4 transition-transform',
            isOpen && 'rotate-180'
          )}
        />
      </motion.button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-40 bg-pastel-pink/95 dark:bg-gray-700 rounded-xl shadow-lg border border-pastel-blue/70 dark:border-gray-600 py-2 z-50"
          >
            <button
              onClick={() => handleLanguageChange('en')}
              className={clsx(
                'w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors',
                language === 'en'
                  ? 'bg-pastel-blue/60 dark:bg-pastel-blue/35 text-pastel-purple dark:text-pastel-pink font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-pastel-blue/35 dark:hover:bg-gray-600'
              )}
            >
              <span className="text-base">🇺🇸</span>
              {t.common.english}
            </button>
            <button
              onClick={() => handleLanguageChange('uz')}
              className={clsx(
                'w-full text-left px-4 py-2 text-sm flex items-center gap-2 transition-colors',
                language === 'uz'
                  ? 'bg-pastel-blue/60 dark:bg-pastel-blue/35 text-pastel-purple dark:text-pastel-pink font-semibold'
                  : 'text-gray-700 dark:text-gray-300 hover:bg-pastel-blue/35 dark:hover:bg-gray-600'
              )}
            >
              <span className="text-base">🇺🇿</span>
              {t.common.uzbek}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSwitcher;
