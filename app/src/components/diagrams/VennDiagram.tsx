'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { DiagramContent } from '@/types';
import {
  fadeInUp,
  staggerContainer,
  GlassPanel,
  DiagramText,
  InteractionHint,
  GuidanceIntro,
  ShowExampleButton,
} from './shared';
import { getGuidance } from '@/lib/diagramGuidance';

interface VennDiagramProps {
  content: DiagramContent;
  isEditable?: boolean;
  onContentChange?: (content: DiagramContent) => void;
}

const SET_LABELS = ['A', 'B', 'C', 'D', 'E', 'F'];

const CIRCLE_COLORS = [
  { fill: 'rgba(167, 139, 250, 0.28)', stroke: 'rgba(139, 92, 246, 0.7)' },
  { fill: 'rgba(56, 189, 248, 0.28)', stroke: 'rgba(14, 165, 233, 0.7)' },
  { fill: 'rgba(251, 113, 133, 0.24)', stroke: 'rgba(244, 63, 94, 0.7)' },
  { fill: 'rgba(251, 191, 36, 0.22)', stroke: 'rgba(245, 158, 11, 0.7)' },
  { fill: 'rgba(52, 211, 153, 0.22)', stroke: 'rgba(16, 185, 129, 0.7)' },
  { fill: 'rgba(129, 140, 248, 0.22)', stroke: 'rgba(99, 102, 241, 0.7)' },
];

interface Region {
  key: string;
  mask: number;
  indices: number[];
  label: string;
}

interface CirclePosition {
  x: number;
  y: number;
  radius: number;
}

interface VennSetDefinition {
  index: number;
  id: string;
  label: string;
  position: CirclePosition;
  color: {
    fill: string;
    stroke: string;
  };
  /** Coordinates for the label text rendered outside the circle. */
  labelPosition: { x: number; y: number };
  /** Centre of the non-overlapping (exclusive) slice of this circle. */
  exclusiveCenter: { x: number; y: number };
}

const getFriendlyRegionLabel = (setLabels: string[], setCount: number, language: 'en' | 'uz'): string => {
  if (setLabels.length === 1) {
    return language === 'uz' ? `Faqat ${setLabels[0]}` : `Only ${setLabels[0]}`;
  }

  if (setLabels.length === 2) {
    return language === 'uz'
      ? `${setLabels[0]} va ${setLabels[1]} uchun umumiy`
      : `Both ${setLabels[0]} and ${setLabels[1]}`;
  }

  if (setCount === 3 && setLabels.length === 3) {
    return language === 'uz' ? 'Barchasi uchun umumiy' : 'Common to all';
  }

  return language === 'uz'
    ? `${setLabels.join(', ')} uchun umumiy`
    : `Shared by ${setLabels.join(', ')}`;
};

const getGuidanceText = (setLabels: string[], setCount: number, language: 'en' | 'uz'): string => {
  if (setLabels.length === 1) {
    return language === 'uz'
      ? `Faqat ${setLabels[0]} ga tegishli narsalarni yozing.`
      : `Write what belongs only to ${setLabels[0]}.`;
  }

  if (setLabels.length === 2) {
    return language === 'uz'
      ? `${setLabels[0]} va ${setLabels[1]} uchun umumiy bo'lgan narsalarni yozing.`
      : `Write what both ${setLabels[0]} and ${setLabels[1]} have in common.`;
  }

  if (setCount === 3 && setLabels.length === 3) {
    return language === 'uz'
      ? 'Uchala to‘plam uchun umumiy bo‘lgan narsalarni yozing.'
      : 'Write what all circles have in common.';
  }

  return language === 'uz'
    ? 'Bu to‘plamlar uchun umumiy narsalarni yozing.'
    : 'Write what these circles share.';
};

const clampSetCount = (value?: string | number): number => {
  const parsed = Number(value);
  if (Number.isNaN(parsed)) return 2;
  return Math.max(2, Math.min(3, parsed));
};

const getRegionKey = (setIds: string[]) => `region_${setIds.join('_')}`;

