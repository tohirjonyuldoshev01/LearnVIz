'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { PlusCircle, RotateCcw, Sparkles, ZoomIn, ZoomOut } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { ConceptMapModel } from './types';
import { createNode, createConnection } from './adapter';

/* ── Constants ── */
const NODE_W = 152;
const NODE_H = 52;
const NODE_RX = 26;
const HANDLE_R = 6;

const NODE_COLORS = [
  { fill: '#DBEAFE', stroke: '#3B82F6', text: '#1E40AF' },
  { fill: '#D1FAE5', stroke: '#10B981', text: '#065F46' },
  { fill: '#FEF3C7', stroke: '#F59E0B', text: '#92400E' },
  { fill: '#EDE9FE', stroke: '#8B5CF6', text: '#5B21B6' },
  { fill: '#FCE7F3', stroke: '#EC4899', text: '#9D174D' },
  { fill: '#CFFAFE', stroke: '#06B6D4', text: '#155E75' },
  { fill: '#FEE2E2', stroke: '#F43F5E', text: '#9F1239' },
  { fill: '#CCFBF1', stroke: '#14B8A6', text: '#134E4A' },
];

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

/** Compute the point on a node's elliptical boundary facing a target point */
function edgePoint(nx: number, ny: number, tx: number, ty: number) {
  const dx = tx - nx;
  const dy = ty - ny;
  if (dx === 0 && dy === 0) return { x: nx + NODE_W / 2, y: ny };
  const angle = Math.atan2(dy, dx);
  return {
    x: nx + (NODE_W / 2 + 4) * Math.cos(angle),
    y: ny + (NODE_H / 2 + 4) * Math.sin(angle),
  };
}

/* ── Interaction state types ── */
type DragState = { nodeId: string; sx: number; sy: number; nx: number; ny: number } | null;
type PanState = { sx: number; sy: number; px: number; py: number } | null;
type ConnState = { fromId: string; x: number; y: number } | null;

/* ── Props ── */
interface ConceptMapCanvasProps {
  model: ConceptMapModel;
  isEditable: boolean;
  onChange: (m: ConceptMapModel) => void;
}

