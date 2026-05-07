'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Card from '@/components/ui/Card';
import { DiagramRenderer } from '@/components/diagrams';
import { Loader } from '@/components/ui/Loader';
import { Alert } from '@/components/ui/Alert';
import { useAuth } from '@/hooks/useAuth';
import { useDiagrams } from '@/hooks/useDiagrams';
import { useEvaluation } from '@/hooks/useEvaluation';
import { EvaluationCard } from '@/components/ui/EvaluationCard';
import { diagramService } from '@/services/diagramService';
import { showSuccess, showError } from '@/utils/toast';
import { Diagram, DiagramContent, EvaluationRequest } from '@/types';
import { useLanguage } from '@/context/LanguageContext';

export default function EditDiagramPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { updateDiagram, deleteDiagram } = useDiagrams(user?.id || '');
  const { evaluation, isLoading: isEvaluating, evaluate } = useEvaluation();
  const { t } = useLanguage();
  const [diagram, setDiagram] = useState<Diagram | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState<DiagramContent>({});
  const [showEvaluation, setShowEvaluation] = useState(false);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
      return;
    }

    if (!isAuthenticated) {
      return;
    }

    const loadDiagram = async () => {
      try {
        const data = await diagramService.getDiagram(params.id);
        if (!data) {
          showError(t.editDiagram.diagramNotFound);
          router.push('/dashboard');
          return;
        }
        if (data.createdBy !== user?.id) {
          showError(t.editDiagram.noPermission);
          router.push('/dashboard');
          return;
        }
        setDiagram(data);
        setTitle(data.title);
        setDescription(data.description || '');
        setContent(data.content);
        // If diagram has evaluation, show it
        if (data.evaluation) {
          setShowEvaluation(true);
        }
      } catch (error: any) {
        showError(error.message || t.editDiagram.loadFailed);
        router.push('/dashboard');
      } finally {
        setIsLoading(false);
      }
    };

    if (user?.id) {
      loadDiagram();
    }
  }, [isAuthenticated, user?.id, params.id, router]);

  const handleSave = async () => {
    if (!title.trim()) {
      showError(t.editDiagram.enterTitle);
      return;
    }

    if (!diagram) {
      showError(t.editDiagram.diagramNotFound);
      return;
    }

    setIsSaving(true);
    try {
      const updatedDiagram: Diagram = {
        ...diagram,
        title,
        description,
        content,
        updatedAt: new Date().toISOString(),
      };
      await updateDiagram(updatedDiagram);
      showSuccess(t.editDiagram.savedSuccess);
      router.push(`/diagram/${diagram.id}`);
    } catch (error: any) {
      showError(error.message || t.editDiagram.saveFailed);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSubmitForReEvaluation = async () => {
    if (!diagram) {
      showError(t.editDiagram.diagramNotFound);
      return;
    }

    try {
      const evaluationRequest: EvaluationRequest = {
        topic: diagram.topic,
        diagramType: diagram.type,
        content: content,
        educationLevel: 'high',
      };

      const result = await evaluate(evaluationRequest);
      showSuccess(t.editDiagram.reEvaluateSuccess);

      // Update evaluation in database
      try {
        await diagramService.updateDiagram(diagram.id, {
          evaluation: result,
          evaluatedAt: new Date().toISOString(),
        });
      } catch (dbError) {
        console.warn('Failed to save evaluation to database:', dbError);
      }

      setShowEvaluation(true);
    } catch (error: any) {
      showError(error.message || t.editDiagram.reEvaluateFailed);
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
      <Layout title={t.editDiagram.diagramNotFound}>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 bg-pastel-pink/40 rounded-full flex items-center justify-center mb-4 text-2xl">!</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2">{t.editDiagram.diagramNotFound}</h2>
          <Button onClick={() => router.push('/dashboard')} variant="primary" className="mt-4">
            ← {t.navbar.dashboard}
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout title={t.editDiagram.pageTitle.replace('{title}', title)}>
      <div className="space-y-6">
        <Alert type="info">
          {t.editDiagram.editInfo}
        </Alert>

        {/* Edit Form */}
        <Card>
          <h2 className="text-2xl font-bold mb-4">{t.editDiagram.editDetails}</h2>
          <div className="space-y-4">
            <Input
              label={t.editDiagram.diagramTitle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t.editDiagram.titlePlaceholder}
            />

            <Input
              label={t.editDiagram.description}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t.editDiagram.descriptionPlaceholder}
            />
          </div>
        </Card>

        {/* Edit Diagram Content */}
        <Card>
          <h2 className="text-xl font-bold mb-4">{t.editDiagram.editContent}</h2>
          <div id="diagram-container" className="w-full bg-pastel-blue/20 p-4 rounded-xl">
            <DiagramRenderer
              type={diagram.type}
              content={content}
              isEditable={true}
              onContentChange={setContent}
            />
          </div>
        </Card>

        {/* Evaluation Results if exists */}
        {showEvaluation && diagram && (evaluation || diagram?.evaluation) && (
          <Card className="border-2 border-pastel-yellow bg-pastel-yellow/35">
            <h2 className="text-xl font-bold mb-4">📊 {t.editDiagram.evaluationResults}</h2>
            {(evaluation || diagram.evaluation) && (
              <EvaluationCard evaluation={evaluation || diagram.evaluation!} />
            )}
            {diagram?.evaluatedAt && (
              <p className="text-xs text-gray-500 mt-4">
                {t.editDiagram.lastEvaluated} {new Date(diagram?.evaluatedAt).toLocaleString()}
              </p>
            )}
          </Card>
        )}

        {/* Loading State for Evaluation */}
        {isEvaluating && (
          <Card className="text-center py-12">
            <Loader size="lg" text={t.editDiagram.reEvaluating} />
          </Card>
        )}

        {/* Actions */}
        <div className="flex gap-2 flex-wrap">
          <Button
            onClick={handleSave}
            isLoading={isSaving}
            size="lg"
            variant="primary"
          >
            {t.editDiagram.saveChanges}
          </Button>
          <Button
            onClick={handleSubmitForReEvaluation}
            isLoading={isEvaluating}
            size="lg"
            variant="accent"
          >
            {t.editDiagram.reSubmit}
          </Button>
          <Button
            onClick={() => router.push(`/diagram/${diagram.id}`)}
            size="lg"
            variant="outline"
          >
            {t.editDiagram.cancel}
          </Button>
          <Button
            variant="danger"
            size="lg"
            onClick={async () => {
              if (!confirm(t.editDiagram.deleteConfirm)) return;
              try {
                await deleteDiagram(diagram.id);
                showSuccess(t.editDiagram.deleteSuccess);
                router.push('/dashboard');
              } catch (err: any) {
                showError(err.message || t.editDiagram.deleteFailed);
              }
            }}
          >
            🗑️ {t.editDiagram.deleteButton}
          </Button>
        </div>
      </div>
    </Layout>
  );
}
