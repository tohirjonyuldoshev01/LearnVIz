'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Target, Link2, Plus, X, ChevronRight,
  GripVertical, Sparkles,
} from 'lucide-react';
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

/* ─── Types ─── */

interface CauseNode {
  id: string;
  text: string;
  subCauses: string[];
}

interface ArrowPath {
  id: string;
  d: string;
}

interface CauseEffectMatrixProps {
  content: DiagramContent;
  isEditable?: boolean;
  onContentChange?: (content: DiagramContent) => void;
}

/* ─── Helpers ─── */

let _nid = 0;
const nid = () => `cn-${Date.now()}-${++_nid}`;

function parseCauses(raw: string | string[] | undefined): CauseNode[] {
  if (!raw) return [{ id: nid(), text: '', subCauses: [] }];
  const str = Array.isArray(raw) ? raw.join('\n') : String(raw);
  if (!str.trim()) return [{ id: nid(), text: '', subCauses: [] }];
  const lines = str.split('\n');
  const nodes: CauseNode[] = [];
  let cur: CauseNode | null = null;
  for (const ln of lines) {
    if (!ln.trim()) continue;
    if (/^\s{2,}/.test(ln) || ln.startsWith('\t')) {
      if (cur) cur.subCauses.push(ln.trim().replace(/^[-•]\s*/, ''));
    } else {
      cur = { id: nid(), text: ln.trim().replace(/^[-•]\s*/, ''), subCauses: [] };
      nodes.push(cur);
    }
  }
  return nodes.length ? nodes : [{ id: nid(), text: str.trim(), subCauses: [] }];
}

function serializeCauses(nodes: CauseNode[]): string {
  return nodes
    .filter((n) => n.text.trim() || n.subCauses.some((s) => s.trim()))
    .map((n) => {
      const subs = n.subCauses
        .filter((s) => s.trim())
        .map((s) => `  - ${s}`)
        .join('\n');
      return subs ? `${n.text}\n${subs}` : n.text;
    })
    .join('\n');
}

/* ─── Color palette ─── */

