'use client';

import React from 'react';
import { LayoutGrid, PlusCircle, RotateCcw, Sparkles } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { Bone } from './Bone';
import { createBone, createSubCause, getNextBoneSide } from './adapter';
import { calculateFishboneLayout } from './layout';
import { FishboneModel } from './types';

interface FishboneCanvasProps {
  model: FishboneModel;
  isEditable: boolean;
  onChange: (model: FishboneModel) => void;
}

type ContextState = {
  x: number;
  y: number;
  target: { type: 'bone' | 'sub'; boneId: string; subId?: string };
} | null;

type DragState =
  | {
      type: 'bone';
      boneId: string;
      startX: number;
      startY: number;
      initialDx: number;
      initialDy: number;
    }
  | {
      type: 'pan';
      startX: number;
      startY: number;
      initialPanX: number;
      initialPanY: number;
    }
  | null;

const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));

const CATEGORY_COLORS = [
  '#3B82F6', // Blue
  '#10B981', // Green
  '#F59E0B', // Amber
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#06B6D4', // Cyan
  '#F43F5E', // Red
  '#14B8A6', // Teal
];

export const FishboneCanvas: React.FC<FishboneCanvasProps> = ({ model, isEditable, onChange }) => {
  const { t } = useLanguage();
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const [size, setSize] = React.useState({ width: 1200, height: 560 });
  const [hoveredBoneId, setHoveredBoneId] = React.useState<string | null>(null);
  const [hoveredSubId, setHoveredSubId] = React.useState<string | null>(null);
  const [editingKey, setEditingKey] = React.useState<string | null>(null);
  const [context, setContext] = React.useState<ContextState>(null);
  const [zoom, setZoom] = React.useState(1);
  const [pan, setPan] = React.useState({ x: 0, y: 0 });
  const [drag, setDrag] = React.useState<DragState>(null);
  const [selectedBoneId, setSelectedBoneId] = React.useState<string | null>(null);
  const [selectedSubId, setSelectedSubId] = React.useState<string | null>(null);

  React.useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      setSize({
        width: Math.max(rect.width - 12, 840),
        height: Math.max(rect.height - 12, 480),
      });
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  React.useEffect(() => {
    if (!drag) return;

    const onMove = (event: PointerEvent) => {
      if (drag.type === 'bone') {
        const dx = (event.clientX - drag.startX) / zoom;
        const dy = (event.clientY - drag.startY) / zoom;
        onChange({
          ...model,
          bones: model.bones.map((bone) =>
            bone.id === drag.boneId
              ? {
                  ...bone,
                  manualDx: drag.initialDx + dx,
                  manualDy: drag.initialDy + dy,
                }
              : bone
          ),
        });
      } else {
        setPan({
          x: drag.initialPanX + (event.clientX - drag.startX),
          y: drag.initialPanY + (event.clientY - drag.startY),
        });
      }
    };

    const onUp = () => setDrag(null);

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [drag, model, onChange, zoom]);

  const layout = React.useMemo(
    () => calculateFishboneLayout(model, size.width, size.height),
    [model, size.height, size.width]
  );

  const updateEffect = (effect: string) => onChange({ ...model, effect });

  const updateBoneLabel = (boneId: string, label: string) => {
    onChange({
      ...model,
      bones: model.bones.map((bone) => (bone.id === boneId ? { ...bone, label } : bone)),
    });
    setEditingKey(null);
  };

  const updateSubLabel = (boneId: string, subId: string, text: string) => {
    onChange({
      ...model,
      bones: model.bones.map((bone) =>
        bone.id === boneId
          ? {
              ...bone,
              subCauses: bone.subCauses.map((sub) => (sub.id === subId ? { ...sub, text } : sub)),
            }
          : bone
      ),
    });
    setEditingKey(null);
  };

  const addBone = () => {
    const side = getNextBoneSide(model.bones);
    onChange({
      ...model,
      bones: [...model.bones, createBone(`Category ${model.bones.length + 1}`, side, model.bones.length)],
    });
  };

  const deleteBone = (boneId: string) => {
    onChange({
      ...model,
      bones: model.bones.filter((bone) => bone.id !== boneId),
    });
    setContext(null);
  };

  const addSubCause = (boneId: string) => {
    onChange({
      ...model,
      bones: model.bones.map((bone) =>
        bone.id === boneId
          ? {
              ...bone,
              subCauses: [...bone.subCauses, createSubCause()],
            }
          : bone
      ),
    });
  };

  const deleteSubCause = (boneId: string, subId: string) => {
    onChange({
      ...model,
      bones: model.bones.map((bone) =>
        bone.id === boneId
          ? {
              ...bone,
              subCauses: bone.subCauses.filter((sub) => sub.id !== subId),
            }
          : bone
      ),
    });
    setContext(null);
  };

  const onWheel = (event: React.WheelEvent<SVGSVGElement>) => {
    event.preventDefault();
    const next = clamp(zoom + (event.deltaY > 0 ? -0.08 : 0.08), 0.55, 1.8);
    setZoom(next);
  };

  const zoomIn = () => setZoom((prev) => clamp(prev + 0.1, 0.55, 1.8));
  const zoomOut = () => setZoom((prev) => clamp(prev - 0.1, 0.55, 1.8));

  const fitToScreen = React.useCallback(() => {
    const margin = 0.1;
    const fitZoomX = size.width / layout.width;
    const fitZoomY = size.height / layout.height;
    const nextZoom = clamp(Math.min(fitZoomX, fitZoomY) * (1 - margin), 0.7, 1.25);
    setZoom(nextZoom);
    setPan({
      x: (size.width - layout.width * nextZoom) / 2,
      y: (size.height - layout.height * nextZoom) / 2,
    });
  }, [layout.height, layout.width, size.height, size.width]);

  const resetView = () => fitToScreen();

  const autoArrange = () => {
    onChange({
      ...model,
      bones: model.bones.map((bone, index) => ({
        ...bone,
        manualDx: 0,
        manualDy: 0,
        angle: bone.side === 'top' ? -(30 + (index % 3) * 4) : 30 + (index % 3) * 4,
      })),
    });
    resetView();
  };

  const rebalanceSides = () => {
    onChange({
      ...model,
      bones: model.bones.map((bone, index) => ({
        ...bone,
        side: index % 2 === 0 ? 'top' : 'bottom',
        angle: index % 2 === 0 ? -(32 + (index % 3) * 4) : 32 + (index % 3) * 4,
        manualDx: 0,
        manualDy: 0,
      })),
    });
  };

  React.useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setContext(null);
        setEditingKey(null);
      }

      if ((event.ctrlKey || event.metaKey) && event.key === '=') {
        event.preventDefault();
        zoomIn();
      }
      if ((event.ctrlKey || event.metaKey) && event.key === '-') {
        event.preventDefault();
        zoomOut();
      }
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === '0') {
        event.preventDefault();
        resetView();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [fitToScreen]);

  React.useEffect(() => {
    fitToScreen();
  }, [fitToScreen]);

  const fishHeadDims = React.useMemo(() => {
    const cx = layout.headCenter.x;
    const cy = layout.headCenter.y;
    const r = layout.headRadius;
    const halfH = r * 1.3;
    const baseX = cx - r * 0.8;
    const tipX = cx + r * 1.5;
    return { cx, cy, r, halfH, baseX, tipX };
  }, [layout.headCenter.x, layout.headCenter.y, layout.headRadius]);

  const fishHeadPath = React.useMemo(() => {
    const { cy, halfH, baseX, tipX } = fishHeadDims;
    // Clean symmetrical triangular arrow pointing right
    return `M ${baseX} ${cy - halfH} L ${tipX} ${cy} L ${baseX} ${cy + halfH} Z`;
  }, [fishHeadDims]);
  
  const fishTailPath = React.useMemo(() => {
    const sx = layout.spineStart.x;
    const sy = layout.spineStart.y;
    return `M ${sx + 20} ${sy} L ${sx - 60} ${sy - 60} L ${sx - 40} ${sy} L ${sx - 60} ${sy + 60} Z`;
  }, [layout.spineStart.x, layout.spineStart.y]);

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[520px] rounded-2xl border border-gray-200 bg-[#f8fafc] shadow-sm overflow-hidden"
      onClick={() => setContext(null)}
    >
      <svg
        width="100%"
        height={Math.max(size.height, 500)}
        viewBox={`0 0 ${layout.width} ${layout.height}`}
        onWheel={onWheel}
      >
        <defs>
          <filter id="head-shadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="2" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.1" />
          </filter>
        </defs>
        <g transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`} style={{ transition: 'transform 180ms ease' }}>
          <rect
            x={0}
            y={0}
            width={layout.width}
            height={layout.height}
            fill="transparent"
            onPointerDown={(event) => {
              if (!isEditable) return;
              setDrag({
                type: 'pan',
                startX: event.clientX,
                startY: event.clientY,
                initialPanX: pan.x,
                initialPanY: pan.y,
              });
            }}
          />
          
          <path
            d={fishTailPath}
            fill="#5b88d5"
            stroke="#4a73bd"
            strokeWidth={2}
          />
          
          <line
            x1={layout.spineStart.x}
            y1={layout.spineStart.y}
            x2={fishHeadDims.baseX + 2}
            y2={layout.spineEnd.y}
            stroke="#5b88d5"
            strokeWidth={16}
            strokeLinecap="butt"
          />

          {/* Solid Blue Fish Head */}
          <path
            d={fishHeadPath}
            fill="#5b88d5"
            stroke="#4a73bd"
            strokeWidth={2}
            filter="url(#head-shadow)"
            className="cursor-pointer transition-transform hover:brightness-110"
            onDoubleClick={() => isEditable && setEditingKey('effect')}
          />

          {isEditable && editingKey === 'effect' ? (
            <foreignObject
              x={fishHeadDims.baseX + fishHeadDims.r * 0.15}
              y={fishHeadDims.cy - fishHeadDims.r * 0.55}
              width={fishHeadDims.r * 1.4}
              height={fishHeadDims.r * 1.1}
            >
              <div
                contentEditable
                suppressContentEditableWarning
                autoFocus
                onBlur={(event) => {
                  updateEffect(event.currentTarget.textContent || '');
                  setEditingKey(null);
                }}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    updateEffect((event.currentTarget as HTMLDivElement).textContent || '');
                    setEditingKey(null);
                  }
                }}
                className="w-full h-full px-2 py-1 rounded-md border-2 border-white bg-[#5b88d5] text-white text-sm text-center font-bold outline-none flex items-center justify-center shadow-inner"
                style={{ fontFamily: 'ui-rounded, "Nunito", sans-serif', overflowWrap: 'break-word', wordBreak: 'break-word' }}
              >
                {model.effect}
              </div>
            </foreignObject>
          ) : (
            <foreignObject
              x={fishHeadDims.baseX + fishHeadDims.r * 0.1}
              y={fishHeadDims.cy - fishHeadDims.r * 0.5}
              width={fishHeadDims.r * 1.5}
              height={fishHeadDims.r * 1.0}
              className="pointer-events-none"
            >
              <div
                className={`w-full h-full flex items-center justify-center text-center select-none ${
                  isEditable ? 'cursor-text' : ''
                }`}
                style={{
                  fontFamily: 'ui-rounded, "Nunito", sans-serif',
                  fontSize: `${Math.max(Math.min(fishHeadDims.r * 0.38, 24), 13)}px`,
                  fontWeight: 900,
                  color: '#ffffff',
                  letterSpacing: '1px',
                  overflowWrap: 'break-word',
                  wordBreak: 'break-word',
                  lineHeight: 1.15,
                  maxWidth: '100%',
                  pointerEvents: isEditable ? 'auto' : 'none',
                }}
                onDoubleClick={() => isEditable && setEditingKey('effect')}
              >
                {model.effect ? model.effect.toUpperCase() : t.createDiagram.editor.fishbone.effect.toUpperCase()}
              </div>
            </foreignObject>
          )}

          {layout.boneLayouts.map((boneLayout, index) => {
            const bone = model.bones.find((item) => item.id === boneLayout.id);
            if (!bone) return null;

            const color = CATEGORY_COLORS[index % CATEGORY_COLORS.length];

            return (
              <Bone
                key={bone.id}
                bone={bone}
                color={color}
                layout={boneLayout}
                isEditable={isEditable}
                isHovered={hoveredBoneId === bone.id}
                isSelected={selectedBoneId === bone.id}
                hoveredSubId={hoveredSubId}
                selectedSubId={selectedSubId}
                editingKey={editingKey}
                onHover={setHoveredBoneId}
                onHoverSub={setHoveredSubId}
                onSelect={(id) => {
                  setSelectedBoneId(id);
                  setSelectedSubId(null);
                }}
                onSelectSub={(id) => {
                  setSelectedSubId(id);
                  setSelectedBoneId(bone.id);
                }}
                onStartEdit={setEditingKey}
                onCommitBoneLabel={updateBoneLabel}
                onCommitSubLabel={updateSubLabel}
                onAddSubCause={addSubCause}
                onDeleteBone={deleteBone}
                onDeleteSubCause={deleteSubCause}
                onDragBonePointerDown={(boneId, event) => {
                  event.preventDefault();
                  setDrag({
                    type: 'bone',
                    boneId,
                    startX: event.clientX,
                    startY: event.clientY,
                    initialDx: bone.manualDx || 0,
                    initialDy: bone.manualDy || 0,
                  });
                }}
                onContextMenu={(event, target) => {
                  if (!isEditable) return;
                  event.preventDefault();
                  setContext({ x: event.clientX, y: event.clientY, target });
                }}
              />
            );
          })}

          {isEditable && (
            <g transform={`translate(${layout.spineStart.x + 18}, ${layout.spineStart.y - 30})`} onClick={addBone} className="cursor-pointer">
              <rect width={24} height={24} rx={12} fill="#FFF58A" stroke="#DD7BDF" strokeWidth={2} />
              <text x={12} y={16} textAnchor="middle" fontSize={14} fontWeight={700} fill="#DD7BDF">+</text>
            </g>
          )}

          {model.bones.length === 0 && isEditable && (
            <g>
              <rect x={layout.width / 2 - 180} y={layout.height / 2 - 44} width={360} height={88} rx={16} fill="#ffffffcc" stroke="#B3BFFF" />
              <text x={layout.width / 2} y={layout.height / 2 - 10} textAnchor="middle" fontSize={14} fontWeight={700} fill="#4B5563">
                {t.createDiagram.editor.fishbone.startHint}
              </text>
              <text x={layout.width / 2} y={layout.height / 2 + 14} textAnchor="middle" fontSize={12} fill="#6B7280">
                {t.createDiagram.editor.fishbone.startHintAction}
              </text>
            </g>
          )}
        </g>
      </svg>

      <div className="absolute top-3 left-3 max-w-[55%] px-3 py-2 rounded-lg bg-white/80 border border-pastel-blue/60 text-xs text-gray-700 overflow-hidden text-ellipsis">
        <p className="font-semibold truncate">{t.createDiagram.editor.fishbone.toolbarHint}</p>
      </div>

      {isEditable && (
        <div className="absolute top-3 right-3 flex items-center gap-2 px-2 py-2 rounded-xl bg-white/85 border border-pastel-blue/60 shadow-sm">
          <button
            type="button"
            onClick={addBone}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-pastel-yellow/70 hover:bg-pastel-yellow text-gray-800 text-xs font-semibold"
          >
            <PlusCircle size={14} /> {t.createDiagram.editor.fishbone.addCategory}
          </button>
          <button
            type="button"
            onClick={rebalanceSides}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-pastel-blue/55 hover:bg-pastel-blue/75 text-gray-800 text-xs font-semibold"
          >
            <LayoutGrid size={14} /> {t.createDiagram.editor.fishbone.rebalance}
          </button>
          <button
            type="button"
            onClick={autoArrange}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-pastel-pink/55 hover:bg-pastel-pink/75 text-gray-800 text-xs font-semibold"
          >
            <Sparkles size={14} /> {t.createDiagram.editor.fishbone.autoArrange}
          </button>
          <button
            type="button"
            onClick={resetView}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-pastel-blue/45 hover:bg-pastel-blue/65 text-gray-800 text-xs font-semibold"
          >
            <RotateCcw size={14} /> {t.createDiagram.editor.fishbone.resetView}
          </button>
        </div>
      )}

      <div className="absolute bottom-3 left-3 flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/80 border border-pastel-blue/60 text-xs text-gray-600">
        <span>{t.createDiagram.editor.fishbone.zoom}: {Math.round(zoom * 100)}%</span>
        <button type="button" onClick={zoomOut} className="px-2 py-0.5 rounded bg-pastel-blue/45 text-gray-700">-</button>
        <button type="button" onClick={zoomIn} className="px-2 py-0.5 rounded bg-pastel-blue/45 text-gray-700">+</button>
        <button
          type="button"
          onClick={resetView}
          className="px-2 py-0.5 rounded bg-pastel-pink/55 text-gray-700"
        >
          {t.createDiagram.editor.fishbone.resetView}
        </button>
      </div>

      <div className="absolute bottom-3 right-3 w-40 h-24 rounded-lg border border-pastel-blue/70 bg-white/80 overflow-hidden">
        <svg width="100%" height="100%" viewBox={`0 0 ${layout.width} ${layout.height}`}>
          <line
            x1={layout.spineStart.x}
            y1={layout.spineStart.y}
            x2={layout.spineEnd.x}
            y2={layout.spineEnd.y}
            stroke="#DD7BDF"
            strokeWidth={6}
            strokeLinecap="round"
          />
          {layout.boneLayouts.map((item) => (
            <line
              key={item.id}
              x1={item.base.x}
              y1={item.base.y}
              x2={item.end.x}
              y2={item.end.y}
              stroke="#B3BFFF"
              strokeWidth={4}
              strokeLinecap="round"
            />
          ))}
          <rect
            x={Math.max(0, (-pan.x / zoom))}
            y={Math.max(0, (-pan.y / zoom))}
            width={layout.width / zoom}
            height={layout.height / zoom}
            fill="none"
            stroke="#DD7BDF"
            strokeWidth={3}
            strokeDasharray="8 6"
          />
        </svg>
      </div>

      {context && isEditable && (
        <div
          className="fixed z-50 min-w-[170px] rounded-lg border border-pastel-blue bg-white shadow-lg"
          style={{ left: context.x + 8, top: context.y + 8 }}
        >
          <button
            className="w-full text-left px-3 py-2 text-sm hover:bg-pastel-blue/25"
            onClick={() => {
              addSubCause(context.target.boneId);
              setContext(null);
            }}
          >
            {t.createDiagram.editor.fishbone.addSubCause}
          </button>
          {context.target.type === 'sub' && context.target.subId && (
            <button
              className="w-full text-left px-3 py-2 text-sm hover:bg-pastel-pink/25"
              onClick={() => deleteSubCause(context.target.boneId, context.target.subId!)}
            >
              {t.createDiagram.editor.fishbone.deleteSubCause}
            </button>
          )}
          <button
            className="w-full text-left px-3 py-2 text-sm hover:bg-pastel-pink/25"
            onClick={() => deleteBone(context.target.boneId)}
          >
            {t.createDiagram.editor.fishbone.deleteCategory}
          </button>
        </div>
      )}
    </div>
  );
};
