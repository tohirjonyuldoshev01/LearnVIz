'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
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

interface TChartProps {
  content: DiagramContent;
  isEditable?: boolean;
  onContentChange?: (content: DiagramContent) => void;
}

const SIDES = [
  {
    key: 'left',
    gradient: 'from-sky-400 to-blue-500',
    text: 'text-sky-700 dark:text-sky-300',
    ring: 'ring-sky-300/50',
  },
  {
    key: 'right',
    gradient: 'from-amber-400 to-orange-500',
    text: 'text-amber-700 dark:text-amber-300',
    ring: 'ring-amber-300/50',
  },
];

export const TChart: React.FC<TChartProps> = ({
  content,
  isEditable = false,
  onContentChange,
}) => {
  const { t, language } = useLanguage();
  const [activeSide, setActiveSide] = useState<string | null>(null);
  const guidance = getGuidance('tchart', language as 'en' | 'uz');

  const labels: Record<string, string> = {
    left: t.createDiagram.editor.tChart.left,
    right: t.createDiagram.editor.tChart.right,
  };

  const placeholders: Record<string, string> = {
    left: t.createDiagram.editor.tChart.leftPlaceholder,
    right: t.createDiagram.editor.tChart.rightPlaceholder,
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
              onClear={() => onContentChange?.({ left: '', right: '' })}
            />
          </div>
        </div>
      )}

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto"
      >
        {/* T-Shape header bar */}
        <motion.div variants={fadeInUp} className="mb-4">
          <div className="h-1 rounded-full bg-gradient-to-r from-sky-400 via-pastel-purple to-amber-400 opacity-50" />
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Vertical divider between columns on md+ */}
          {SIDES.map((side) => {
            const isActive = activeSide === side.key;
            const text = (content[side.key] as string) || '';

            return (
              <motion.div key={side.key} variants={fadeInUp}>
                <GlassPanel
                  className={`p-5 cursor-pointer transition-all duration-300 h-full ${
                    isActive ? `ring-2 ${side.ring} shadow-md` : ''
                  }`}
                  onClick={() => !isEditable && setActiveSide(isActive ? null : side.key)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-8 rounded-full bg-gradient-to-b ${side.gradient}`} />
                      <h3 className={`font-bold text-sm ${side.text}`}>{labels[side.key]}</h3>
                    </div>
                    {!isEditable && text && (
                      <motion.div animate={{ rotate: isActive ? 180 : 0 }} transition={{ duration: 0.2 }}>
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      </motion.div>
                    )}
                  </div>

                  {isEditable ? (
                    <>
                      {guidance.sections[side.key] && (
                        <SectionHint hint={guidance.sections[side.key].hint} />
                      )}
                      <DiagramTextArea
                        value={text}
                        onChange={(val) => handleChange(side.key, val)}
                        placeholder={guidance.sections[side.key]?.placeholder || placeholders[side.key]}
                        minHeight="160px"
                      />
                    </>
                  ) : (
                    <>
                      {!isActive && text && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-4">{text}</p>
                      )}
                      <ExpandableDetail isOpen={isActive}>
                        <DiagramText text={text} className="text-sm" />
                      </ExpandableDetail>
                    </>
                  )}
                </GlassPanel>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