const COLORS = [
  { bg: 'bg-sky-50 dark:bg-sky-950/40', border: 'border-sky-300 dark:border-sky-700', text: 'text-sky-700 dark:text-sky-300', grad: 'from-sky-400 to-blue-500', dot: 'bg-sky-400' },
  { bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-300 dark:border-emerald-700', text: 'text-emerald-700 dark:text-emerald-300', grad: 'from-emerald-400 to-teal-500', dot: 'bg-emerald-400' },
  { bg: 'bg-violet-50 dark:bg-violet-950/40', border: 'border-violet-300 dark:border-violet-700', text: 'text-violet-700 dark:text-violet-300', grad: 'from-violet-400 to-purple-500', dot: 'bg-violet-400' },
  { bg: 'bg-rose-50 dark:bg-rose-950/40', border: 'border-rose-300 dark:border-rose-700', text: 'text-rose-700 dark:text-rose-300', grad: 'from-rose-400 to-pink-500', dot: 'bg-rose-400' },
  { bg: 'bg-cyan-50 dark:bg-cyan-950/40', border: 'border-cyan-300 dark:border-cyan-700', text: 'text-cyan-700 dark:text-cyan-300', grad: 'from-cyan-400 to-blue-500', dot: 'bg-cyan-400' },
];

const ICONS = [Zap, Sparkles, Zap, Sparkles, Zap];

/* ─── Component ─── */

export const CauseEffectMatrix: React.FC<CauseEffectMatrixProps> = ({
  content,
  isEditable = false,
  onContentChange,
}) => {
  const { t, language } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const causeEls = useRef<Map<string, HTMLDivElement>>(new Map());
  const effectEl = useRef<HTMLDivElement>(null);
  const guidance = getGuidance('causeeffect', language as 'en' | 'uz');

  const [causes, setCauses] = useState<CauseNode[]>(() =>
    parseCauses(content.causes),
  );
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [arrows, setArrows] = useState<ArrowPath[]>([]);
  const lastSerialized = useRef<string>(
    Array.isArray(content.causes) ? content.causes.join('\n') : String(content.causes || ''),
  );

  const labels: Record<string, string> = {
    causes: t.createDiagram.editor.causeEffect.causes,
    effects: t.createDiagram.editor.causeEffect.effects,
    correlation: t.createDiagram.editor.causeEffect.correlation,
  };

  const placeholders: Record<string, string> = {
    causes: t.createDiagram.editor.causeEffect.causesPlaceholder,
    effects: t.createDiagram.editor.causeEffect.effectsPlaceholder,
    correlation: t.createDiagram.editor.causeEffect.correlationPlaceholder,
  };

  /* ─── Sync content.causes → local state (external changes only) ─── */
  useEffect(() => {
    const raw = Array.isArray(content.causes) ? content.causes.join('\n') : String(content.causes || '');
    if (raw !== lastSerialized.current) {
      setCauses(parseCauses(raw));
      lastSerialized.current = raw;
    }
  }, [content.causes]);

  /* ─── Arrow calculation ─── */
  const computeArrows = useCallback(() => {
    const box = containerRef.current;
    const eff = effectEl.current;
    if (!box || !eff) return;

    const cRect = box.getBoundingClientRect();
    const eRect = eff.getBoundingClientRect();
    const eX = eRect.left - cRect.left;
    const eMidY = eRect.top + eRect.height / 2 - cRect.top;

    const paths: ArrowPath[] = [];
    causeEls.current.forEach((el, id) => {
      const r = el.getBoundingClientRect();
      const sX = r.right - cRect.left;
      const sY = r.top + r.height / 2 - cRect.top;
      const cp = Math.max(40, (eX - sX) * 0.45);
      paths.push({
        id,
        d: `M${sX},${sY} C${sX + cp},${sY} ${eX - cp},${eMidY} ${eX},${eMidY}`,
      });
    });
    setArrows(paths);
  }, []);

  useEffect(() => {
    const raf = requestAnimationFrame(computeArrows);
    const ro = new ResizeObserver(() => computeArrows());
    if (containerRef.current) ro.observe(containerRef.current);
    window.addEventListener('resize', computeArrows);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', computeArrows);
    };
  }, [computeArrows, causes, expanded]);

  // Re-compute after expand/collapse animations settle
  useEffect(() => {
    const timer = setTimeout(computeArrows, 350);
    return () => clearTimeout(timer);
  }, [expanded, causes, computeArrows]);

  /* ─── Mutation helpers ─── */
  const commit = useCallback(
    (next: CauseNode[]) => {
      setCauses(next);
      const s = serializeCauses(next);
      lastSerialized.current = s;
      onContentChange?.({ ...content, causes: s });
      requestAnimationFrame(computeArrows);
    },
    [content, onContentChange, computeArrows],
  );

  const addCause = () =>
    commit([...causes, { id: nid(), text: '', subCauses: [] }]);

  const removeCause = (id: string) =>
    commit(causes.filter((c) => c.id !== id));

  const updateCauseText = (id: string, text: string) =>
    commit(causes.map((c) => (c.id === id ? { ...c, text } : c)));

  const addSubCause = (cid: string) =>
    commit(
      causes.map((c) =>
        c.id === cid ? { ...c, subCauses: [...c.subCauses, ''] } : c,
      ),
    );

  const updateSubCause = (cid: string, i: number, text: string) =>
    commit(
      causes.map((c) => {
        if (c.id !== cid) return c;
        const s = [...c.subCauses];
        s[i] = text;
        return { ...c, subCauses: s };
      }),
    );

  const removeSubCause = (cid: string, i: number) =>
    commit(
      causes.map((c) =>
        c.id === cid
          ? { ...c, subCauses: c.subCauses.filter((_, j) => j !== i) }
          : c,
      ),
    );

  const toggleExpanded = (id: string) =>
    setExpanded((prev) => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });

  const effectText = (content.effects as string) || '';
  const correlationText = (content.correlation as string) || '';

  return (
    <div className="p-4 sm:p-6">
      {!isEditable && <InteractionHint />}

      {isEditable && (
        <div className="max-w-4xl mx-auto">
          <GuidanceIntro intro={guidance.intro} steps={guidance.steps} />
          <div className="flex justify-end mb-3">
            <ShowExampleButton
              label={language === 'uz' ? 'Namuna ko\'rish' : 'Show Example'}
              clearLabel={language === 'uz' ? "Namunani o'chirish" : 'Clear Example'}
              onFill={() => onContentChange?.(guidance.exampleContent)}
              onClear={() => onContentChange?.({ causes: [], effects: [], correlation: '' })}
            />
          </div>
        </div>
      )}

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-6 max-w-4xl mx-auto"
      >
        {/* ─── Diagram Canvas ─── */}
        <div ref={containerRef} className="relative min-h-[280px]">
          {/* SVG arrow layer (desktop) */}
          <svg
            className="absolute inset-0 w-full h-full pointer-events-none z-[5] hidden md:block"
            style={{ overflow: 'visible' }}
          >
            <defs>
              <marker
                id="ce-arrow"
                markerWidth="8"
                markerHeight="6"
                refX="7"
                refY="3"
                orient="auto"
              >
                <polygon
                  points="0 0, 8 3, 0 6"
                  className="fill-purple-400 dark:fill-purple-500"
                />
              </marker>
              <linearGradient id="ce-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#a78bfa" />
              </linearGradient>
            </defs>
            {arrows.map((a) => (
              <path
                key={a.id}
                d={a.d}
                stroke="url(#ce-grad)"
                strokeWidth="2.5"
                fill="none"
                markerEnd="url(#ce-arrow)"
                className="opacity-60"
              />
            ))}
          </svg>

          {/* Node layout */}
          <div className="relative z-10 flex flex-col md:flex-row gap-6 md:gap-10 items-stretch">
            {/* ── Causes column ── */}
            <div className="flex-1 min-w-0 space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-sky-400 to-blue-500 flex items-center justify-center shadow">
                  <Zap className="w-3.5 h-3.5 text-white" />
                </div>
                <h3 className="font-bold text-sm text-sky-700 dark:text-sky-300 tracking-wide uppercase">
                  {labels.causes}
                </h3>
              </div>

              <AnimatePresence mode="popLayout">
                {causes.map((c, idx) => {
                  const clr = COLORS[idx % COLORS.length];
                  const Icon = ICONS[idx % ICONS.length];
                  const open = expanded.has(c.id);

                  return (
                    <motion.div
                      key={c.id}
                      ref={(el: HTMLDivElement | null) => {
                        if (el) causeEls.current.set(c.id, el);
                        else causeEls.current.delete(c.id);
                      }}
                      initial={{ opacity: 0, x: -24, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      exit={{
                        opacity: 0,
                        x: -24,
                        scale: 0.9,
                        transition: { duration: 0.2 },
                      }}
                      drag={!isEditable}
                      dragMomentum={false}
                      dragElastic={0.15}
                      dragConstraints={containerRef}
                      onDrag={() => requestAnimationFrame(computeArrows)}
                      onDragEnd={() => setTimeout(computeArrows, 50)}
                      whileDrag={{
                        scale: 1.06,
                        zIndex: 50,
                        boxShadow: '0 8px 30px rgba(0,0,0,.12)',
                      }}
                      className={`
                        rounded-2xl border-2 ${clr.border} ${clr.bg}
                        shadow-sm hover:shadow-md transition-shadow
                        ${!isEditable ? 'cursor-grab active:cursor-grabbing select-none' : ''}
                      `}
                    >
                      <div className="p-3">
                        {/* Cause header row */}
                        <div className="flex items-center gap-2">
                          {!isEditable && (
                            <GripVertical className="w-4 h-4 text-gray-400/60 flex-shrink-0" />
                          )}
                          <div
                            className={`w-7 h-7 rounded-lg bg-gradient-to-br ${clr.grad} flex items-center justify-center shadow-sm flex-shrink-0`}
                          >
                            <Icon className="w-3.5 h-3.5 text-white" />
                          </div>

                          {isEditable ? (
                            <input
                              type="text"
                              value={c.text}
                              onChange={(e) =>
                                updateCauseText(c.id, e.target.value)
                              }
                              placeholder={`${labels.causes} ${idx + 1}...`}
                              className={`flex-1 min-w-0 px-2.5 py-1.5 rounded-lg border border-white/50 dark:border-gray-700 bg-white/70 dark:bg-gray-800/60 text-sm ${clr.text} placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pastel-purple/40 transition`}
                            />
                          ) : (
                            <span
                              className={`text-sm font-semibold ${clr.text} flex-1 truncate`}
                            >
                              {c.text || `${labels.causes} ${idx + 1}`}
                            </span>
                          )}

                          {(c.subCauses.length > 0 || isEditable) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleExpanded(c.id);
                              }}
                              className="p-1 rounded-lg hover:bg-white/60 dark:hover:bg-gray-700/50 transition-colors"
                              aria-label="Toggle sub-causes"
                            >
                              <motion.div
                                animate={{ rotate: open ? 90 : 0 }}
                                transition={{ duration: 0.2 }}
                              >
                                <ChevronRight className="w-4 h-4 text-gray-500" />
                              </motion.div>
                            </button>
                          )}

                          {isEditable && causes.length > 1 && (
                            <button
                              onClick={() => removeCause(c.id)}
                              className="p-1 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                              aria-label="Remove cause"
                            >
                              <X className="w-4 h-4 text-red-400" />
                            </button>
                          )}
                        </div>

                        {/* Sub-causes */}
                        <AnimatePresence>
                          {open && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25 }}
                              className="overflow-hidden"
                            >
                              <div className="mt-2.5 ml-9 space-y-2 border-l-2 border-dashed border-gray-300/60 dark:border-gray-600/40 pl-3">
                                {c.subCauses.map((sub, si) => (
                                  <div
                                    key={si}
                                    className="flex items-center gap-2"
                                  >
                                    <span
                                      className={`w-2 h-2 rounded-full ${clr.dot} flex-shrink-0`}
                                    />
                                    {isEditable ? (
                                      <>
                                        <input
                                          type="text"
                                          value={sub}
                                          onChange={(e) =>
                                            updateSubCause(
                                              c.id,
                                              si,
                                              e.target.value,
                                            )
                                          }
                                          placeholder="Sub-cause..."
                                          className="flex-1 min-w-0 px-2 py-1 rounded-lg border border-white/40 dark:border-gray-700 bg-white/50 dark:bg-gray-800/40 text-xs focus:outline-none focus:ring-1 focus:ring-pastel-purple/40 transition"
                                        />
                                        <button
                                          onClick={() =>
                                            removeSubCause(c.id, si)
                                          }
                                          className="p-0.5 rounded hover:bg-red-100 dark:hover:bg-red-900/30"
                                          aria-label="Remove sub-cause"
                                        >
                                          <X className="w-3.5 h-3.5 text-red-400" />
                                        </button>
                                      </>
                                    ) : (
                                      <span className="text-xs text-gray-600 dark:text-gray-400">
                                        {sub}
                                      </span>
                                    )}
                                  </div>
                                ))}
                                {isEditable && (
                                  <button
                                    onClick={() => addSubCause(c.id)}
                                    className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 py-1 transition-colors"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                    <span>Sub-cause</span>
                                  </button>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {isEditable && (
                <motion.button
                  variants={fadeInUp}
                  onClick={addCause}
                  className="w-full py-3 rounded-2xl border-2 border-dashed border-sky-300/50 dark:border-sky-700/30 bg-sky-50/40 dark:bg-sky-950/20 hover:bg-sky-100/60 dark:hover:bg-sky-900/30 flex items-center justify-center gap-2 text-sky-500 dark:text-sky-400 text-sm font-medium transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  {labels.causes}
                </motion.button>
              )}
            </div>

            {/* Mobile arrow indicator */}
            <div className="flex md:hidden items-center justify-center py-1">
              <motion.div
                animate={{ y: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 5v14m0 0l5-5m-5 5l-5-5"
                    stroke="#a78bfa"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </motion.div>
            </div>

            {/* ── Effect node ── */}
            <div className="md:w-72 flex items-center">
              <motion.div
                ref={effectEl}
                variants={fadeInUp}
                drag={!isEditable}
                dragMomentum={false}
                dragElastic={0.15}
                dragConstraints={containerRef}
                onDrag={() => requestAnimationFrame(computeArrows)}
                onDragEnd={() => setTimeout(computeArrows, 50)}
                whileDrag={{
                  scale: 1.06,
                  zIndex: 50,
                  boxShadow: '0 8px 30px rgba(0,0,0,.12)',
                }}
                className={`
                  w-full rounded-2xl border-2 border-amber-300 dark:border-amber-700
                  bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/40 dark:to-orange-950/40
                  shadow-lg
                  ${!isEditable ? 'cursor-grab active:cursor-grabbing select-none' : ''}
                `}
              >
                <div className="p-4 sm:p-5">
                  <div className="flex items-center gap-2 mb-3">
                    {!isEditable && (
                      <GripVertical className="w-4 h-4 text-gray-400/60 flex-shrink-0" />
                    )}
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow">
                      <Target className="w-4 h-4 text-white" />
                    </div>
                    <h3 className="font-bold text-sm text-amber-700 dark:text-amber-300 tracking-wide uppercase">
                      {labels.effects}
                    </h3>
                  </div>

                  {isEditable ? (
                    <>
                      {guidance.sections.effects && (
                        <SectionHint hint={guidance.sections.effects.hint} />
                      )}
                      <DiagramTextArea
                        value={effectText}
                        onChange={(v) =>
                          onContentChange?.({ ...content, effects: v })
                        }
                        placeholder={guidance.sections.effects?.placeholder || placeholders.effects}
                        minHeight="120px"
                      />
                    </>
                  ) : (
                    <div
                      className="cursor-pointer"
                      onClick={() =>
                        setActiveSection(
                          activeSection === 'effects' ? null : 'effects',
                        )
                      }
                    >
                      {activeSection !== 'effects' && effectText && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-4">
                          {effectText}
                        </p>
                      )}
                      <ExpandableDetail isOpen={activeSection === 'effects'}>
                        <DiagramText text={effectText} className="text-sm" />
                      </ExpandableDetail>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </div>

        {/* ─── Correlation section ─── */}
        <motion.div variants={fadeInUp}>
          <GlassPanel
            className={`p-4 cursor-pointer transition-all duration-300 ${
              activeSection === 'correlation'
                ? 'ring-2 ring-pastel-purple/30 shadow-md'
                : ''
            }`}
            onClick={() =>
              !isEditable &&
              setActiveSection(
                activeSection === 'correlation' ? null : 'correlation',
              )
            }
          >
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-fuchsia-400 to-purple-500 flex items-center justify-center shadow-sm">
                <Link2 className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-sm text-fuchsia-700 dark:text-fuchsia-300">
                {labels.correlation}
              </h3>
            </div>

            {isEditable ? (
              <>
                {guidance.sections.correlation && (
                  <SectionHint hint={guidance.sections.correlation.hint} />
                )}
                <DiagramTextArea
                  value={correlationText}
                  onChange={(v) =>
                    onContentChange?.({ ...content, correlation: v })
                  }
                  placeholder={guidance.sections.correlation?.placeholder || placeholders.correlation}
                  minHeight="80px"
                />
              </>
            ) : (
              <>
                {activeSection !== 'correlation' && correlationText && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                    {correlationText}
                  </p>
                )}
                <ExpandableDetail isOpen={activeSection === 'correlation'}>
                  <DiagramText
                    text={correlationText}
                    className="text-sm"
                  />
                </ExpandableDetail>
              </>
            )}
          </GlassPanel>
        </motion.div>
      </motion.div>
    </div>
  );
};
