import React from 'react';
import {
  SwotDiagram,
  FishboneDiagram,
  VennDiagram,
  MindMap,
  Flowchart,
  Timeline,
  PyramidDiagram,
  CauseEffectMatrix,
  ConceptMap,
  TChart,
} from '@/components/diagrams';
import { useLanguage } from '@/context/LanguageContext';
import { DiagramType, DiagramContent } from '@/types';
import { AlertCircle } from 'lucide-react';

// ---------------------------------------------------------------------------
// Performance guard – reject excessively large diagram content before render
// ---------------------------------------------------------------------------
const MAX_RENDER_CONTENT_SIZE = 100_000; // ~100 KB serialized

function isContentTooLarge(content: DiagramContent): boolean {
  try {
    return JSON.stringify(content).length > MAX_RENDER_CONTENT_SIZE;
  } catch {
    return true;
  }
}

function isContentEmpty(content: DiagramContent): boolean {
  if (!content || typeof content !== 'object') return true;
  const values = Object.values(content);
  if (values.length === 0) return true;
  return values.every((v) => {
    if (typeof v === 'string') return v.trim() === '';
    if (Array.isArray(v)) return v.length === 0 || v.every((s) => typeof s === 'string' && s.trim() === '');
    return !v;
  });
}

interface DiagramRendererProps {
  type: DiagramType;
  content: DiagramContent;
  isEditable?: boolean;
  onContentChange?: (content: DiagramContent) => void;
}

export const DiagramRenderer: React.FC<DiagramRendererProps> = ({
  type,
  content,
  isEditable = false,
  onContentChange,
}) => {
  const { t } = useLanguage();
  const props = { content, isEditable, onContentChange };

  // --- Performance guard ---
  if (isContentTooLarge(content)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500 dark:text-gray-400">
        <AlertCircle className="w-10 h-10 mb-3 text-pastel-purple" />
        <p className="font-semibold text-gray-700 dark:text-gray-300">Diagram content is too large to display</p>
        <p className="text-sm mt-1">Try reducing the amount of text in your diagram.</p>
      </div>
    );
  }

  // --- Empty state (only when not editing) ---
  if (!isEditable && isContentEmpty(content)) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center text-gray-400 dark:text-gray-500">
        <p className="font-medium">No diagram content yet.</p>
      </div>
    );
  }

  switch (type) {
    case 'swot':
      return <SwotDiagram {...props} />;
    case 'fishbone':
      return <FishboneDiagram {...props} />;
    case 'venn':
      return <VennDiagram {...props} />;
    case 'mindmap':
      return <MindMap {...props} />;
    case 'flowchart':
      return <Flowchart {...props} />;
    case 'timeline':
      return <Timeline {...props} />;
    case 'pyramid':
      return <PyramidDiagram {...props} />;
    case 'causeeffect':
      return <CauseEffectMatrix {...props} />;
    case 'conceptmap':
      return <ConceptMap {...props} />;
    case 'tchart':
      return <TChart {...props} />;
    default:
      return (
        <div className="flex flex-col items-center justify-center py-12 text-center text-gray-500">
          <AlertCircle className="w-8 h-8 mb-2 text-red-400" />
          <p>{t.createDiagram.editor.unknownDiagramType.replace('{type}', type)}</p>
        </div>
      );
  }
};
