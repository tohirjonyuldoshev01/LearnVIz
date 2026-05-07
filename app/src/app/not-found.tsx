'use client';

import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';

export default function NotFound() {
  const { t } = useLanguage();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6 bg-white/60 dark:bg-slate-800/50 backdrop-blur-xl rounded-3xl p-12 border border-white/30 dark:border-slate-700/30 shadow-[0_16px_48px_rgba(167,139,250,0.12)]">
        <h2 className="text-8xl font-black bg-gradient-to-r from-pastel-purple to-pastel-blue bg-clip-text text-transparent">404</h2>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-50">{t.errors.pageNotFound}</h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t.errors.pageNotFoundDescription}
        </p>
        <div className="pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-gradient-to-r from-pastel-purple to-pastel-blue rounded-2xl shadow-lg shadow-purple-200/30 hover:shadow-xl hover:scale-105 transition-all"
          >
            {t.errors.returnHome}
          </Link>
        </div>
      </div>
    </div>
  );
}
