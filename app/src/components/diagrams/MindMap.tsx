'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, GitBranch, ChevronDown, Plus, X, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { DiagramContent } from '@/types';
import {
  fadeInUp,
  staggerContainer,
  GlassPanel,
  DiagramTextArea,
  DiagramText,
  InteractionHint,
  SectionHint,
  GuidanceIntro,
  ShowExampleButton,
} from './shared';
import { getGuidance } from '@/lib/diagramGuidance';

interface MindMapProps {
  content: DiagramContent;
  isEditable?: boolean;
  onContentChange?: (content: DiagramContent) => void;
}

const BRANCH_COLORS = [
  { bg: 'bg-blue-50/60 dark:bg-blue-950/20', border: 'border-blue-200/60', dot: 'bg-blue-400', subBg: 'bg-blue-50/30', subBorder: 'border-blue-100/50', accent: 'border-blue-300/50' },
  { bg: 'bg-emerald-50/60 dark:bg-emerald-950/20', border: 'border-emerald-200/60', dot: 'bg-emerald-400', subBg: 'bg-emerald-50/30', subBorder: 'border-emerald-100/50', accent: 'border-emerald-300/50' },
  { bg: 'bg-violet-50/60 dark:bg-violet-950/20', border: 'border-violet-200/60', dot: 'bg-violet-400', subBg: 'bg-violet-50/30', subBorder: 'border-violet-100/50', accent: 'border-violet-300/50' },
  { bg: 'bg-amber-50/60 dark:bg-amber-950/20', border: 'border-amber-200/60', dot: 'bg-amber-400', subBg: 'bg-amber-50/30', subBorder: 'border-amber-100/50', accent: 'border-amber-300/50' },
  { bg: 'bg-rose-50/60 dark:bg-rose-950/20', border: 'border-rose-200/60', dot: 'bg-rose-400', subBg: 'bg-rose-50/30', subBorder: 'border-rose-100/50', accent: 'border-rose-300/50' },
  { bg: 'bg-cyan-50/60 dark:bg-cyan-950/20', border: 'border-cyan-200/60', dot: 'bg-cyan-400', subBg: 'bg-cyan-50/30', subBorder: 'border-cyan-100/50', accent: 'border-cyan-300/50' },
];

const toStringValue = (val: unknown): string => {
  if (typeof val === 'string') return val;
  if (Array.isArray(val)) return val.join('\n');
  return '';
};

const toStringArray = (val: unknown): string[] => {
  if (typeof val === 'string') return val.split('\n');
  if (!Array.isArray(val)) return [];

  const rows: string[] = [];
  val.forEach((item) => {
    if (typeof item === 'string') {
      rows.push(item);
      return;
    }

    if (Array.isArray(item)) {
      item.forEach((nested) => {
        if (typeof nested === 'string') rows.push(nested);
      });
      return;
    }

    if (item && typeof item === 'object') {
      const obj = item as Record<string, unknown>;
      const label = obj.title || obj.name || obj.branch || obj.text || obj.label;
      if (typeof label === 'string') rows.push(label);
    }
  });

  return rows;
};

const getSubsKey = (branchIndex: number) => `subs_${branchIndex}`;