export const ConceptMapCanvas: React.FC<ConceptMapCanvasProps> = ({ model, isEditable, onChange }) => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const [size, setSize] = useState({ w: 1200, h: 560 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });

  const [drag, setDrag] = useState<DragState>(null);
  const [panDrag, setPanDrag] = useState<PanState>(null);
  const [conn, setConn] = useState<ConnState>(null);

  const [selNode, setSelNode] = useState<string | null>(null);
  const [selConn, setSelConn] = useState<string | null>(null);
  const [editNode, setEditNode] = useState<string | null>(null);
  const [editConn, setEditConn] = useState<string | null>(null);
  const [hoverNode, setHoverNode] = useState<string | null>(null);

  /* ── Resize observer ── */
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const obs = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (!rect) return;
      setSize({ w: Math.max(rect.width - 12, 800), h: Math.max(rect.height - 12, 480) });
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  /* ── SVG coordinate helper ── */
  const toSvg = useCallback(
    (clientX: number, clientY: number) => {
      const r = svgRef.current?.getBoundingClientRect();
      if (!r) return { x: 0, y: 0 };
      return {
        x: (clientX - r.left - pan.x) / zoom,
        y: (clientY - r.top - pan.y) / zoom,
      };
    },
    [pan.x, pan.y, zoom],
  );

  /* ── Global pointer handlers for drag / pan / connect ── */
  useEffect(() => {
    if (!drag && !panDrag && !conn) return;

    const onMove = (e: PointerEvent) => {
      if (drag) {
        const dx = (e.clientX - drag.sx) / zoom;
        const dy = (e.clientY - drag.sy) / zoom;
        onChange({
          ...model,
          nodes: model.nodes.map((n) =>
            n.id === drag.nodeId ? { ...n, x: drag.nx + dx, y: drag.ny + dy } : n,
          ),
        });
      } else if (panDrag) {
        setPan({
          x: panDrag.px + e.clientX - panDrag.sx,
          y: panDrag.py + e.clientY - panDrag.sy,
        });
      } else if (conn) {
        const p = toSvg(e.clientX, e.clientY);
        setConn((prev) => (prev ? { ...prev, x: p.x, y: p.y } : null));
      }
    };

    const onUp = (e: PointerEvent) => {
      if (conn) {
        const p = toSvg(e.clientX, e.clientY);
        const target = model.nodes.find(
          (n) =>
            n.id !== conn.fromId &&
            Math.abs(p.x - n.x) < NODE_W / 2 + 14 &&
            Math.abs(p.y - n.y) < NODE_H / 2 + 14,
        );
        if (target) {
          const dup = model.connections.some(
            (c) =>
              (c.fromId === conn.fromId && c.toId === target.id) ||
              (c.fromId === target.id && c.toId === conn.fromId),
          );
          if (!dup) {
            onChange({
              ...model,
              connections: [...model.connections, createConnection(conn.fromId, target.id, '')],
            });
          }
        }
        setConn(null);
      }
      setDrag(null);
      setPanDrag(null);
    };

    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    return () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, [drag, panDrag, conn, model, onChange, zoom, toSvg]);

  /* ── Model mutation helpers ── */
  const addNode = () => {
    const angle = ((model.nodes.length * 67 + 30) * Math.PI) / 180;
    const r = 200;
    const cx = size.w / 2;
    const cy = size.h / 2;
    const newNode = createNode(
      t.createDiagram?.editor?.conceptMap?.newConcept || 'New Concept',
      cx + r * Math.cos(angle),
      cy + r * Math.sin(angle),
      model.nodes.length % NODE_COLORS.length,
    );
    onChange({ ...model, nodes: [...model.nodes, newNode] });
  };

  const deleteNode = useCallback(
    (nodeId: string) => {
      onChange({
        ...model,
        nodes: model.nodes.filter((n) => n.id !== nodeId),
        connections: model.connections.filter(
          (c) => c.fromId !== nodeId && c.toId !== nodeId,
        ),
      });
      setSelNode(null);
    },
    [model, onChange],
  );

  const deleteConnection = useCallback(
    (connId: string) => {
      onChange({
        ...model,
        connections: model.connections.filter((c) => c.id !== connId),
      });
      setSelConn(null);
    },
    [model, onChange],
  );

  const updateNodeText = (nodeId: string, text: string) => {
    onChange({
      ...model,
      nodes: model.nodes.map((n) => (n.id === nodeId ? { ...n, text } : n)),
    });
    setEditNode(null);
  };

  const updateConnLabel = (connId: string, label: string) => {
    onChange({
      ...model,
      connections: model.connections.map((c) => (c.id === connId ? { ...c, label } : c)),
    });
    setEditConn(null);
  };

  /* ── View controls ── */
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    setZoom((z) => clamp(z + (e.deltaY > 0 ? -0.08 : 0.08), 0.35, 2.2));
  };

  const zoomIn = () => setZoom((z) => clamp(z + 0.12, 0.35, 2.2));
  const zoomOut = () => setZoom((z) => clamp(z - 0.12, 0.35, 2.2));

  const resetView = useCallback(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, []);

  const autoLayout = () => {
    const cx = size.w / 2;
    const cy = size.h / 2;
    const n = model.nodes.length;
    if (n === 0) return;
    if (n === 1) {
      onChange({ ...model, nodes: [{ ...model.nodes[0], x: cx, y: cy }] });
      resetView();
      return;
    }
    const arranged = model.nodes.map((nd, i) => {
      if (i === 0) return { ...nd, x: cx, y: cy };
      const a = ((i - 1) / (n - 1)) * 2 * Math.PI - Math.PI / 2;
      const r = Math.min(cx, cy) * 0.48;
      return { ...nd, x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
    });
    onChange({ ...model, nodes: arranged });
    resetView();
  };

  /* ── Keyboard ── */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelNode(null);
        setSelConn(null);
        setEditNode(null);
        setEditConn(null);
        setConn(null);
      }
      if (e.key === 'Delete' && !editNode && !editConn && isEditable) {
        if (selNode) deleteNode(selNode);
        else if (selConn) deleteConnection(selConn);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selNode, selConn, editNode, editConn, isEditable, deleteNode, deleteConnection]);

  /* ── Render ── */
  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-[520px] rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-slate-50 to-blue-50/30 dark:from-gray-900 dark:to-gray-800 shadow-sm overflow-hidden"
      onClick={() => {
        setSelNode(null);
        setSelConn(null);
      }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height={Math.max(size.h, 500)}
        viewBox={`0 0 ${size.w} ${size.h}`}
        onWheel={onWheel}
        className="select-none"
      >
        <defs>
          <marker id="cm-arrow" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
            <polygon points="0 0, 10 4, 0 8" fill="#94A3B8" />
          </marker>
          <marker id="cm-arrow-sel" markerWidth="10" markerHeight="8" refX="9" refY="4" orient="auto">
            <polygon points="0 0, 10 4, 0 8" fill="#6366F1" />
          </marker>
          <filter id="cm-shadow" x="-8%" y="-8%" width="116%" height="128%">
            <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.07" />
          </filter>
          <pattern id="cm-grid" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="12" cy="12" r="0.7" fill="#CBD5E1" opacity="0.5" />
          </pattern>
        </defs>

        <g
          transform={`translate(${pan.x}, ${pan.y}) scale(${zoom})`}
          style={{ transition: drag || panDrag || conn ? 'none' : 'transform 150ms ease' }}
        >
          {/* Background for pan + grid */}
          <rect
            x={-3000}
            y={-3000}
            width={size.w + 6000}
            height={size.h + 6000}
            fill="url(#cm-grid)"
            onPointerDown={(e) => {
              if (!isEditable) return;
              e.stopPropagation();
              setPanDrag({ sx: e.clientX, sy: e.clientY, px: pan.x, py: pan.y });
              setSelNode(null);
              setSelConn(null);
            }}
          />

          {/* ── Connections ── */}
          {model.connections.map((c) => {
            const from = model.nodes.find((n) => n.id === c.fromId);
            const to = model.nodes.find((n) => n.id === c.toId);
            if (!from || !to) return null;

            const p1 = edgePoint(from.x, from.y, to.x, to.y);
            const p2 = edgePoint(to.x, to.y, from.x, from.y);
            const mx = (p1.x + p2.x) / 2;
            const my = (p1.y + p2.y) / 2;
            const isSel = selConn === c.id;

            return (
              <g key={c.id}>
                {/* Click target (wider invisible line) */}
                <line
                  x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke="transparent"
                  strokeWidth={14}
                  className="cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelConn(c.id);
                    setSelNode(null);
                  }}
                />
                {/* Visible line */}
                <line
                  x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y}
                  stroke={isSel ? '#6366F1' : '#94A3B8'}
                  strokeWidth={isSel ? 2.8 : 2}
                  markerEnd={isSel ? 'url(#cm-arrow-sel)' : 'url(#cm-arrow)'}
                  pointerEvents="none"
                />

                {/* Label */}
                {editConn === c.id ? (
                  <foreignObject x={mx - 65} y={my - 16} width={130} height={30}>
                    <input
                      autoFocus
                      type="text"
                      defaultValue={c.label}
                      className="w-full h-full text-xs text-center bg-white border border-indigo-300 rounded-lg px-2 outline-none shadow-sm"
                      onBlur={(e) => updateConnLabel(c.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter')
                          updateConnLabel(c.id, (e.target as HTMLInputElement).value);
                      }}
                    />
                  </foreignObject>
                ) : (
                  <g
                    className={isEditable ? 'cursor-pointer' : ''}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelConn(c.id);
                      setSelNode(null);
                    }}
                    onDoubleClick={() => isEditable && setEditConn(c.id)}
                  >
                    {/* Label background pill */}
                    {c.label && (
                      <rect
                        x={mx - 42}
                        y={my - 18}
                        width={84}
                        height={20}
                        rx={10}
                        fill="white"
                        stroke={isSel ? '#6366F1' : '#E2E8F0'}
                        strokeWidth={1}
                        opacity={0.92}
                      />
                    )}
                    <text
                      x={mx}
                      y={my - 5}
                      textAnchor="middle"
                      fontSize={10.5}
                      fill={isSel ? '#4F46E5' : '#64748B'}
                      fontWeight={isSel ? 600 : 500}
                      fontStyle="italic"
                    >
                      {c.label
                        ? c.label.length > 14
                          ? c.label.slice(0, 12) + '…'
                          : c.label
                        : isEditable
                          ? '...'
                          : ''}
                    </text>
                  </g>
                )}

                {/* Delete badge for selected connection */}
                {isSel && isEditable && (
                  <g
                    transform={`translate(${mx + 50}, ${my - 16})`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteConnection(c.id);
                    }}
                  >
                    <circle r={9} fill="#FEE2E2" stroke="#F43F5E" strokeWidth={1.5} />
                    <text textAnchor="middle" fontSize={12} fontWeight={700} fill="#F43F5E" y={4}>
                      ×
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* ── Temp connection line ── */}
          {conn && (() => {
            const fromNode = model.nodes.find((n) => n.id === conn.fromId);
            if (!fromNode) return null;
            return (
              <line
                x1={fromNode.x}
                y1={fromNode.y}
                x2={conn.x}
                y2={conn.y}
                stroke="#6366F1"
                strokeWidth={2}
                strokeDasharray="6 4"
                pointerEvents="none"
              />
            );
          })()}

          {/* ── Nodes ── */}
          {model.nodes.map((node, idx) => {
            const color = NODE_COLORS[node.colorIndex % NODE_COLORS.length];
            const isSel = selNode === node.id;
            const isHov = hoverNode === node.id;
            const isFirst = idx === 0;

            return (
              <g
                key={node.id}
                onMouseEnter={() => setHoverNode(node.id)}
                onMouseLeave={() => setHoverNode(null)}
              >
                {/* Selection glow */}
                {isSel && (
                  <rect
                    x={node.x - NODE_W / 2 - 4}
                    y={node.y - NODE_H / 2 - 4}
                    width={NODE_W + 8}
                    height={NODE_H + 8}
                    rx={NODE_RX + 4}
                    fill="none"
                    stroke="#6366F1"
                    strokeWidth={2}
                    strokeDasharray="4 3"
                    opacity={0.5}
                  />
                )}

                {/* Node body */}
                <rect
                  x={node.x - NODE_W / 2}
                  y={node.y - NODE_H / 2}
                  width={NODE_W}
                  height={NODE_H}
                  rx={NODE_RX}
                  fill={color.fill}
                  stroke={isSel ? '#6366F1' : color.stroke}
                  strokeWidth={isSel ? 3 : isFirst ? 2.5 : 1.8}
                  filter="url(#cm-shadow)"
                  className={isEditable ? 'cursor-grab active:cursor-grabbing' : 'cursor-default'}
                  onPointerDown={(e) => {
                    if (!isEditable) return;
                    e.stopPropagation();
                    setSelNode(node.id);
                    setSelConn(null);
                    setDrag({
                      nodeId: node.id,
                      sx: e.clientX,
                      sy: e.clientY,
                      nx: node.x,
                      ny: node.y,
                    });
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelNode(node.id);
                    setSelConn(null);
                  }}
                  onDoubleClick={() => isEditable && setEditNode(node.id)}
                />

                {/* First-node marker ring */}
                {isFirst && (
                  <rect
                    x={node.x - NODE_W / 2 + 3}
                    y={node.y - NODE_H / 2 + 3}
                    width={NODE_W - 6}
                    height={NODE_H - 6}
                    rx={NODE_RX - 3}
                    fill="none"
                    stroke={color.stroke}
                    strokeWidth={1}
                    opacity={0.35}
                    pointerEvents="none"
                  />
                )}

                {/* Text or editor */}
                {editNode === node.id ? (
                  <foreignObject
                    x={node.x - NODE_W / 2 + 6}
                    y={node.y - NODE_H / 2 + 6}
                    width={NODE_W - 12}
                    height={NODE_H - 12}
                  >
                    <input
                      autoFocus
                      type="text"
                      defaultValue={node.text}
                      className="w-full h-full text-sm text-center bg-transparent border-none outline-none font-semibold"
                      style={{ color: color.text }}
                      onBlur={(e) => updateNodeText(node.id, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter')
                          updateNodeText(node.id, (e.target as HTMLInputElement).value);
                      }}
                    />
                  </foreignObject>
                ) : (
                  <text
                    x={node.x}
                    y={node.y + 1}
                    textAnchor="middle"
                    dominantBaseline="central"
                    fontSize={isFirst ? 14 : 12.5}
                    fontWeight={isFirst ? 700 : 600}
                    fill={color.text}
                    pointerEvents="none"
                    style={{ fontFamily: 'ui-rounded, "Nunito", system-ui, sans-serif' }}
                  >
                    {node.text.length > 20 ? node.text.slice(0, 18) + '…' : node.text}
                  </text>
                )}

                {/* Connector handles (visible on hover / selection) */}
                {isEditable && (isHov || isSel) && !editNode && (
                  <>
                    {[
                      { cx: node.x + NODE_W / 2, cy: node.y },
                      { cx: node.x - NODE_W / 2, cy: node.y },
                      { cx: node.x, cy: node.y - NODE_H / 2 },
                      { cx: node.x, cy: node.y + NODE_H / 2 },
                    ].map((h, i) => (
                      <circle
                        key={i}
                        cx={h.cx}
                        cy={h.cy}
                        r={HANDLE_R}
                        fill="white"
                        stroke="#6366F1"
                        strokeWidth={2}
                        className="cursor-crosshair"
                        onPointerDown={(e) => {
                          e.stopPropagation();
                          setConn({ fromId: node.id, x: h.cx, y: h.cy });
                        }}
                      />
                    ))}
                  </>
                )}

                {/* Delete badge */}
                {isSel && isEditable && !editNode && (
                  <g
                    transform={`translate(${node.x + NODE_W / 2 - 2}, ${node.y - NODE_H / 2 - 2})`}
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteNode(node.id);
                    }}
                  >
                    <circle r={10} fill="#FEE2E2" stroke="#F43F5E" strokeWidth={1.5} />
                    <text textAnchor="middle" fontSize={13} fontWeight={700} fill="#F43F5E" y={4.5}>
                      ×
                    </text>
                  </g>
                )}
              </g>
            );
          })}

          {/* Empty-state hint */}
          {model.nodes.length === 0 && isEditable && (
            <g>
              <rect
                x={size.w / 2 - 160}
                y={size.h / 2 - 32}
                width={320}
                height={64}
                rx={14}
                fill="#ffffffcc"
                stroke="#C7D2FE"
              />
              <text
                x={size.w / 2}
                y={size.h / 2 + 5}
                textAnchor="middle"
                fontSize={14}
                fontWeight={600}
                fill="#4B5563"
              >
                {t.createDiagram?.editor?.conceptMap?.addNode || 'Add your first concept'}
              </text>
            </g>
          )}
        </g>
      </svg>

      {/* ── Hint overlay ── */}
      <div className="absolute bottom-3 left-3 max-w-[60%] px-3 py-1.5 rounded-lg bg-white/80 dark:bg-gray-800/80 border border-blue-100 dark:border-gray-600 text-[11px] text-gray-500 dark:text-gray-400 backdrop-blur-sm pointer-events-none">
        {isEditable
          ? (t.createDiagram?.editor?.conceptMap?.dragHint || 'Drag nodes to move · Drag handles to connect · Double-click to edit')
          : (t.createDiagram?.editor?.conceptMap?.viewHint || 'Click nodes to explore')}
      </div>

      {/* ── Toolbar ── */}
      {isEditable && (
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2 py-1.5 rounded-xl bg-white/85 dark:bg-gray-800/85 border border-blue-100 dark:border-gray-600 shadow-sm backdrop-blur-sm">
          <button
            type="button"
            onClick={addNode}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 dark:bg-blue-900/40 dark:hover:bg-blue-900/60 text-blue-700 dark:text-blue-300 text-xs font-semibold transition-colors"
          >
            <PlusCircle size={14} />
            {t.createDiagram?.editor?.conceptMap?.addNode || 'Add Concept'}
          </button>
          <button
            type="button"
            onClick={autoLayout}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-50 hover:bg-purple-100 dark:bg-purple-900/40 dark:hover:bg-purple-900/60 text-purple-700 dark:text-purple-300 text-xs font-semibold transition-colors"
          >
            <Sparkles size={14} />
            {t.createDiagram?.editor?.conceptMap?.autoLayout || 'Auto Layout'}
          </button>
          <button
            type="button"
            onClick={resetView}
            className="inline-flex items-center gap-1 px-2 py-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 dark:text-gray-300 text-xs font-semibold transition-colors"
          >
            <RotateCcw size={13} />
          </button>
          <div className="flex items-center gap-0.5 ml-1">
            <button
              type="button"
              onClick={zoomOut}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
            >
              <ZoomOut size={14} />
            </button>
            <span className="text-[10px] text-gray-400 w-8 text-center tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
            <button
              type="button"
              onClick={zoomIn}
              className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-500 transition-colors"
            >
              <ZoomIn size={14} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
