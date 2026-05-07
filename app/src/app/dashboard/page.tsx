'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit, Eye, Zap } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Grid } from '@/components/ui/Grid';
import Card from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { EmptyState } from '@/components/ui/EmptyState';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { Alert } from '@/components/ui/Alert';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/context/LanguageContext';
import { useDiagrams } from '@/hooks/useDiagrams';
import { showSuccess, showError } from '@/utils/toast';


function DashboardContent() {
  const { user, isLoading: authLoading, isInitialized } = useAuth();
  const { t } = useLanguage();
  const { diagrams, isLoading, fetchUserDiagrams, deleteDiagram, error: diagramError } = useDiagrams(user?.id || '');
  const [deleteIdLoading, setDeleteIdLoading] = useState<string | null>(null);

  useEffect(() => {
    if (isInitialized && !authLoading && user?.id) {
      fetchUserDiagrams();
    }
  }, [isInitialized, authLoading, user?.id, fetchUserDiagrams]);

  const handleDelete = async (diagramId: string) => {
    if (!confirm(t.dashboard.deleteConfirm)) return;

    setDeleteIdLoading(diagramId);
    try {
      await deleteDiagram(diagramId);
      try {
        // refresh from backend to make sure nothing stale is left in the store
        await fetchUserDiagrams();
      } catch (refreshErr: any) {
        console.warn('refresh after delete failed', refreshErr);
        // still show success since the diagram is gone; user can manually reload if needed
      }
      showSuccess(t.dashboard.deleteSuccess);
    } catch (error: any) {
      showError(error.message || t.dashboard.deleteFailed);
    } finally {
      setDeleteIdLoading(null);
    }
  };

  return (
    <Layout title={t.dashboard.myDiagrams}>
      {/* Header Section */}
      {(diagramError) && (
        <Alert type="error" title="Error" className="mb-4">
          {diagramError}
        </Alert>
      )}
      <motion.div
        className="mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <div className="flex flex-wrap justify-between items-center mb-2">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-50 mb-2">
              {t.dashboard.myDiagrams}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {diagrams.length === 0
                ? t.dashboard.createFirstItemMessage
                : `${t.dashboard.youHave} ${diagrams.length} ${diagrams.length !== 1 ? t.dashboard.diagrams : t.dashboard.diagram}`}
            </p>
          </div>
          <Link href="/diagram/create">
            <Button variant="primary" size="lg" animated>
              <Plus className="w-5 h-5" />
              {t.dashboard.createDiagram}
            </Button>
          </Link>
        </div>
      </motion.div>

      {/* Content Section */}
      {isLoading ? (
        <motion.div
          className="flex justify-center items-center py-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <Loader size="lg" text={t.dashboard.loadingDiagrams} />
        </motion.div>
      ) : diagrams.length === 0 ? (
        <EmptyState
          icon={
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
            >
              <Zap className="w-16 h-16 text-pastel-purple" />
            </motion.div>
          }
          title={t.dashboard.noDiagrams}
          description={t.dashboard.createFirst}
          action={{
            label: t.dashboard.createFirstButton,
            href: '/diagram/create',
          }}
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.25 }}
        >
          <motion.div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {diagrams.map((diagram, index) => (
              <motion.div
                key={diagram.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: index * 0.06, ease: [0.25, 0.1, 0.25, 1] }}
              >
                <AnimatedCard hover delay={index * 0.1} className="bg-white/60 dark:bg-slate-800/50 border-white/30 dark:border-slate-700/30 hover:border-pastel-purple/30 dark:hover:border-pastel-purple/25">
                  <div className="space-y-4 h-full flex flex-col">
                    {/* Title and Type Badge */}
                    <div>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-gray-50 flex-1 line-clamp-2">
                          {diagram.title}
                        </h3>
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-gradient-to-r from-pastel-purple/15 to-pastel-blue/15 text-pastel-purple whitespace-nowrap">
                          {diagram.type}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {diagram.topic}
                      </p>
                    </div>

                    {/* Meta Information */}
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      <p>
                        {t.dashboard.created}{' '}
                        {new Date(diagram.createdAt).toLocaleDateString()}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 mt-auto pt-4 border-t border-gray-200/40 dark:border-gray-700/40">
                      <Link
                        href={`/diagram/${diagram.id}`}
                        className="flex-1"
                      >
                        <Button
                          size="sm"
                          variant="primary"
                          fullWidth
                          animated
                        >
                          <Eye className="w-4 h-4" />
                          {t.dashboard.view}
                        </Button>
                      </Link>
                      <Link
                        href={`/diagram/${diagram.id}/edit`}
                        className="flex-1"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          fullWidth
                          animated
                        >
                          <Edit className="w-4 h-4" />
                          {t.dashboard.edit}
                        </Button>
                      </Link>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(diagram.id)}
                        disabled={deleteIdLoading === diagram.id}
                        className="p-2 rounded-xl border border-rose-200/50 dark:border-rose-800/40 text-rose-500 dark:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-900/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {deleteIdLoading === diagram.id ? (
                          <motion.svg
                            className="w-4 h-4"
                            animate={{ rotate: 360 }}
                            transition={{
                              repeat: Infinity,
                              duration: 1,
                              ease: 'linear',
                            }}
                          >
                            <circle
                              className="opacity-25"
                              cx="8"
                              cy="8"
                              r="6"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                            />
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M8 3a5 5 0 100 2"
                            />
                          </motion.svg>
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </AnimatedCard>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      )}
    </Layout>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
