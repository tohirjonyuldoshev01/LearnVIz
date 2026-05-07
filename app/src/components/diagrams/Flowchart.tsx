'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Cog, HelpCircle, FileOutput, Square } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DiagramContent } from '@/types';
import {
  fadeInUp,
  staggerContainer,
  GlassPanel,
  ExpandableDetail,
  DiagramTextArea,
  DiagramText,
  ConnectingArrow,
  InteractionHint,
  SectionHint,
  GuidanceIntro,
  ShowExampleButton,
} from './shared';
import { getGuidance } from '@/lib/diagramGuidance';

interface FlowchartProps {
  content: DiagramContent;
  isEditable?: boolean;
  onContentChange?: (content: DiagramContent) => void;
}

const STEP_CONFIG = [
  {
    key: 'start',
    icon: Play,
    gradient: 'from-emerald-400 to-green-500',
    bg: 'bg-emerald-50/60 dark:bg-emerald-950/20',
    border: 'border-emerald-200/60 dark:border-emerald-800/40',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    shape: 'rounded-full',
  },
  {
    key: 'process',
    icon: Cog,
    gradient: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-50/60 dark:bg-blue-950/20',
    border: 'border-blue-200/60 dark:border-blue-800/40',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    iconColor: 'text-blue-600 dark:text-blue-400',
    shape: 'rounded-xl',
  },
  {
    key: 'decision',
    icon: HelpCircle,
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50/60 dark:bg-amber-950/20',
    border: 'border-amber-200/60 dark:border-amber-800/40',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
    shape: 'rounded-xl rotate-0', // Diamond visual handled in CSS
  },
  {
    key: 'output',
    icon: FileOutput,
    gradient: 'from-violet-400 to-purple-500',
    bg: 'bg-violet-50/60 dark:bg-violet-950/20',
    border: 'border-violet-200/60 dark:border-violet-800/40',
    iconBg: 'bg-violet-100 dark:bg-violet-900/40',
    iconColor: 'text-violet-600 dark:text-violet-400',
    shape: 'rounded-xl',
  },
  {
    key: 'end',
    icon: Square,
    gradient: 'from-rose-400 to-red-500',
    bg: 'bg-rose-50/60 dark:bg-rose-950/20',
    border: 'border-rose-200/60 dark:border-rose-800/40',
    iconBg: 'bg-rose-100 dark:bg-rose-900/40',
    iconColor: 'text-rose-600 dark:text-rose-400',
    shape: 'rounded-full',
  },
];

export const Flowchart: React.FC<FlowchartProps> = ({
  content,
  isEditable = false,
  onContentChange,
}) => {
  const { t, language } = useLanguage();
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const guidance = getGuidance('flowchart', language as 'en' | 'uz');

  const labels: Record<string, string> = {
    start: t.createDiagram.editor.flowchart.start,
    process: t.createDiagram.editor.flowchart.process,
    decision: t.createDiagram.editor.flowchart.decision,
    output: t.createDiagram.editor.flowchart.output,
    end: t.createDiagram.editor.flowchart.end,
  };

  const handleChange = (section: string, value: string) => {
    onContentChange?.({ ...content, [section]: value });
  };

  return (
    <div className="p-4 sm:p-6">
      {!isEditable && <InteractionHint />}

      {isEditable && (
        <div className="max-w-2xl mx-auto">
          <GuidanceIntro intro={guidance.intro} steps={guidance.steps} />
          <div className="flex justify-end mb-3">
            <ShowExampleButton
              label={language === 'uz' ? 'Namuna ko\'rish' : 'Show Example'}
              clearLabel={language === 'uz' ? "Namunani o'chirish" : 'Clear Example'}
              onFill={() => onContentChange?.(guidance.exampleContent)}
              onClear={() => onContentChange?.({ start: '', process: [], decision: '', output: '', end: '' })}
            />
          </div>
        </div>
      )}

      {/* Progress bar */}
      <div className="flex items-center justify-center gap-1.5 mb-6 max-w-md mx-auto">
        {STEP_CONFIG.map((cfg, i) => (
          <React.Fragment key={cfg.key}>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              onClick={() => !isEditable && setActiveStep(activeStep === cfg.key ? null : cfg.key)}
              className={`
                w-8 h-8 rounded-full flex items-center justify-center cursor-pointer
                transition-all duration-300 border-2
                ${activeStep === cfg.key
                  ? `bg-gradient-to-br ${cfg.gradient} border-white/50 shadow-md text-white`
                  : (content[cfg.key] as string)
                    ? `${cfg.iconBg} ${cfg.border} ${cfg.iconColor}`
                    : 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-400'
                }
              `}
            >
              <cfg.icon className="w-3.5 h-3.5" />
            </motion.div>
            {i < STEP_CONFIG.length - 1 && (
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: i * 0.1 + 0.05 }}
                className={`h-0.5 flex-1 rounded-full origin-left ${
                  (content[STEP_CONFIG[i + 1].key] as string) ? `bg-gradient-to-r ${cfg.gradient} opacity-50` : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Steps */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-1 max-w-2xl mx-auto"
      >
        {STEP_CONFIG.map((cfg, i) => {
          const Icon = cfg.icon;
          const isActive = activeStep === cfg.key;
          const text = (content[cfg.key] as string) || '';

          return (
            <motion.div key={cfg.key} variants={fadeInUp} custom={i}>
              <GlassPanel
                onClick={isEditable ? undefined : () => setActiveStep(isActive ? null : cfg.key)}
                isActive={isActive}
                className={`${cfg.bg} ${cfg.border}`}
              >
                <div className="flex items-center gap-3">
                  {/* Step number & icon */}
                  <div className={`
                    w-10 h-10 ${cfg.shape} flex-shrink-0
                    flex items-center justify-center
                    bg-gradient-to-br ${cfg.gradient}
                    shadow-sm text-white
                  `}>
                    <Icon className="w-4.5 h-4.5" strokeWidth={2} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">{labels[cfg.key]}</h4>
                    {!isEditable && !isActive && text && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{text}</p>
                    )}
                  </div>

                  {/* Step indicator */}
                  <span className="text-[10px] font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider">
                    {i + 1}/{STEP_CONFIG.length}
                  </span>
                </div>

                {/* Expanded content */}
                {isEditable ? (
                  <div className="mt-3">
                    {guidance.sections[cfg.key] && (
                      <SectionHint hint={guidance.sections[cfg.key].hint} />
                    )}
                    <DiagramTextArea
                      value={text}
                      onChange={(val) => handleChange(cfg.key, val)}
                      placeholder={guidance.sections[cfg.key]?.placeholder || t.createDiagram.editor.flowchart.describe.replace('{label}', labels[cfg.key].toLowerCase())}
                      minHeight="60px"
                    />
                  </div>
                ) : (
                  <ExpandableDetail isOpen={isActive}>
                    <div className={`h-0.5 rounded-full bg-gradient-to-r ${cfg.gradient} opacity-30 mb-3`} />
                    <DiagramText text={text} />
                  </ExpandableDetail>
                )}
              </GlassPanel>

              {/* Arrow connector */}
              {i < STEP_CONFIG.length - 1 && (
                <div className="flex justify-center py-0.5">
                  <ConnectingArrow />
                </div>
              )}
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
