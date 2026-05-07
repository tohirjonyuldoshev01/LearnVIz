'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, Rewind, FastForward } from 'lucide-react';
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

interface TimelineProps {
  content: DiagramContent;
  isEditable?: boolean;
  onContentChange?: (content: DiagramContent) => void;
}

const PERIOD_CONFIG = [
  {
    key: 'past',
    icon: Rewind,
    gradient: 'from-rose-400 to-pink-500',
    bg: 'bg-rose-50/60 dark:bg-rose-950/20',
    border: 'border-rose-200/60 dark:border-rose-800/40',
    dot: 'bg-rose-400',
    line: 'bg-gradient-to-r from-rose-300 to-amber-300 dark:from-rose-700 dark:to-amber-700',
  },
  {
    key: 'present',
    icon: Clock,
    gradient: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-50/60 dark:bg-blue-950/20',
    border: 'border-blue-200/60 dark:border-blue-800/40',
    dot: 'bg-blue-500',
    line: 'bg-gradient-to-r from-blue-300 to-violet-300 dark:from-blue-700 dark:to-violet-700',
  },
  {
    key: 'future',
    icon: FastForward,
    gradient: 'from-amber-400 to-yellow-500',
    bg: 'bg-amber-50/60 dark:bg-amber-950/20',
    border: 'border-amber-200/60 dark:border-amber-800/40',
    dot: 'bg-amber-400',
    line: '',
  },
];

export const Timeline: React.FC<TimelineProps> = ({
  content,
  isEditable = false,
  onContentChange,
}) => {
  const { t, language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const guidance = getGuidance('timeline', language as 'en' | 'uz');

  const labels: Record<string, string> = {
    past: t.createDiagram.editor.timeline.past,
    present: t.createDiagram.editor.timeline.present,
    future: t.createDiagram.editor.timeline.future,
  };

  const handleChange = (section: string, value: string) => {
    onContentChange?.({ ...content, [section]: value });
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
              onClear={() => onContentChange?.({ past: [], present: '', future: [] })}
            />
          </div>
        </div>
      )}

      {/* Visual timeline bar */}
      <div className="relative max-w-2xl mx-auto mb-6">
        <div className="flex items-center">
          {PERIOD_CONFIG.map((cfg, i) => (
            <React.Fragment key={cfg.key}>
              {/* Dot */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: i * 0.15, type: 'spring', stiffness: 300 }}
                onClick={() => !isEditable && setActiveIndex(activeIndex === i ? null : i)}
                className={`relative z-10 cursor-pointer group`}
              >
                <div className={`
                  w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center
                  transition-all duration-300 border-2
                  ${activeIndex === i
                    ? `bg-gradient-to-br ${cfg.gradient} border-white/50 shadow-lg text-white scale-110`
                    : `bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm ${cfg.border} group-hover:scale-105`
                  }
                `}>
                  <cfg.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${activeIndex === i ? 'text-white' : cfg.dot.replace('bg-', 'text-')}`} />
                </div>
                <span className={`
                  absolute -bottom-6 left-1/2 -translate-x-1/2 whitespace-nowrap
                  text-[10px] font-semibold tracking-wide uppercase
                  ${activeIndex === i ? 'text-gray-800 dark:text-gray-200' : 'text-gray-400 dark:text-gray-500'}
                `}>
                  {labels[cfg.key]}
                </span>
              </motion.div>

              {/* Connecting line */}
              {i < PERIOD_CONFIG.length - 1 && (
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: i * 0.15 + 0.1, duration: 0.5 }}
                  className={`h-1 flex-1 rounded-full origin-left ${cfg.line} opacity-40`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Spacer for labels */}
      <div className="h-4" />

      {/* Period cards */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-3xl mx-auto"
      >
        {PERIOD_CONFIG.map((cfg, i) => {
          const Icon = cfg.icon;
          const text = (content[cfg.key] as string) || '';
          const isActive = activeIndex === i;

          return (
            <motion.div key={cfg.key} variants={fadeInUp} custom={i}>
              <GlassPanel
                onClick={isEditable ? undefined : () => setActiveIndex(isActive ? null : i)}
                isActive={isActive}
                className={`${cfg.bg} ${cfg.border}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${cfg.gradient} flex items-center justify-center shadow-sm`}>
                    <Icon className="w-3.5 h-3.5 text-white" />
                  </div>
                  <h4 className="font-bold text-sm text-gray-800 dark:text-gray-100">{labels[cfg.key]}</h4>
                </div>
                <div className={`h-0.5 rounded-full bg-gradient-to-r ${cfg.gradient} opacity-30 mb-3`} />

                {isEditable ? (
                  <>
                    {guidance.sections[cfg.key] && (
                      <SectionHint hint={guidance.sections[cfg.key].hint} />
                    )}
                    <DiagramTextArea
                      value={text}
                      onChange={(val) => handleChange(cfg.key, val)}
                      placeholder={guidance.sections[cfg.key]?.placeholder || t.createDiagram.editor.timeline.describe.replace('{label}', labels[cfg.key].toLowerCase())}
                      minHeight="100px"
                    />
                  </>
                ) : (
                  <>
                    {!isActive && text && (
                      <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{text}</p>
                    )}
                    {!isActive && !text && <DiagramText text="" />}
                    <ExpandableDetail isOpen={isActive}>
                      <DiagramText text={text} />
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