export const MindMap: React.FC<MindMapProps> = ({
  content,
  isEditable = false,
  onContentChange,
}) => {
  const { t, language } = useLanguage();
  const [expandedBranch, setExpandedBranch] = useState<number | null>(null);
  const guidance = getGuidance('mindmap', language as 'en' | 'uz');

  // Always track the latest content so helpers never spread stale data.
  const contentRef = useRef(content);
  contentRef.current = content;

  const centralIdea = (content.centralIdea as string) || '';
  const mainBranchesStr = useMemo(() => {
    const rawContent = content as Record<string, unknown>;
    // Keep raw editable value (including empty lines) so newly added
    // blank branches do not disappear before the user types.
    if (Object.prototype.hasOwnProperty.call(rawContent, 'mainBranches')) {
      return toStringValue(rawContent.mainBranches);
    }

    const rawBranches = rawContent.branches;

    if (typeof rawBranches === 'string') return rawBranches;

    const derived = toStringArray(rawBranches).filter(Boolean);
    if (derived.length > 0) return derived.join('\n');

    return '';
  }, [content]);
  const branchesRaw = useMemo(() => mainBranchesStr.split('\n'), [mainBranchesStr]);
  const branches = useMemo(() => branchesRaw.filter(Boolean), [branchesRaw]);

  /* ── Migrate old flat subBranches into subs_0 on first render ── */
  useEffect(() => {
    if (!onContentChange) return;
    const oldSubs = toStringValue(content.subBranches);
    if (oldSubs && !content.subs_0) {
      const next: DiagramContent = { ...content, subs_0: oldSubs };
      delete next['subBranches'];
      onContentChange(next);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const getSubBranches = (branchIndex: number): string[] => {
    const rawContent = contentRef.current as Record<string, unknown>;
    const subsKey = getSubsKey(branchIndex);

    // Preserve explicit keyed values (even empty string) during editing.
    if (Object.prototype.hasOwnProperty.call(rawContent, subsKey)) {
      return toStringValue(rawContent[subsKey]).split('\n');
    }

    // Legacy flat field: all sub-branches were stored in one bucket.
    const legacy = rawContent.subBranches;
    if (branchIndex === 0) {
      const legacyRows = toStringArray(legacy);
      if (legacyRows.length > 0) return legacyRows;
    }
    if (legacy && typeof legacy === 'object' && !Array.isArray(legacy)) {
      const byIndex = (legacy as Record<string, unknown>)[String(branchIndex)]
        ?? (legacy as Record<string, unknown>)[getSubsKey(branchIndex)];
      const rows = toStringArray(byIndex);
      if (rows.length > 0) return rows;
    }

    // Structured payload fallback: branches can be objects with child arrays.
    const rawBranches = rawContent.branches;
    if (Array.isArray(rawBranches)) {
      const branchObject = rawBranches[branchIndex] as Record<string, unknown> | undefined;
      if (branchObject && typeof branchObject === 'object') {
        const candidates = [
          branchObject.subBranches,
          branchObject.children,
          branchObject.subtopics,
          branchObject.items,
        ];

        for (const candidate of candidates) {
          const rows = toStringArray(candidate);
          if (rows.length > 0) return rows;
        }
      }
    }

    return [];
  };

  const getSubBranchesFiltered = (branchIndex: number): string[] =>
    getSubBranches(branchIndex).filter(Boolean);

  const handleChange = (section: string, value: string) => {
    onContentChange?.({ ...contentRef.current, [section]: value });
  };

  /* ── Main branch helpers ── */
  const updateBranch = (index: number, value: string) => {
    const arr = [...branchesRaw];
    arr[index] = value;
    handleChange('mainBranches', arr.join('\n'));
  };

  const addBranch = () => {
    handleChange('mainBranches', [...branchesRaw, ''].join('\n'));
  };

  const removeBranch = (index: number) => {
    const next: DiagramContent = { ...contentRef.current };
    // Remove this branch from the list
    const currentBranches = toStringValue(contentRef.current.mainBranches).split('\n');
    const newBranches = currentBranches.filter((_, i) => i !== index);
    next.mainBranches = newBranches.join('\n');
    // Shift sub-branch keys: subs_3 → subs_2, subs_4 → subs_3, etc.
    const allSubs: string[] = [];
    for (let i = 0; i < currentBranches.length; i++) {
      allSubs.push(i === index ? '' : toStringValue(contentRef.current[getSubsKey(i)]));
      delete next[getSubsKey(i)];
    }
    allSubs.splice(index, 1);
    allSubs.forEach((val, i) => {
      if (val) next[getSubsKey(i)] = val;
    });
    onContentChange?.(next);
  };

  /* ── Sub-branch helpers (per parent) ── */
  const updateSubBranch = (branchIdx: number, subIdx: number, value: string) => {
    const arr = [...getSubBranches(branchIdx)];
    arr[subIdx] = value;
    handleChange(getSubsKey(branchIdx), arr.join('\n'));
  };

  const addSubBranch = (branchIdx: number) => {
    const arr = [...getSubBranches(branchIdx), ''];
    handleChange(getSubsKey(branchIdx), arr.join('\n'));
  };

  const removeSubBranch = (branchIdx: number, subIdx: number) => {
    const arr = getSubBranches(branchIdx).filter((_, i) => i !== subIdx);
    handleChange(getSubsKey(branchIdx), arr.join('\n'));
  };

  const toggleBranch = (index: number) => {
    setExpandedBranch((prev) => (prev === index ? null : index));
  };

  return (
    <div className="p-4 sm:p-6">
      {!isEditable && branches.length > 0 && <InteractionHint />}

      {isEditable && (
        <div className="max-w-3xl mx-auto">
          <GuidanceIntro intro={guidance.intro} steps={guidance.steps} />
          <div className="flex justify-end mb-3">
            <ShowExampleButton
              label={language === 'uz' ? 'Namuna ko\'rish' : 'Show Example'}
              clearLabel={language === 'uz' ? "Namunani o'chirish" : 'Clear Example'}
              onFill={() => onContentChange?.(guidance.exampleContent)}
              onClear={() => onContentChange?.({ centralIdea: '', mainBranches: '', subBranches: '' })}
            />
          </div>
        </div>
      )}

      <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-3xl mx-auto">
        {/* ── Central Idea ── */}
        <motion.div variants={fadeInUp} custom={0} className="flex justify-center mb-2">
          <GlassPanel
            className="inline-block bg-gradient-to-br from-pastel-purple/20 to-pastel-pink/20 border-pastel-purple/40 text-center max-w-sm w-full sm:w-auto"
            isActive
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-xl bg-pastel-purple/20 flex items-center justify-center">
                <Brain className="w-4 h-4 text-pastel-purple" />
              </div>
              <h3 className="font-bold text-sm text-gray-800 dark:text-gray-100">
                {t.createDiagram.editor.mindMap.centralIdea}
              </h3>
            </div>
            {isEditable ? (
              <>
                {guidance.sections.centralIdea && (
                  <SectionHint hint={guidance.sections.centralIdea.hint} />
                )}
                <DiagramTextArea
                  value={centralIdea}
                  onChange={(val) => handleChange('centralIdea', val)}
                  placeholder={guidance.sections.centralIdea?.placeholder || t.createDiagram.editor.mindMap.centralIdeaPlaceholder}
                  minHeight="50px"
                />
              </>
            ) : (
              <DiagramText text={centralIdea} className="font-semibold text-center" />
            )}
          </GlassPanel>
        </motion.div>

        {/* ── Connecting line ── */}
        {(branches.length > 0 || branchesRaw.length > 0 || isEditable) && (
          <div className="flex justify-center mb-2">
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="w-0.5 h-6 bg-gradient-to-b from-pastel-purple/40 to-gray-300/40 origin-top"
            />
          </div>
        )}

        {/* ── Branches with nested sub-branches ── */}
        <motion.div variants={fadeInUp} custom={1}>
          <div className="flex items-center gap-2 mb-1">
            <GitBranch className="w-4 h-4 text-gray-500" />
            <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
              {t.createDiagram.editor.mindMap.mainBranches}
            </h4>
            {branches.length > 0 && (
              <span className="text-[10px] font-bold text-pastel-purple bg-pastel-purple/10 rounded-full px-2 py-0.5">
                {branches.length}
              </span>
            )}
          </div>

          {isEditable && guidance.sections.mainBranches && (
            <SectionHint hint={guidance.sections.mainBranches.hint} />
          )}

          <div className="space-y-3">
            {(isEditable ? branchesRaw : branches).map((branch, i) => {
              const color = BRANCH_COLORS[i % BRANCH_COLORS.length];
              const isExpanded = expandedBranch === i;
              const showSubs = !isEditable || isExpanded;
              const subs = isEditable ? getSubBranches(i) : getSubBranchesFiltered(i);
              const subsCount = getSubBranchesFiltered(i).length;

              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  {/* Main branch row */}
                  <div
                    className={`rounded-xl border ${color.border} ${color.bg} px-3 py-2 ${
                      isExpanded ? 'ring-1 ring-pastel-purple/30' : ''
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${color.dot} flex-shrink-0`} />

                      {isEditable ? (
                        <>
                          <span className="text-xs font-bold text-gray-400 w-4">{i + 1}</span>
                          <input
                            type="text"
                            value={branch}
                            onChange={(e) => updateBranch(i, e.target.value)}
                            className="flex-1 bg-transparent text-sm text-gray-700 dark:text-gray-200 outline-none placeholder:text-gray-400"
                            placeholder={language === 'uz' ? `Tarmoq ${i + 1}` : `Branch ${i + 1}`}
                          />
                        </>
                      ) : (
                        <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 font-medium">
                          {branch}
                        </span>
                      )}

                      {/* Expand / sub-count toggle */}
                      {isEditable && (
                        <button
                          type="button"
                          onClick={() => toggleBranch(i)}
                          className="flex items-center gap-1 text-[10px] text-gray-400 hover:text-pastel-purple transition-colors px-1.5 py-0.5 rounded-md hover:bg-white/50 dark:hover:bg-white/5"
                        >
                          {subsCount > 0 && (
                            <span className="font-semibold">{subsCount}</span>
                          )}
                          <ChevronDown
                            className={`w-3 h-3 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
                          />
                        </button>
                      )}

                      {isEditable && (
                        <button
                          type="button"
                          onClick={() => removeBranch(i)}
                          className="p-1 rounded-lg text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Nested sub-branches */}
                    <AnimatePresence>
                      {showSubs && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25 }}
                          className="overflow-hidden"
                        >
                          <div className={`mt-2 pl-3 border-l-2 ${color.accent} space-y-1.5`}>
                            {subs.map((sub, si) => (
                              <motion.div
                                key={si}
                                initial={{ opacity: 0, x: -8 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: si * 0.03 }}
                              >
                                {isEditable ? (
                                  <div className={`flex items-center gap-2 rounded-lg border ${color.subBorder} ${color.subBg} px-2.5 py-1`}>
                                    <Sparkles className="w-3 h-3 text-gray-400 flex-shrink-0" />
                                    <input
                                      type="text"
                                      value={sub}
                                      onChange={(e) => updateSubBranch(i, si, e.target.value)}
                                      className="flex-1 bg-transparent text-xs text-gray-600 dark:text-gray-300 outline-none placeholder:text-gray-400"
                                      placeholder={language === 'uz' ? `Kichik tarmoq ${si + 1}` : `Sub-branch ${si + 1}`}
                                    />
                                    <button
                                      type="button"
                                      onClick={() => removeSubBranch(i, si)}
                                      className="p-0.5 rounded text-gray-400 hover:text-rose-500 transition-colors"
                                    >
                                      <X className="w-3 h-3" />
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex items-center gap-2 py-0.5">
                                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 dark:bg-gray-600 flex-shrink-0" />
                                    <span className="text-xs text-gray-600 dark:text-gray-400">{sub}</span>
                                  </div>
                                )}
                              </motion.div>
                            ))}

                            {isEditable && (
                              <button
                                type="button"
                                onClick={() => addSubBranch(i)}
                                className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-400 hover:text-pastel-purple transition-colors px-2.5 py-1 rounded-lg border border-dashed border-gray-200/60 hover:border-pastel-purple/40 w-full justify-center"
                              >
                                <Plus className="w-3 h-3" />
                                {language === 'uz' ? 'Kichik tarmoq qo\'shish' : 'Add sub-branch'}
                              </button>
                            )}

                            {!isEditable && subs.length === 0 && (
                              <span className="text-xs text-gray-400 italic pl-1">—</span>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              );
            })}

            {isEditable && (
              <button
                type="button"
                onClick={addBranch}
                className="flex items-center gap-2 text-xs font-semibold text-pastel-purple hover:text-pastel-purple/80 transition-colors px-3 py-2.5 rounded-xl border border-dashed border-pastel-purple/30 hover:border-pastel-purple/50 w-full justify-center"
              >
                <Plus className="w-3.5 h-3.5" />
                {language === 'uz' ? 'Tarmoq qo\'shish' : 'Add branch'}
              </button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};
