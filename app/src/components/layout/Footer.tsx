import React from 'react';
import Link from 'next/link';
import { Mail, Zap } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

export const Footer: React.FC = () => {
  const { t } = useLanguage();

  return (
    <footer className="mt-16 bg-white/40 dark:bg-slate-900/50 border-t border-white/30 dark:border-slate-700/30 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-pastel-purple to-pastel-blue rounded-xl flex items-center justify-center shadow-md shadow-purple-200/30">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-gray-50">
                LearnViz
              </h3>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {t.footer.description}
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-50 mb-4">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2">
              {[
                { href: '/', label: t.footer.home },
                { href: '/dashboard', label: t.footer.dashboard },
                { href: '/diagram/create', label: t.footer.create },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-600 dark:text-gray-400 hover:text-pastel-purple dark:hover:text-pastel-pink transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-gray-900 dark:text-gray-50 mb-4">
              {t.footer.getInTouch}
            </h4>
            <div className="space-y-2">
              <a
                href="mailto:info@learnviz.com"
                className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-pastel-purple dark:hover:text-pastel-pink transition-colors text-sm"
              >
                <Mail className="w-4 h-4" />
                info@learnviz.com
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200/40 dark:border-gray-700/40 pt-8">
          <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} {t.footer.copyright}
          </p>
        </div>
      </div>
    </footer>
  );
};
