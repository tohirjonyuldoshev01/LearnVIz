'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DiagramContent } from '@/types';
import {
  fadeInUp,
  staggerContainer,
  ExpandableDetail,
  DiagramTextArea,
  DiagramText,
  InteractionHint,
  SectionHint,
  GuidanceIntro,
  ShowExampleButton,
} from './shared';
import { getGuidance } from '@/lib/diagramGuidance';

interface PyramidDiagramProps {
  content: DiagramContent;
  isEditable?: boolean;
  onContentChange?: (content: DiagramContent) => void;
}

const LEVEL_CONFIG = [
  {
    key: 'top',
    widthClass: 'w-[30%] sm:w-[25%]',
    gradient: 'from-amber-400 to-orange-500',
    bg: 'bg-amber-50/70 dark:bg-amber-950/30',
    border: 'border-amber-300/60 dark:border-amber-700/40',
    textColor: 'text-amber-700 dark:text-amber-300',
  },
  {
    key: 'upperMiddle',
    widthClass: 'w-[48%] sm:w-[42%]',
    gradient: 'from-orange-400 to-red-400',
    bg: 'bg-orange-50/60 dark:bg-orange-950/25',
    border: 'border-orange-300/60 dark:border-orange-700/40',
    textColor: 'text-orange-700 dark:text-orange-300',
  },
  {
    key: 'middle',
    widthClass: 'w-[64%] sm:w-[58%]',
    gradient: 'from-rose-400 to-pink-500',
    bg: 'bg-rose-50/60 dark:bg-rose-950/25',
    border: 'border-rose-300/60 dark:border-rose-700/40',
    textColor: 'text-rose-700 dark:text-rose-300',
  },
  {
    key: 'lowerMiddle',
    widthClass: 'w-[80%] sm:w-[74%]',
    gradient: 'from-violet-400 to-purple-500',
    bg: 'bg-violet-50/60 dark:bg-violet-950/25',
    border: 'border-violet-300/60 dark:border-violet-700/40',
    textColor: 'text-violet-700 dark:text-violet-300',
  },
  {
    key: 'base',
    widthClass: 'w-[96%] sm:w-[90%]',
    gradient: 'from-blue-400 to-indigo-500',
    bg: 'bg-blue-50/60 dark:bg-blue-950/25',
    border: 'border-blue-300/60 dark:border-blue-700/40',
    textColor: 'text-blue-700 dark:text-blue-300',
  },
];

export const PyramidDiagram: React.FC<PyramidDiagramProps> = ({
  content,
  isEditable = false,
  onContentChange,
}) => {
  const { t, language } = useLanguage();
  const [activeLevel, setActiveLevel] = useState<string | null>(null);
  const [hoveredLevel, setHoveredLevel] = useState<string | null>(null);
  const guidance = getGuidance('pyramid', language as 'en' | 'uz');

  const labels: Record<string, string> = {
    top: t.createDiagram.editor.pyramid.top,
    upperMiddle: t.createDiagram.editor.pyramid.upperMiddle,
    middle: t.createDiagram.editor.pyramid.middle,
    lowerMiddle: t.createDiagram.editor.pyramid.lowerMiddle,
    base: t.createDiagram.editor.pyramid.base,
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
              onClear={() => onContentChange?.({ top: '', upperMiddle: '', middle: '', lowerMiddle: '', base: '' })}
            />
          </div>
        </div>
      )}

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex flex-col items-center gap-1.5 max-w-3xl mx-auto"
      >
        {LEVEL_CONFIG.map((cfg, i) => {
          const isActive = activeLevel === cfg.key;
          const isHovered = hoveredLevel === cfg.key;
          const text = (content[cfg.key] as string) || '';

          return (
            <motion.div
              key={cfg.key}
              variants={fadeInUp}
              custom={i}
              className={`${cfg.widthClass} transition-all duration-300`}
              onMouseEnter={() => setHoveredLevel(cfg.key)}
              onMouseLeave={() => setHoveredLevel(null)}
            >
              <motion.div
                onClick={() => !isEditable && setActiveLevel(isActive ? null : cfg.key)}
                whileHover={!isEditable ? { scale: 1.02 } : undefined}
                whileTap={!isEditable ? { scale: 0.98 } : undefined}
                className={`
                  relative rounded-2xl p-4 cursor-pointer
                  border backdrop-blur-sm
                  transition-all duration-300
                  ${cfg.bg} ${cfg.border}
                  ${isActive || isHovered ? 'shadow-md' : 'shadow-sm'}
                  ${isActive ? 'ring-2 ring-pastel-purple/30' : ''}
                `}
              >
                {/* Gradient top bar */}
                <div className={`absolute top-0 left-4 right-4 h-0.5 rounded-full bg-gradient-to-r ${cfg.gradient} opacity-50`} />

                <div className="flex items-center gap-2">
                  {/* Level indicator */}
                  <div className={`
                    w-6 h-6 rounded-lg bg-gradient-to-br ${cfg.gradient}
                    flex items-center justify-center flex-shrink-0 shadow-sm
                  `}>
                    <span className="text-[10px] font-bold text-white">{i + 1}</span>
                  </div>

                  <h4 className={`font-bold text-xs ${cfg.textColor} flex-1`}>{labels[cfg.key]}</h4>

                  {!isEditable && text && (
                    <motion.div animate={{ rotate: isActive ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
                    </motion.div>
                  )}
                </div>

                {isEditable ? (
                  <div className="mt-3">
                    {guidance.sections[cfg.key] && (
                      <SectionHint hint={guidance.sections[cfg.key].hint} />
                    )}
                    <DiagramTextArea
                      value={text}
                      onChange={(val) => handleChange(cfg.key, val)}
                      placeholder={guidance.sections[cfg.key]?.placeholder || t.createDiagram.editor.pyramid.enter.replace('{label}', labels[cfg.key].toLowerCase())}
                      minHeight="50px"
                    />
                  </div>
                ) : (
                  <>
                    {!isActive && text && (
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate mt-1 ml-8">{text}</p>
                    )}
                    <ExpandableDetail isOpen={isActive}>
                      <div className="ml-8">
                        <DiagramText text={text} className="text-xs" />
                      </div>
                    </ExpandableDetail>
                  </>
                )}
              </motion.div>
            </motion.div>
          );
        })}
      </motion.div>
    </div>
  );
};
