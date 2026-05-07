'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, BarChart3, Users, Zap, Download, LayoutDashboard, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Grid } from '@/components/ui/Grid';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Loader } from '@/components/ui/Loader';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/LanguageContext';
import { DIAGRAM_TEMPLATES } from '@/lib/constants';

/**
 * HomePage Component
 * 
 * Dynamic homepage that adapts based on authentication state.
 * - Unauthenticated: Shows CTA for signup/signin
 * - Authenticated: Shows "Go to Dashboard" button
 * - Handles loading state to avoid flicker
 */
export default function Home() {
  const { isAuthenticated, isInitialized, isLoading } = useAuth();
  const { t } = useLanguage();
  const templates = Object.values(DIAGRAM_TEMPLATES);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const features = [
    {
      icon: <CheckCircle2 className="w-6 h-6" />,
      title: t.home.features.ai.title,
      description: t.home.features.ai.description,
    },
    {
      icon: <BarChart3 className="w-6 h-6" />,
      title: t.home.features.diagrams.title,
      description: t.home.features.diagrams.description,
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: t.home.features.multiRole.title,
      description: t.home.features.multiRole.description,
    },
    {
      icon: <Download className="w-6 h-6" />,
      title: t.home.features.export.title,
      description: t.home.features.export.description,
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: t.home.features.fast.title,
      description: t.home.features.fast.description,
    },
    {
      icon: <Sparkles className="w-6 h-6" />,
      title: t.home.features.tracking.title,
      description: t.home.features.tracking.description,
    },
  ];

  // Show loader until auth is initialized
  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-white/12 dark:bg-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-32">
          <motion.div
            className="text-center"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-pastel-purple/10 dark:bg-pastel-purple/15 px-4 py-2 rounded-full mb-6 border border-pastel-purple/20"
            >
              <Sparkles className="w-4 h-4 text-pastel-purple" />
              <span className="text-sm font-semibold text-pastel-purple dark:text-purple-300">
                {t.home.badge}
              </span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-gray-50 mb-6 leading-tight">
              {t.home.title}{' '}
              <span className="bg-gradient-to-r from-pastel-purple to-pastel-blue bg-clip-text text-transparent">
                {t.home.titleHighlight}
              </span>
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-200 max-w-2xl mx-auto mb-10 leading-relaxed">
              {isAuthenticated
                ? t.home.descriptionAuth
                : t.home.descriptionGuest}
            </p>

            {/* Dynamic CTA Buttons Based on Auth State */}
            <motion.div
              className="flex gap-4 justify-center flex-wrap"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {isLoading ? (
                <Button variant="primary" size="lg" disabled>
                  <Loader size="sm" />
                </Button>
              ) : isAuthenticated ? (
                // Authenticated User - Show Dashboard Button
                <Link href="/dashboard">
                  <Button variant="primary" size="lg" animated>
                    <LayoutDashboard className="w-5 h-5" />
                    {t.home.goToDashboard}
                  </Button>
                </Link>
              ) : (
                // Unauthenticated User - Show Signup/Signin
                <>
                  <Link href="/auth/register">
                    <Button variant="primary" size="lg" animated>
                      {t.home.getStartedFree}
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link href="/auth/login">
                    <Button variant="outline" size="lg" animated>
                      {t.home.signIn}
                    </Button>
                  </Link>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-4">
            {t.home.whyChoose}
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {t.home.everything}
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <Grid columns={3} gap="lg">
            {features.map((feature, index) => (
              <motion.div key={index} variants={itemVariants}>
                <AnimatedCard hover variant="default" delay={index * 0.1} className="bg-white/60 dark:bg-slate-800/50 border-white/30 dark:border-slate-700/30 hover:border-pastel-purple/30 dark:hover:border-pastel-purple/25">
                  <div className="space-y-4">
                    <motion.div
                      className="w-12 h-12 bg-gradient-to-br from-pastel-purple/20 to-pastel-blue/20 rounded-xl flex items-center justify-center text-pastel-purple"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </Grid>
        </motion.div>
      </div>

      {/* CTA Section - Dynamic Based on Auth */}
      {!isAuthenticated && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <motion.div
            className="bg-gradient-to-r from-pastel-purple/20 via-pastel-pink/15 to-pastel-blue/20 dark:from-pastel-purple/10 dark:via-pastel-pink/8 dark:to-pastel-blue/10 rounded-3xl p-12 text-center text-gray-900 dark:text-gray-50 shadow-[0_16px_48px_rgba(167,139,250,0.12)] border border-white/30 dark:border-slate-700/30 backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold mb-4">
              {t.home.ready}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto">
              {t.home.ctaDescription}
            </p>
            <Link href="/auth/register">
              <Button variant="primary" size="lg" animated>
                {t.home.startCreating}
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      )}
    </div>
  );
}
