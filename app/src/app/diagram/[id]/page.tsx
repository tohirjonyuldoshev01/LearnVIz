'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import { DiagramRenderer } from '@/components/diagrams';
import { Loader } from '@/components/ui/Loader';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/hooks/useAuth';
import { useDiagrams } from '@/hooks/useDiagrams';
import { useExport } from '@/hooks/useExport';
import { useEvaluation } from '@/hooks/useEvaluation';
import { useLanguage } from '@/context/LanguageContext';
import { EvaluationCard } from '@/components/ui/EvaluationCard';
import { diagramService } from '@/services/diagramService';
import { showSuccess, showError } from '@/utils/toast';
import { EvaluationRequest } from '@/types';

export default function ViewDiagramPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { export: exportDiagram } = useExport();
  const { evaluation, isLoading: isEvaluating, evaluate } = useEvaluation();
  const { deleteDiagram } = useDiagrams(user?.id || '');
  const { t } = useLanguage();
  const [diagram, setDiagram] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showEvaluation, setShowEvaluation] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!isAuthenticated) {
      // not ready or not logged in yet
      return;
    }

    const loadDiagram = async () => {
      try {
        const data = await diagramService.getDiagram(params.id);
        if (!data) {
          showError(t.viewDiagram.notFound);
          router.push('/dashboard');
          return;
        }
        setDiagram(data);
        // If diagram has an evaluation, show it
        if (data.evaluation) {
          setShowEvaluation(true);
        }
      } catch (error: any) {
        showError(error.message || t.viewDiagram.loadFailed);
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    loadDiagram();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, params.id]);

  const handleExport = async (format: 'png' | 'pdf') => {
    const element = document.getElementById('diagram-container');
    if (!element) {
      showError(t.viewDiagram.diagramNotFound);
      return;
    }

    try {
      const filename = `${diagram.title}.${format}`;
      await exportDiagram(element, format, filename);
      showSuccess(t.viewDiagram.diagramExported.replace('{format}', format.toUpperCase()));
    } catch (error: any) {
      showError(error.message || t.viewDiagram.exportFailed);
    }
  };

  const handleSubmitForEvaluation = async () => {
    if (!diagram) {
      showError(t.viewDiagram.notFound);
      return;
    }

    try {
      const evaluationRequest: EvaluationRequest = {
        topic: diagram.topic,
        diagramType: diagram.type,
        content: diagram.content,
        educationLevel: diagram.educationLevel || 'middle',
      };

      const result = await evaluate(evaluationRequest);
      showSuccess(t.viewDiagram.evaluateSuccess);
      
      // Save evaluation to diagram in database
      try {
        await diagramService.updateDiagram(diagram.id, {
          evaluation: result,
          evaluatedAt: new Date().toISOString(),
        });
      } catch (dbError) {
        console.warn('Failed to save evaluation to database:', dbError);
        // Don't fail the evaluation display if database save fails
      }
      
      setShowEvaluation(true);
    } catch (error: any) {
      showError(error.message || t.viewDiagram.evaluateFailed);
    }
  };

  if (authLoading) {
    return (
      <Layout title={t.viewDiagram.loading}>
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" text={t.viewDiagram.checkingAuth} />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (isLoading) {
    return (
      <Layout title={t.viewDiagram.loading}>
        <div className="flex justify-center items-center py-12">
          <Loader size="lg" text={t.viewDiagram.loadingDiagram} />
        </div>
      </Layout>
    );
  }

  if (!diagram) {
    return (
      <Layout title={t.viewDiagram.notFound}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-pastel-pink/40 rounded-full flex items-center justify-center mb-4 text-2xl">!</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">{t.viewDiagram.notFound}</h2>
          <Button onClick={() => router.push('/dashboard')} variant="primary" className="mt-4">
            ← {t.navbar.dashboard}
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={diagram.title}>
      <div className="space-y-6">
        {/* Diagram Info */}
        <Card className="bg-gradient-to-r from-pastel-blue/35 to-pastel-pink/40 border border-pastel-blue/70">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">{t.viewDiagram.title}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-50">{diagram.title}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">{t.viewDiagram.type}</p>
              <p className="text-lg font-bold text-pastel-purple">{diagram.type.toUpperCase()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400 font-semibold">{t.viewDiagram.topic}</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-50">{diagram.topic}</p>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            {t.viewDiagram.created}: {new Date(diagram.createdAt).toLocaleString()}
          </div>
        </Card>

        {/* Action Buttons */}
        <Card>
          <div className="flex flex-wrap gap-3">
            <Button
              onClick={() => handleExport('png')}
              variant="accent"
              size="md"
            >
              📥 {t.viewDiagram.exportPng}
            </Button>
            <Button
              onClick={() => handleExport('pdf')}
              variant="accent"
              size="md"
            >
              📄 {t.viewDiagram.exportPdf}
            </Button>
            <Button
              onClick={() => router.push(`/diagram/${diagram.id}/edit`)}
              variant="secondary"
              size="md"
            >
              ✏️ {t.viewDiagram.edit}
            </Button>
            <Button
              onClick={handleSubmitForEvaluation}
              isLoading={isEvaluating}
              variant="primary"
              size="md"
            >
              🤖 {t.viewDiagram.evaluate}
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={async () => {
                if (!confirm(t.viewDiagram.deleteConfirm)) return;
                try {
                  await deleteDiagram(diagram.id);
                  showSuccess(t.viewDiagram.deleteSuccess);
                  router.push('/dashboard');
                } catch (err: any) {
                  showError(err.message || t.viewDiagram.deleteFailed);
                }
              }}
            >
              🗑️ {t.viewDiagram.delete}
            </Button>
          </div>
        </Card>

        {/* Diagram Container */}
        <Card>
          <h2 className="text-xl font-bold mb-4">{t.viewDiagram.preview}</h2>
          <div id="diagram-container" className="w-full bg-pastel-blue/20 p-4 rounded-xl">
            <DiagramRenderer type={diagram.type} content={diagram.content} />
          </div>
        </Card>

        {/* Evaluation Results */}
        {(showEvaluation && diagram) && (evaluation || diagram.evaluation) && (
          <Card className="border-2 border-pastel-yellow bg-pastel-yellow/35">
            <h2 className="text-xl font-bold mb-4">📊 {t.viewDiagram.evaluationResults}</h2>
            <EvaluationCard evaluation={evaluation || diagram.evaluation!} />
            {diagram?.evaluatedAt && (
              <p className="text-xs text-gray-500 mt-4">
                {t.viewDiagram.evaluatedOn}: {new Date(diagram.evaluatedAt).toLocaleString()}
              </p>
            )}
          </Card>
        )}

        {/* Loading State for Evaluation */}
        {isEvaluating && (
          <Card className="text-center py-12">
            <Loader size="lg" text={t.viewDiagram.evaluating} />
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-2">
          <Button onClick={() => router.push('/dashboard')} variant="outline">
            ← {t.navbar.dashboard}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
