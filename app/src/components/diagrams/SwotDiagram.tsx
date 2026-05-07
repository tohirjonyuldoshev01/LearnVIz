'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, AlertTriangle, Lightbulb, Target, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DiagramContent } from '@/types';
import {
  fadeInUp,
  staggerContainer,
  GlassPanel,
  ExpandableDetail,
  DiagramTextArea,
  DiagramText,
  InteractionHint,
  SectionHint,
  GuidanceIntro,
  ShowExampleButton,
} from './shared';
import { getGuidance } from '@/lib/diagramGuidance';

interface SwotDiagramProps {
  content: DiagramContent;
  isEditable?: boolean;
  onContentChange?: (content: DiagramContent) => void;
}

const SWOT_CONFIG = [
  {
    key: 'strengths',
    icon: Shield,
    gradient: 'from-emerald-400 to-teal-500',
    bg: 'bg-emerald-50/60 dark:bg-emerald-950/20',
    border: 'border-emerald-200/60 dark:border-emerald-800/40',
    iconBg: 'bg-emerald-100 dark:bg-emerald-900/40',
    iconColor: 'text-emerald-600 dark:text-emerald-400',
    hoverBorder: 'hover:border-emerald-300 dark:hover:border-emerald-700',
  },
  {
    key: 'weaknesses',
    icon: AlertTriangle,
    gradient: 'from-rose-400 to-pink-500',
    bg: 'bg-rose-50/60 dark:bg-rose-950/20',
    border: 'border-rose-200/60 dark:border-rose-800/40',
    iconBg: 'bg-rose-100 dark:bg-rose-900/40',
    iconColor: 'text-rose-600 dark:text-rose-400',
    hoverBorder: 'hover:border-rose-300 dark:hover:border-rose-700',
  },
  {
    key: 'opportunities',
    icon: Lightbulb,
    gradient: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-50/60 dark:bg-blue-950/20',
    border: 'border-blue-200/60 dark:border-blue-800/40',
    iconBg: 'bg-blue-100 dark:bg-blue-900/40',
    iconColor: 'text-blue-600 dark:text-blue-400',
    hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-700',
  },
  {
    key: 'threats',
    icon: Target,
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50/60 dark:bg-amber-950/20',
    border: 'border-amber-200/60 dark:border-amber-800/40',
    iconBg: 'bg-amber-100 dark:bg-amber-900/40',
    iconColor: 'text-amber-600 dark:text-amber-400',
    hoverBorder: 'hover:border-amber-300 dark:hover:border-amber-700',
  },
];

export const SwotDiagram: React.FC<SwotDiagramProps> = ({
  content,
  isEditable = false,
  onContentChange,
}) => {
  const { t, language } = useLanguage();
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const guidance = getGuidance('swot', language as 'en' | 'uz');

  const labels: Record<string, string> = {
    strengths: t.createDiagram.editor.swot.strengths,
    weaknesses: t.createDiagram.editor.swot.weaknesses,
    opportunities: t.createDiagram.editor.swot.opportunities,
    threats: t.createDiagram.editor.swot.threats,
  };

  const handleChange = (section: string, value: string) => {
    onContentChange?.({ ...content, [section]: value });
  };

  const toggle = (key: string) => {
    if (!isEditable) setExpandedKey(expandedKey === key ? null : key);
  };

  return (
    <div className="p-4 sm:p-6">
      {!isEditable && <InteractionHint />}

      {isEditable && (
        <div className="max-w-3xl mx-auto">
          <GuidanceIntro intro={guidance.intro} steps={guidance.steps} />
          <div className="flex justify-end mb-3">
            <ShowExampleButton
              label={language === 'uz' ? 'Namuna ko\'rish' : 'Show Example'}
              clearLabel={language === 'uz' ? "Namunani o'chirish" : 'Clear Example'}
              onFill={() => onContentChange?.(guidance.exampleContent)}
              onClear={() => onContentChange?.({ strengths: '', weaknesses: '', opportunities: '', threats: '' })}
            />
          </div>
        </div>
      )}

      {/* Center label */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center mb-5"
      >
        <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-pastel-purple/20 text-pastel-purple dark:bg-pastel-purple/10 dark:text-pastel-purple/80 tracking-wide uppercase">
          SWOT
        </span>
      </motion.div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-3xl mx-auto"
      >
        {SWOT_CONFIG.map((cfg, i) => {
          const Icon = cfg.icon;
          const isOpen = expandedKey === cfg.key;
          const rawVal = content[cfg.key];
          const text = typeof rawVal === 'string' ? rawVal : Array.isArray(rawVal) ? rawVal.join('\n') : '';
          const lines = text.split('\n').filter(Boolean);

          return (
            <motion.div key={cfg.key} variants={fadeInUp} custom={i}>
              <GlassPanel
                onClick={isEditable ? undefined : () => toggle(cfg.key)}
                isActive={isOpen}
                className={`${cfg.bg} ${cfg.border} ${!isEditable ? cfg.hoverBorder : ''} min-h-[140px]`}
              >
                {/* Header */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-9 h-9 rounded-xl ${cfg.iconBg} flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`w-4.5 h-4.5 ${cfg.iconColor}`} strokeWidth={2} />
                  </div>
                  <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100 flex-1">
                    {labels[cfg.key]}
                  </h3>
                  {!isEditable && text && (
                    <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-4 h-4 text-gray-400" />
                    </motion.div>
                  )}
                </div>

                {/* Gradient bar */}
                <div className={`h-0.5 rounded-full bg-gradient-to-r ${cfg.gradient} opacity-40 mb-3`} />

                {isEditable ? (
                  <>
                    {guidance.sections[cfg.key] && (
                      <SectionHint hint={guidance.sections[cfg.key].hint} />
                    )}
                    <DiagramTextArea
                      value={text}
                      onChange={(val) => handleChange(cfg.key, val)}
                      placeholder={guidance.sections[cfg.key]?.placeholder || t.createDiagram.editor.swot.enter.replace('{label}', labels[cfg.key].toLowerCase())}
                      minHeight="90px"
                    />
                  </>
                ) : (
                  <>
                    {/* Preview: show first 2 lines */}
                    <div className="space-y-1">
                      {(lines.length > 0 ? lines.slice(0, 2) : ['']).map((line, li) => (
                        <div key={li} className="flex items-start gap-2">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${cfg.gradient} mt-1.5 flex-shrink-0`} />
                          <DiagramText text={line} className="text-xs" />
                        </div>
                      ))}
                      {lines.length > 2 && !isOpen && (
                        <span className="text-[10px] text-gray-400 ml-3.5">+{lines.length - 2} more...</span>
                      )}
                    </div>

                    {/* Expanded detail */}
                    <ExpandableDetail isOpen={isOpen}>
                      <div className="space-y-1 pt-1 border-t border-white/30 dark:border-gray-700/30">
                        {lines.slice(2).map((line, li) => (
                          <div key={li} className="flex items-start gap-2">
                            <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-br ${cfg.gradient} mt-1.5 flex-shrink-0`} />
                            <DiagramText text={line} className="text-xs" />
                          </div>
                        ))}
                      </div>
                    </ExpandableDetail>
                  </>
                )}
              </GlassPanel>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
