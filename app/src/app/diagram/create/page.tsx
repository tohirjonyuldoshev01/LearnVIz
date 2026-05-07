'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { motion } from 'framer-motion';
import { ChevronRight, ChevronLeft, Check } from 'lucide-react';
import { Layout } from '@/components/layout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Grid } from '@/components/ui/Grid';
import Card from '@/components/ui/Card';
import { Loader } from '@/components/ui/Loader';
import { Alert } from '@/components/ui/Alert';
import { StepIndicator } from '@/components/ui/StepIndicator';
import { AnimatedCard } from '@/components/ui/AnimatedCard';
import { useAuth } from '@/hooks/useAuth';
import { useDiagrams } from '@/hooks/useDiagrams';
import { useLanguage } from '@/context/LanguageContext';
import { DIAGRAM_TEMPLATES } from '@/lib/constants';
import { DiagramRenderer, DiagramCard } from '@/components/diagrams';
import { Diagram, DiagramType, DiagramContent } from '@/types';
import { showSuccess, showError } from '@/utils/toast';

export default function CreateDiagramPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { createDiagram } = useDiagrams(user?.id || '');
  const { t, language } = useLanguage();

  const [selectedDiagram, setSelectedDiagram] = useState<DiagramType | null>(null);
  const [topic, setTopic] = useState('');
  const [diagramTitle, setDiagramTitle] = useState('');
  const [content, setContent] = useState<DiagramContent>({});
  const [isSaving, setIsSaving] = useState(false);
  const [step, setStep] = useState<'select' | 'input' | 'edit' | 'complete'>('select');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [authLoading, isAuthenticated, router]);

  // Initialize empty content based on diagram type
  const initializeContent = (diagramType: DiagramType) => {
    const templates: Record<DiagramType, DiagramContent> = {
      swot: { strengths: '', weaknesses: '', opportunities: '', threats: '' },
      fishbone: {
        problem: '',
        people: '',
        process: '',
        materials: '',
        environment: '',
        methods: '',
      },
      venn: {
        __vennSetCount: '2',
        setA: '',
        common: '',
        setB: '',
        region_A: '',
        region_A_B: '',
        region_B: '',
      },
      mindmap: { centralIdea: '', mainBranches: '', subBranches: '' },
      flowchart: { start: '', process: [], decision: '', output: '', end: '' },
      timeline: { past: [], present: '', future: [] },
      pyramid: { top: '', upperMiddle: '', middle: '', lowerMiddle: '', base: '' },
      causeeffect: { causes: [], effects: [], correlation: '' },
      conceptmap: { concept1: '', relationship: '', concept2: '', details: '' },
      tchart: { left: '', right: '' },
    };
    return templates[diagramType] || {};
  };

  const handleDiagramSelect = (diagramType: DiagramType) => {
    setSelectedDiagram(diagramType);
    setContent(initializeContent(diagramType));
  };

  const handleProceedToEditor = () => {
    if (!diagramTitle.trim()) {
      showError(t.createDiagram.errors.enterTitle);
      return;
    }
    if (!topic.trim()) {
      showError(t.createDiagram.errors.enterTopic);
      return;
    }
    setStep('edit');
  };

  const handleSaveDiagram = async () => {
    if (!selectedDiagram || !user) {
      showError(t.createDiagram.errors.missingInfo);
      return;
    }

    setIsSaving(true);
    try {
      const diagram: Diagram = {
        id: uuidv4(),
        title: diagramTitle,
        type: selectedDiagram,
        topic,
        content,
        createdBy: user.id,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isPublic: false,
      };

      await createDiagram(diagram);
      showSuccess(t.createDiagram.toasts.saved);
      router.push('/dashboard');
    } catch (error: any) {
      showError(error.message || t.createDiagram.errors.saveFailed);
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return (
      <Layout title={t.createDiagram.loadingTitle}>
        <div className="flex justify-center items-center py-20">
          <Loader size="lg" text={t.createDiagram.checkingAuth} />
        </div>
      </Layout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const templates = Object.values(DIAGRAM_TEMPLATES);
  const stepMappings = [
    t.createDiagram.steps.type,
    t.createDiagram.steps.details,
    t.createDiagram.steps.build,
    t.createDiagram.steps.done,
  ];
  const getDiagramText = (diagramType: DiagramType) => t.createDiagram.diagramTypes[diagramType];

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.4 },
    },
    exit: {
      opacity: 0,
      x: -20,
      transition: { duration: 0.3 },
    },
  };

  return (
    <Layout title={t.createDiagram.pageTitle}>
      <div className="space-y-8">
        {/* Step Indicator */}
        <StepIndicator
          currentStep={
            step === 'select'
              ? 1
              : step === 'input'
              ? 2
              : step === 'edit'
              ? 3
              : 4
          }
          totalSteps={4}
          stepLabels={stepMappings}
        />

        {/* Step 1: Select Diagram Type */}
        {step === 'select' && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                {t.createDiagram.select.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t.createDiagram.select.description}
              </p>
            </div>

            <Grid columns={4} gap="md">
              {templates.map((template, index) => {
                const diagramText = getDiagramText(template.type);

                return (
                  <DiagramCard
                    key={template.id}
                    type={template.type}
                    name={diagramText.name}
                    description={diagramText.description}
                    icon={template.icon}
                    isSelected={selectedDiagram === template.type}
                    onClick={() => handleDiagramSelect(template.type)}
                    index={index}
                  />
                );
              })}
            </Grid>

            <div className="flex justify-end pt-6">
              <Button
                onClick={() => {
                  if (selectedDiagram) {
                    setStep('input');
                  }
                }}
                disabled={!selectedDiagram}
                variant="primary"
                size="lg"
                animated
              >
                {t.createDiagram.select.continue}
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Enter Topic & Title */}
        {step === 'input' && selectedDiagram && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                {t.createDiagram.input.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t.createDiagram.input.description}
              </p>
            </div>

            <AnimatedCard variant="highlight">
              <div className="space-y-6">
                <Input
                  label={t.createDiagram.input.diagramTitleLabel}
                  placeholder={t.createDiagram.input.diagramTitlePlaceholder}
                  value={diagramTitle}
                  onChange={(e) => setDiagramTitle(e.target.value)}
                  helpText={t.createDiagram.input.diagramTitleHelp}
                />

                <Input
                  label={t.createDiagram.input.topicLabel}
                  placeholder={t.createDiagram.input.topicPlaceholder}
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  helpText={t.createDiagram.input.topicHelp.replace(
                    '{diagramName}',
                    getDiagramText(selectedDiagram).name
                  )}
                />

                <Alert type="info">
                  ✏️ {t.createDiagram.input.nextStepInfo}
                </Alert>
              </div>
            </AnimatedCard>

            <div className="flex flex-col sm:flex-row gap-3 justify-between">
              <Button
                onClick={() => {
                  setStep('select');
                  setSelectedDiagram(null);
                  setContent({});
                }}
                variant="outline"
                size="lg"
                animated
              >
                <ChevronLeft className="w-5 h-5" />
                {t.createDiagram.input.back}
              </Button>
              <Button
                onClick={handleProceedToEditor}
                variant="primary"
                size="lg"
                animated
              >
                {t.createDiagram.input.createManually}
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Manual Editing */}
        {step === 'edit' && selectedDiagram && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="space-y-6"
          >
            <div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-50 mb-2">
                {t.createDiagram.edit.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {t.createDiagram.edit.topicLabel}: <span className="font-semibold">{topic}</span> • {t.createDiagram.edit.typeLabel}:{' '}
                <span className="font-semibold">
                  {getDiagramText(selectedDiagram).name}
                </span>
              </p>
            </div>

            <Alert type="info">
              ✏️ {t.createDiagram.edit.info}
            </Alert>

            <Alert type="info">
              💡 {language === 'uz'
                ? "Har bir bo'limga o'z fikringizni yozing. Qisqa jumlalar bilan yozing!"
                : 'Fill in each section with your own ideas. Use short sentences!'}
            </Alert>

            <div className="rounded-lg overflow-hidden shadow-lg dark:shadow-xl dark:shadow-gray-900/50">
              <div className="bg-white dark:bg-gray-800 p-8">
                <DiagramRenderer
                  type={selectedDiagram}
                  content={content}
                  isEditable={true}
                  onContentChange={setContent}
                />
              </div>
            </div>

            <div className="flex gap-3 justify-between">
              <Button
                onClick={() => setStep('input')}
                variant="outline"
                size="lg"
                animated
              >
                <ChevronLeft className="w-5 h-5" />
                {t.createDiagram.edit.back}
              </Button>
              <Button
                onClick={handleSaveDiagram}
                isLoading={isSaving}
                variant="primary"
                size="lg"
                animated
              >
                {isSaving ? t.createDiagram.edit.saving : t.createDiagram.edit.save}
                {!isSaving && <Check className="w-5 h-5" />}
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </Layout>
  );
}