const buildCirclePositions = (setCount: number): CirclePosition[] => {
  if (setCount === 2) {
    return [
      { x: 39, y: 38, radius: 27 },
      { x: 61, y: 38, radius: 27 },
    ];
  }

  return [
    { x: 50, y: 26, radius: 22.5 },
    { x: 64.5, y: 51, radius: 22.5 },
    { x: 35.5, y: 51, radius: 22.5 },
  ];
};

const buildSetDefinitions = (setCount: number): VennSetDefinition[] => {
  const positions = buildCirclePositions(setCount);

  // Centroid of all circle centres – used as the "inner" reference point.
  const cx = positions.reduce((a, p) => a + p.x, 0) / positions.length;
  const cy = positions.reduce((a, p) => a + p.y, 0) / positions.length;

  return positions.map((position, index) => {
    // Direction from the centroid outward through this circle's centre.
    let dx = position.x - cx;
    let dy = position.y - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist > 0.001) {
      dx /= dist;
      dy /= dist;
    } else {
      // Single circle or exactly at centroid – default to "above".
      dx = 0;
      dy = -1;
    }

    // Label: just outside the circle along the outward direction.
    const labelOffset = position.radius + 4;
    const labelX = Math.max(5, Math.min(95, position.x + dx * labelOffset));
    const labelY = Math.max(4, Math.min(72, position.y + dy * labelOffset));

    // Exclusive-zone centre: pushed outward so text & popups land in the
    // non-overlapping crescent of each circle.
    const exclFactor = setCount >= 3 ? 0.62 : 0.4;
    const exclX = position.x + dx * position.radius * exclFactor;
    const exclY = position.y + dy * position.radius * exclFactor;

    return {
      index,
      id: SET_LABELS[index],
      label: SET_LABELS[index],
      position,
      color: CIRCLE_COLORS[index % CIRCLE_COLORS.length],
      labelPosition: { x: labelX, y: labelY },
      exclusiveCenter: { x: exclX, y: exclY },
    };
  });
};

const buildRegions = (sets: VennSetDefinition[], language: 'en' | 'uz'): Region[] => {
  const regions: Region[] = [];
  const setCount = sets.length;
  const maxMask = 1 << setCount;

  for (let mask = 1; mask < maxMask; mask += 1) {
    const indices: number[] = [];
    const setIds: string[] = [];
    const setLabels: string[] = [];

    for (let i = 0; i < setCount; i += 1) {
      if ((mask & (1 << i)) !== 0) {
        indices.push(i);
        setIds.push(sets[i].id);
        setLabels.push(sets[i].label);
      }
    }

    regions.push({
      key: getRegionKey(setIds),
      mask,
      indices,
      label: getFriendlyRegionLabel(setLabels, setCount, language),
    });
  }

  return regions;
};

// Hardcoded intersection-zone centres for the standard 3-set triangle layout.
// Keys are bitmasks: A=1, B=2, C=4.
// Calculated for circles: A(50,26), B(64.5,51), C(35.5,51), r=22.5
const THREE_SET_REGION_POSITIONS: Record<number, { x: number; y: number }> = {
  0b011: { x: 59, y: 33 },   // A ∩ B (upper-right lens)
  0b101: { x: 41, y: 33 },   // A ∩ C (upper-left lens)
  0b110: { x: 50, y: 57 },   // B ∩ C (bottom lens)
  0b111: { x: 50, y: 43 },   // A ∩ B ∩ C (centre)
};

const getRegionPosition = (region: Region, circles: CirclePosition[], setCount: number) => {
  // For 3-set mode use the well-known geometric positions
  if (setCount === 3 && THREE_SET_REGION_POSITIONS[region.mask]) {
    return THREE_SET_REGION_POSITIONS[region.mask];
  }

  // Generic fallback (2-set mode and any future counts)
  const included = region.indices.map((idx) => circles[idx]);

  const centroid = included.reduce(
    (acc, c) => ({ x: acc.x + c.x, y: acc.y + c.y }),
    { x: 0, y: 0 }
  );

  const baseX = centroid.x / included.length;
  const baseY = centroid.y / included.length;

  return { x: baseX, y: baseY };
};

