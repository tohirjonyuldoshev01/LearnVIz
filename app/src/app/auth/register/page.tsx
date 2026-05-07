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

/**
 * RegisterPage Component
 * 
 * User registration with automatic login flow.
 * Features:
 * - Form validation
 * - Auto-login after successful registration
 * - Immediate redirect to dashboard (no flicker)
 * - Proper auth loading state handling
 * - Error handling and display
 */
export default function RegisterPage() {
  const router = useRouter();
  const { register, isAuthenticated, isLoading: authLoading } = useAuth();
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    displayName: '',
  });

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!formData.email || !formData.password || !formData.displayName) {
      setError(t.register.allFieldsRequired);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t.auth.passwordMismatch);
      return;
    }

    if (formData.password.length < 6) {
      setError(t.register.passwordMinLength);
      return;
    }

    setIsLoading(true);
    try {
      // Register and auto-login user
      await register(
        formData.email,
        formData.password,
        formData.displayName
      );

      showSuccess(t.register.welcomeRedirect);

      // Immediate redirect - auth context is already updated
      setTimeout(() => {
        router.push('/dashboard');
      }, 800);
    } catch (err: any) {
      const errorMessage = err.message || t.register.registrationFailed;
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{t.auth.signUp}</h1>
            <p className="text-gray-600">{t.auth.registerMessage}</p>
          </div>

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
              label={t.auth.fullName}
              type="text"
              name="displayName"
              placeholder={t.auth.fullNamePlaceholder}
              value={formData.displayName}
              onChange={handleChange}
              required
              disabled={isLoading}
            />

            <Input
              label={t.auth.emailLabel}
              type="email"
              name="email"
              placeholder={t.auth.emailPlaceholder}
              value={formData.email}
              onChange={handleChange}
              required
              disabled={isLoading}
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
            />

            <Input
              label={t.auth.confirmPassword}
              type="password"
              name="confirmPassword"
              placeholder={t.auth.confirmPasswordPlaceholder}
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              disabled={isLoading}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              {isLoading ? t.auth.creatingAccount : t.auth.registerButton}
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              {t.auth.alreadyHaveAccount}{' '}
              <Link
                href="/auth/login"
                className="text-pastel-purple font-semibold hover:text-pastel-purple/80 transition-colors"
              >
                {t.auth.signInLink}
              </Link>
            </p>
          </div>

          {/* Terms */}
          <p className="mt-6 text-xs text-gray-500 text-center">
            {t.auth.agreeTerms}{' '}
            <Link href="/terms" className="text-pastel-purple hover:underline">
              {t.auth.termsOfService}
            </Link>{' '}
            {t.auth.and}{' '}
            <Link href="/privacy" className="text-pastel-purple hover:underline">
              {t.auth.privacyPolicy}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
