'use client';

import React from 'react';
import { DiagramContent } from '@/types';
import {
  createDefaultModel,
  deserializeContent,
  serializeContent,
} from './conceptmap/adapter';
import { ConceptMapCanvas } from './conceptmap/ConceptMapCanvas';
import { ConceptMapModel } from './conceptmap/types';
import { GuidanceIntro, ShowExampleButton } from './shared';
import { getGuidance } from '@/lib/diagramGuidance';
import { useLanguage } from '@/context/LanguageContext';

interface ConceptMapProps {
  content: DiagramContent;
  isEditable?: boolean;
  onContentChange?: (content: DiagramContent) => void;
}

export const ConceptMap: React.FC<ConceptMapProps> = ({
  content,
  isEditable = false,
  onContentChange,
}) => {
  const { language } = useLanguage();
  const guidance = getGuidance('conceptmap', language as 'en' | 'uz');
  const [model, setModel] = React.useState<ConceptMapModel>(() =>
    Object.keys(content).length ? deserializeContent(content) : createDefaultModel(),
  );

  const lastEmittedKeyRef = React.useRef<string>('');
  const lastModelSigRef = React.useRef<string>('');

  // Derive a key from external content to detect outside changes
  const externalKey = React.useMemo(() => {
    if (content.conceptMapModel && typeof content.conceptMapModel === 'string')
      return content.conceptMapModel;
    return JSON.stringify({
      concept1: content.concept1 || '',
      concept2: content.concept2 || '',
      relationship: content.relationship || '',
      details: content.details || '',
    });
  }, [content.concept1, content.concept2, content.conceptMapModel, content.details, content.relationship]);

  // Sync inbound content → model
  React.useEffect(() => {
    if (!externalKey) return;
    if (externalKey === lastEmittedKeyRef.current) return;
    setModel(deserializeContent(content));
  }, [content, externalKey]);

  // Sync model → outbound content
  React.useEffect(() => {
    if (!onContentChange) return;
    const sig = JSON.stringify(model);
    if (sig === lastModelSigRef.current) return;

    const timeout = window.setTimeout(() => {
      const next = serializeContent(model, content);
      const emittedKey =
        typeof next.conceptMapModel === 'string' ? next.conceptMapModel : '';

      lastModelSigRef.current = sig;
      lastEmittedKeyRef.current = emittedKey;
      onContentChange(next);
    }, 90);

    return () => window.clearTimeout(timeout);
  }, [content, model, onContentChange]);

  return (
    <div className="p-4 sm:p-6">
      {isEditable && (
        <>
          <GuidanceIntro intro={guidance.intro} steps={guidance.steps} />
          <div className="flex justify-end mb-3">
            <ShowExampleButton
              label={language === 'uz' ? 'Namuna ko\'rish' : 'Show Example'}
              clearLabel={language === 'uz' ? "Namunani o'chirish" : 'Clear Example'}
              onFill={() => onContentChange?.(guidance.exampleContent)}
              onClear={() => onContentChange?.({ concept1: '', relationship: '', concept2: '', details: '' })}
            />
          </div>
        </>
      )}
      <ConceptMapCanvas model={model} isEditable={isEditable} onChange={setModel} />
    </div>
  );
};