export const VennDiagram: React.FC<VennDiagramProps> = ({
  content,
  isEditable = false,
  onContentChange,
}) => {
  const { t, language } = useLanguage();
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);

  const setCount = useMemo(
    () => clampSetCount(content.__vennSetCount as string | number | undefined),
    [content.__vennSetCount]
  );

  const sets = useMemo(() => buildSetDefinitions(setCount), [setCount]);
  const circlePositions = useMemo(() => sets.map((setDef) => setDef.position), [sets]);
  const regions = useMemo(() => buildRegions(sets, language), [sets, language]);

  const legacyRegionMap = useMemo(
    () => ({
      region_A: (content.setA as string) || '',
      region_A_B: (content.common as string) || '',
      region_B: (content.setB as string) || '',
    }),
    [content.common, content.setA, content.setB]
  );

  const [activeRegion, setActiveRegion] = useState<string>(() =>
    regions[0]?.key || 'region_A'
  );

  const activeRegionData = useMemo(
    () => regions.find((r) => r.key === activeRegion),
    [activeRegion, regions]
  );

  useEffect(() => {
    if (!regions.some((r) => r.key === activeRegion)) {
      setActiveRegion(regions[0]?.key || 'region_A');
    }
  }, [activeRegion, regions]);

  useEffect(() => {
    if (hoveredRegion && !regions.some((r) => r.key === hoveredRegion)) {
      setHoveredRegion(null);
    }
  }, [hoveredRegion, regions]);

  useEffect(() => {
    const existingCount = content.__vennSetCount as string | number | undefined;
    if (existingCount === undefined && onContentChange) {
      onContentChange({
        ...content,
        __vennSetCount: '2',
        region_A: (content.setA as string) || '',
        region_A_B: (content.common as string) || '',
        region_B: (content.setB as string) || '',
      });
    }
  }, [content, onContentChange]);

  const getRegionText = (regionKey: string): string => {
    const val = content[regionKey];
    if (typeof val === 'string') return val;
    if (Array.isArray(val)) return val.join(', ');
    if (setCount === 2 && legacyRegionMap[regionKey as keyof typeof legacyRegionMap] !== undefined) {
      return legacyRegionMap[regionKey as keyof typeof legacyRegionMap];
    }
    return '';
  };

  const getEditorPosition = (region: Region | undefined) => {
    if (!region) {
      return { left: 50, top: 50, width: 160, height: 72 };
    }

    if (region.indices.length === 1) {
      const excl = sets[region.indices[0]].exclusiveCenter;
      return {
        left: excl.x,
        top: (excl.y / 76) * 100,
        width: setCount === 2 ? 150 : 130,
        height: 68,
      };
    }

    const pos = getRegionPosition(region, circlePositions, setCount);
    return {
      left: pos.x,
      top: (pos.y / 76) * 100,
      width: setCount === 2 ? 145 : 120,
      height: 64,
    };
  };

  const getRegionTextAnchor = (region: Region) => {
    if (region.indices.length === 1) {
      const set = sets[region.indices[0]];
      const excl = set.exclusiveCenter;
      const r = set.position.radius;
      return {
        left: excl.x,
        top: (excl.y / 76) * 100,
        width: r * 1.25,
      };
    }

    const pos = getRegionPosition(region, circlePositions, setCount);
    const r = sets[region.indices[0]].position.radius;
    return {
      left: pos.x,
      top: (pos.y / 76) * 100,
      width: region.indices.length === 2 ? r * 0.9 : r * 0.65,
    };
  };

  const handleRegionChange = (regionKey: string, value: string) => {
    const nextContent: DiagramContent = {
      ...content,
      [regionKey]: value,
      __vennSetCount: String(setCount),
    };

    // Keep old 2-set keys in sync so old save/evaluation flows remain compatible.
    if (setCount === 2) {
      if (regionKey === 'region_A') nextContent.setA = value;
      if (regionKey === 'region_A_B') nextContent.common = value;
      if (regionKey === 'region_B') nextContent.setB = value;
    }

    onContentChange?.(nextContent);
  };

  const handleSetCountChange = (nextCount: number) => {
    const clampedCount = Math.max(2, Math.min(3, nextCount));
    const nextSets = buildSetDefinitions(clampedCount);
    const nextRegions = buildRegions(nextSets, language);
    const nextContent: DiagramContent = {
      ...content,
      __vennSetCount: String(clampedCount),
    };

    const validRegionKeys = new Set(nextRegions.map((region) => region.key));
    Object.keys(nextContent).forEach((key) => {
      if (key.startsWith('region_') && !validRegionKeys.has(key)) {
        delete nextContent[key];
      }
    });

    nextRegions.forEach((region) => {
      if (typeof nextContent[region.key] !== 'string') {
        nextContent[region.key] = '';
      }
    });

    if (clampedCount === 2) {
      nextContent.setA = (nextContent.region_A as string) || '';
      nextContent.common = (nextContent.region_A_B as string) || '';
      nextContent.setB = (nextContent.region_B as string) || '';
    }

    onContentChange?.(nextContent);

    if (validRegionKeys.has(activeRegion)) {
      setActiveRegion(activeRegion);
    } else {
      setActiveRegion(nextRegions[0]?.key || 'region_A');
    }

    if (hoveredRegion && !validRegionKeys.has(hoveredRegion)) {
      setHoveredRegion(null);
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {!isEditable && (
        <InteractionHint
          text={
            language === 'uz'
              ? 'Rangli hududni bosing va matnni oson tahrir qiling'
              : 'Click any colorful area to read and edit it easily'
          }
        />
      )}

      {isEditable && (
        <>
          <GuidanceIntro
            intro={getGuidance('venn', language as 'en' | 'uz').intro}
            steps={getGuidance('venn', language as 'en' | 'uz').steps}
          />
          <div className="flex justify-end mb-3">
            <ShowExampleButton
              label={language === 'uz' ? 'Namuna ko\'rish' : 'Show Example'}
              clearLabel={language === 'uz' ? "Namunani o'chirish" : 'Clear Example'}
              onFill={() => onContentChange?.(getGuidance('venn', language as 'en' | 'uz').exampleContent)}
              onClear={() => onContentChange?.({ __vennSetCount: '2', setA: '', common: '', setB: '', region_A: '', region_A_B: '', region_B: '' })}
            />
          </div>
        </>
      )}

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        <motion.div variants={fadeInUp}>
          <GlassPanel className="p-3 sm:p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-200">
                {language === 'uz' ? 'To‘plamlar soni:' : 'Number of sets:'}
              </span>
              {[2, 3].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => handleSetCountChange(count)}
                  className={`
                    px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200
                    border
                    ${setCount === count
                      ? 'bg-pastel-purple text-white border-pastel-purple shadow-sm'
                      : 'bg-white/60 dark:bg-white/5 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-white/10 hover:scale-105'}
                  `}
                >
                  {count}
                </button>
              ))}
            </div>
          </GlassPanel>
        </motion.div>

        <motion.div variants={fadeInUp}>
          <GlassPanel className="p-2 sm:p-4">
            <div className="relative w-full max-w-3xl mx-auto aspect-[1.5/1]">
              <svg key={`venn-${setCount}`} viewBox="0 0 100 76" preserveAspectRatio="none" className="w-full h-full">
                {sets.map((setDef) => {
                  const regionKey = getRegionKey([setDef.id]);
                  const isActive = activeRegion === regionKey;
                  const isHovered = hoveredRegion === regionKey;

                  return (
                    <g key={setDef.id}>
                      <circle
                        cx={setDef.position.x}
                        cy={setDef.position.y}
                        r={setDef.position.radius}
                        fill={setDef.color.fill}
                        stroke={setDef.color.stroke}
                        strokeWidth={isActive ? 2.4 : isHovered ? 2 : 1.4}
                        className="cursor-pointer transition-all duration-200"
                        style={{ filter: isHovered || isActive ? 'drop-shadow(0 0 9px rgba(167, 139, 250, 0.5))' : 'none' }}
                        onClick={() => setActiveRegion(regionKey)}
                        onMouseEnter={() => setHoveredRegion(regionKey)}
                        onMouseLeave={() => setHoveredRegion(null)}
                      />
                      <text
                        x={setDef.labelPosition.x}
                        y={setDef.labelPosition.y}
                        textAnchor="middle"
                        className="fill-gray-700 dark:fill-gray-200 text-[3.7px] font-bold"
                      >
                        {setDef.label}
                      </text>
                    </g>
                  );
                })}

                {regions
                  .filter((region) => region.indices.length > 1)
                  .map((region) => {
                    const pos = getRegionPosition(region, circlePositions, setCount);
                    const isActive = activeRegion === region.key;
                    const isHovered = hoveredRegion === region.key;
                    const markerRadius = setCount === 3 ? 1.65 : 1.75;

                    return (
                      <g key={region.key}>
                        <circle
                          cx={pos.x}
                          cy={pos.y}
                          r={markerRadius + (isActive ? 0.6 : isHovered ? 0.35 : 0)}
                          fill={isActive ? 'rgba(236,72,153,0.9)' : 'rgba(255,255,255,0.88)'}
                          stroke={isActive || isHovered ? 'rgba(236,72,153,0.95)' : 'rgba(148,163,184,0.55)'}
                          strokeWidth={isActive || isHovered ? 0.8 : 0.45}
                          className="cursor-pointer transition-all duration-200"
                          onClick={() => setActiveRegion(region.key)}
                          onMouseEnter={() => setHoveredRegion(region.key)}
                          onMouseLeave={() => setHoveredRegion(null)}
                        />
                      </g>
                    );
                  })}
              </svg>

              {/* Short labels inside circles */}
              <div className="absolute inset-0 z-10 pointer-events-none">
                {regions.map((region) => {
                  const text = getRegionText(region.key).trim();
                  if (!text) return null;

                  const anchor = getRegionTextAnchor(region);
                  const isSelected = activeRegion === region.key;
                  const bulletCount = text.split('\n').filter(Boolean).length;

                  return (
                    <div
                      key={`label-${region.key}`}
                      className="absolute -translate-x-1/2 -translate-y-1/2 text-center pointer-events-auto cursor-pointer"
                      style={{
                        left: `${anchor.left}%`,
                        top: `${anchor.top}%`,
                        maxWidth: `${anchor.width}%`,
                      }}
                      onClick={() => setActiveRegion(region.key)}
                    >
                      <span
                        className={`inline-block text-[10px] font-bold rounded-full px-2 py-0.5 ${
                          isSelected
                            ? 'bg-pastel-purple/30 text-pastel-purple ring-1 ring-pastel-purple/50'
                            : 'bg-white/70 dark:bg-slate-800/70 text-gray-600 dark:text-gray-300'
                        }`}
                      >
                        {bulletCount > 0 ? `${bulletCount} ${language === 'uz' ? 'ta' : 'items'}` : region.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Inline editor */}
              {isEditable && activeRegionData && (
                <motion.div
                  key={activeRegionData.key}
                  initial={{ opacity: 0, scale: 0.94, y: 6 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ duration: 0.22 }}
                  className="absolute z-30"
                  style={{
                    left: `${getEditorPosition(activeRegionData).left}%`,
                    top: `${getEditorPosition(activeRegionData).top}%`,
                    transform: 'translate(-50%, -50%)',
                    width: `${getEditorPosition(activeRegionData).width}px`,
                    maxWidth: '44vw',
                  }}
                >
                  <div className="rounded-xl bg-white/95 dark:bg-slate-900/95 border-2 border-pastel-purple/60 shadow-lg p-2 backdrop-blur-sm">
                    <p className="text-[11px] font-bold text-pastel-purple mb-1 text-center">
                      {activeRegionData.label}
                    </p>
                    <textarea
                      value={getRegionText(activeRegionData.key)}
                      onChange={(e) => handleRegionChange(activeRegionData.key, e.target.value)}
                      className="w-full rounded-lg border border-gray-200 dark:border-white/15 bg-white/95 dark:bg-slate-800/70 px-2 py-1.5 text-xs text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-pastel-purple/35 resize-none"
                      style={{
                        minHeight: `${getEditorPosition(activeRegionData).height}px`,
                        fontSize: '13px',
                        lineHeight: 1.35,
                      }}
                      placeholder={`${language === 'uz' ? 'Har qatorga 1 ta yozing' : 'Write one item per line'}`}
                    />
                  </div>
                </motion.div>
              )}
            </div>
          </GlassPanel>
        </motion.div>

        {/* Region Content Cards below circles */}
        <motion.div variants={fadeInUp}>
          <div className={`grid gap-3 ${setCount === 2 ? 'grid-cols-3' : 'grid-cols-3 sm:grid-cols-7'}`}>
            {regions.map((region) => {
              const text = getRegionText(region.key);
              const isActive = activeRegion === region.key;
              const bullets = text.split('\n').filter((line) => line.trim());
              const regionColor = region.indices.length === 1
                ? sets[region.indices[0]].color.stroke
                : 'rgba(236, 72, 153, 0.7)';

              return (
                <motion.div
                  key={`card-${region.key}`}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveRegion(region.key)}
                  className={`
                    cursor-pointer rounded-xl p-3 border-2 transition-all duration-200
                    bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm
                    ${isActive
                      ? 'border-pastel-purple shadow-lg shadow-pastel-purple/15'
                      : 'border-gray-200/60 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20'}
                  `}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: regionColor }}
                    />
                    <h4 className="text-xs font-bold text-gray-700 dark:text-gray-200 truncate">
                      {region.label}
                    </h4>
                  </div>
                  {bullets.length > 0 ? (
                    <ul className="space-y-0.5">
                      {bullets.slice(0, 5).map((bullet, idx) => (
                        <li key={idx} className="text-xs text-gray-600 dark:text-gray-400 flex items-start gap-1.5 leading-tight">
                          <span className="text-pastel-purple mt-0.5 flex-shrink-0">{'\u2022'}</span>
                          <span className="line-clamp-1">{bullet}</span>
                        </li>
                      ))}
                      {bullets.length > 5 && (
                        <li className="text-[10px] text-gray-400 italic">
                          +{bullets.length - 5} {language === 'uz' ? 'ta yana' : 'more'}
                        </li>
                      )}
                    </ul>
                  ) : (
                    <p className="text-[10px] text-gray-400 italic">
                      {isEditable
                        ? (language === 'uz' ? 'Bu yerga yozing...' : 'Click to add...')
                        : '\u2014'}
                    </p>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Guidance panel */}
        <motion.div variants={fadeInUp}>
          <GlassPanel className="p-3 sm:p-4">
            <div className="mb-2">
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                {language === 'uz' ? 'Tanlangan hudud' : 'Selected area'}
              </p>
              <h3 className="text-base font-bold text-pastel-purple">
                {activeRegionData?.label || (language === 'uz' ? 'Faqat A' : 'Only A')}
              </h3>
              <p className="mt-1 text-sm text-gray-700 dark:text-gray-200">
                {getGuidanceText((activeRegionData?.indices || [0]).map((index) => sets[index]?.label || 'A'), setCount, language)}
              </p>
            </div>

            {isEditable ? (
              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                {language === 'uz'
                  ? "Maslahat: har qatorga bitta element yozing. Doira yoki kartani bosib tanlang."
                  : 'Tip: write one item per line. Click a circle or card to select it.'}
              </p>
            ) : (
              <DiagramText text={getRegionText(activeRegion)} className="text-sm" />
            )}
          </GlassPanel>
        </motion.div>
      </motion.div>
    </div>
  );
};