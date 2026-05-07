'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Alert } from '@/components/ui/Alert';
import { Loader } from '@/components/ui/Loader';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/LanguageContext';
import { showError, showSuccess } from '@/utils/toast';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

/**
 * LoginPage Component
 * 
 * User login with session expiration handling.
 * Features:
 * - Form validation
 * - Auto-redirect to dashboard on login
 * - Session expiration message display
 * - Proper auth loading state handling
 * - Remember me option (optional)
 */
export default function LoginPage() {
  const router = useRouter();
  const { login, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sessionExpiredMessage, setSessionExpiredMessage] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  // Check for session expiration message from URL or storage
  useEffect(() => {
    const SESSION_EXPIRED_KEY = 'learnviz_session_expired';
    const hasExpired = localStorage.getItem(SESSION_EXPIRED_KEY) === 'true';
    
    if (hasExpired) {
      setSessionExpiredMessage(true);
      localStorage.removeItem(SESSION_EXPIRED_KEY);
    }
  }, []);

  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/dashboard');
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <Loader size="lg" text="Checking authentication..." />
      </div>
    );
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!formData.email || !formData.password) {
      setError(t.auth.emailRequired);
      return;
    }

    setIsLoading(true);
    try {
      await login(formData.email, formData.password);
      showSuccess(t.auth.accountCreated || 'Welcome back!');
      
      // Immediate redirect - auth context is already updated
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    } catch (err: any) {
      const errorMessage = err.message || 'Login failed';
      setError(errorMessage);
      showError(errorMessage);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-transparent px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md w-full"
      >
        <div className="bg-white/60 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 rounded-2xl shadow-[0_16px_48px_rgba(167,139,250,0.12)] dark:shadow-[0_16px_48px_rgba(0,0,0,0.3)] backdrop-blur-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.4 }}
              className="w-14 h-14 bg-gradient-to-br from-pastel-purple to-pastel-blue rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-200/30"
            >
              <span className="text-2xl font-bold text-white">LV</span>
            </motion.div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.auth.signIn}</h1>
            <p className="text-gray-600">{t.auth.signInMessage}</p>
          </div>

          {/* Session Expired Alert */}
          {sessionExpiredMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="mb-4 p-3 bg-amber-50/70 dark:bg-amber-900/20 border border-amber-200/50 dark:border-amber-800/30 rounded-2xl flex items-start gap-3 backdrop-blur-sm"
            >
              <AlertCircle className="w-5 h-5 text-pastel-purple flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900 text-sm">{t.auth.sessionExpired}</p>
                <p className="text-gray-700 text-xs mt-1">
                  {t.auth.sessionExpiredMessage}
                </p>
              </div>
            </motion.div>
          )}

          {/* Error Alert */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Alert type="error" title="Error" onClose={() => setError(null)}>
                {error}
              </Alert>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label={t.auth.emailLabel}
              type="email"
              name="email"
              placeholder={t.auth.emailPlaceholder}
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
              autoComplete="email"
            />

            <Input
              label={t.auth.passwordLabel}
              type="password"
              name="password"
              placeholder={t.auth.passwordPlaceholder}
              value={formData.password}
              onChange={handleChange}
              required
              disabled={isLoading}
              autoComplete="current-password"
            />

            {/* Forgot password - placeholder, no page yet */}

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              {isLoading ? t.auth.signingIn : t.auth.signIn}
            </Button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t.auth.dontHaveAccount}{' '}
              <Link
                href="/auth/register"
                className="text-pastel-purple font-semibold hover:text-pastel-purple/80 transition-colors"
              >
                {t.auth.createOne}
              </Link>
            </p>
          </div>

          {/* Security Notice */}
          <p className="mt-6 text-xs text-gray-500 text-center px-2">
            {t.auth.securityNotice}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
