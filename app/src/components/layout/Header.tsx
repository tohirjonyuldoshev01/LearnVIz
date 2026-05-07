'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Menu, X, LayoutDashboard, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/LanguageContext';
import { Button } from '@/components/ui/Button';
import { DarkModeToggle } from '@/components/ui/DarkModeToggle';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import clsx from 'clsx';

interface HeaderProps {
  title?: string;
}

/**
 * Header Component
 * 
 * Dynamic navigation header that adapts based on authentication state.
 * Shows different UI for authenticated vs unauthenticated users.
 * 
 * Authenticated User UI:
 * - Dashboard link
 * - User profile with avatar and name
 * - Logout button
 * 
 * Unauthenticated User UI:
 * - Login button
 * - Sign Up button
 */
export const Header: React.FC<HeaderProps> = ({ title }) => {
  const { isAuthenticated, user, logout, isLoading } = useAuth();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setIsProfileOpen(false);
      setIsOpen(false);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Generate user avatar color based on name
  const getAvatarColor = (name: string) => {
    const hash = name.charCodeAt(0);
    const colors = [
      'from-pastel-purple to-pastel-blue',
      'from-pastel-blue to-pastel-pink',
      'from-pastel-pink to-pastel-purple',
      'from-pastel-yellow to-pastel-purple',
    ];
    return colors[hash % colors.length];
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <header className="sticky top-0 z-50 bg-white/60 dark:bg-slate-900/70 border-b border-white/30 dark:border-slate-700/30 shadow-[0_4px_24px_rgba(167,139,250,0.08)] dark:shadow-[0_4px_24px_rgba(0,0,0,0.3)] backdrop-blur-xl">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-pastel-purple to-pastel-blue rounded-xl flex items-center justify-center shadow-md shadow-purple-200/30">
              <span className="text-white font-bold">LV</span>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-pastel-purple to-pastel-blue bg-clip-text text-transparent">
              LearnViz
            </span>
          </motion.div>
        </Link>

        {/* Center Title */}
        <div className="flex-1 text-center">
          {title && (
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-sm font-semibold text-gray-700 dark:text-gray-300 hidden sm:block"
            >
              {title}
            </motion.h1>
          )}
        </div>

        {/* Right Actions - Desktop */}
        <div className="hidden md:flex items-center gap-2">
          {/* Dark Mode Toggle */}
          <DarkModeToggle />

          {/* Language Switcher */}
          <LanguageSwitcher />

          {isLoading ? (
            <div className="w-10 h-10 bg-pastel-blue/60 dark:bg-gray-700 rounded-full animate-pulse" />
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-4">
              {/* Dashboard Link */}
              <Link href="/dashboard">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button size="sm" variant="ghost" animated className="flex items-center gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    <span className="hidden lg:inline">{t.navbar.dashboard}</span>
                  </Button>
                </motion.div>
              </Link>

              {/* User Profile Dropdown */}
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-3 px-3 py-1.5 rounded-xl hover:bg-pastel-purple/10 dark:hover:bg-white/10 transition-colors group"
                >
                  {/* Avatar */}
                  <div
                    className={`w-8 h-8 rounded-full bg-gradient-to-br ${getAvatarColor(
                      user.displayName
                    )} flex items-center justify-center text-xs font-bold text-white`}
                  >
                    {getInitials(user.displayName)}
                  </div>

                  {/* User Info */}
                  <div className="hidden sm:flex flex-col items-start">
                    <p className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-none">
                      {user.displayName}
                    </p>
                  </div>

                  <ChevronDown
                    className={clsx(
                      'w-4 h-4 text-pastel-purple transition-transform',
                      isProfileOpen && 'rotate-180'
                    )}
                  />
                </motion.button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
                      className="absolute right-0 mt-2 w-64 bg-white/80 dark:bg-slate-800/90 rounded-2xl shadow-[0_16px_48px_rgba(167,139,250,0.15)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.4)] border border-white/40 dark:border-slate-700/40 py-2 backdrop-blur-xl"
                    >
                      <div className="px-4 py-3 border-b border-gray-200/50 dark:border-slate-600/50 flex flex-col gap-1.5">
                        <div className="flex items-center justify-between gap-2 overflow-hidden">
                          <p className="text-sm font-semibold text-gray-900 dark:text-white truncate" title={user.displayName}>
                            {user.displayName}
                          </p>
                        </div>
                        <p className="text-xs text-gray-700 dark:text-gray-300/90 truncate" title={user.email}>
                          {user.email}
                        </p>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-pastel-purple/10 dark:hover:bg-white/10 rounded-lg mx-1 flex items-center gap-2 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        {t.navbar.logout}
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link href="/auth/login">
                <Button size="sm" variant="ghost" animated>
                  {t.navbar.login}
                </Button>
              </Link>
              <Link href="/auth/register">
                <Button size="sm" variant="primary" animated>
                  {t.navbar.signUp}
                </Button>
              </Link>
            </div>
          )}
        </div>

        {/* Right Actions - Mobile */}
        <div className="flex md:hidden items-center gap-3">
          <DarkModeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-pastel-purple/10 dark:hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
            className="md:hidden border-t border-white/30 dark:border-slate-700/30 bg-white/60 dark:bg-slate-900/70 backdrop-blur-xl"
          >
            <div className="px-4 py-4 space-y-3">
              {isLoading ? (
                <div className="w-full h-10 bg-pastel-blue/60 dark:bg-gray-700 rounded animate-pulse" />
              ) : isAuthenticated && user ? (
                <>
                  <Link href="/dashboard" onClick={() => setIsOpen(false)}>
                    <Button
                      variant="ghost"
                      className="w-full justify-start flex items-center gap-2"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      {t.navbar.dashboard}
                    </Button>
                  </Link>
                    <div className="border-t border-gray-200/50 dark:border-gray-600 pt-3 mt-3">
                    <div className="px-3 py-2 rounded-xl bg-white/50 dark:bg-white/5 mb-3 overflow-hidden border border-white/30 dark:border-slate-700/30">
                      <p className="text-sm font-semibold text-gray-900 dark:text-white truncate" title={user.displayName}>
                        {user.displayName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate" title={user.email}>
                        {user.email}
                      </p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-3 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-pastel-purple/10 dark:hover:bg-white/10 rounded-xl flex items-center gap-2 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      {t.navbar.logout}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-start">
                      {t.navbar.login}
                    </Button>
                  </Link>
                  <Link href="/auth/register" onClick={() => setIsOpen(false)}>
                    <Button variant="primary" className="w-full justify-start">
                      {t.navbar.signUp}
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};
