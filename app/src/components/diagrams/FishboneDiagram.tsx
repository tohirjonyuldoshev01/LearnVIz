import React from 'react';
import { DiagramContent } from '@/types';
import {
  createDefaultFishboneModel,
  deserializeFishboneContent,
  serializeFishboneContent,
} from './fishbone/adapter';
import { FishboneCanvas } from './fishbone/FishboneCanvas';
import { FishboneModel } from './fishbone/types';
import { GuidanceIntro, ShowExampleButton } from './shared';
import { getGuidance } from '@/lib/diagramGuidance';
import { useLanguage } from '@/context/LanguageContext';

interface FishboneDiagramProps {
  content: DiagramContent;
  isEditable?: boolean;
  onContentChange?: (content: DiagramContent) => void;
}

export const FishboneDiagram: React.FC<FishboneDiagramProps> = ({
  content,
  isEditable = false,
  onContentChange,
}) => {
  const { language } = useLanguage();
  const guidance = getGuidance('fishbone', language as 'en' | 'uz');
  const [model, setModel] = React.useState<FishboneModel>(() =>
    Object.keys(content).length ? deserializeFishboneContent(content) : createDefaultFishboneModel()
  );

  const lastEmittedExternalKeyRef = React.useRef<string>('');
  const lastModelSignatureRef = React.useRef<string>('');

  const externalKey = React.useMemo(() => {
    const serialized = typeof content.fishboneModel === 'string' ? content.fishboneModel : '';
    if (serialized) return serialized;
    return JSON.stringify({
      problem: content.problem || '',
      people: content.people || '',
      process: content.process || '',
      materials: content.materials || '',
      environment: content.environment || '',
      methods: content.methods || '',
    });
  }, [content.environment, content.fishboneModel, content.materials, content.methods, content.people, content.problem, content.process]);

  React.useEffect(() => {
    if (!externalKey) return;
    if (externalKey === lastEmittedExternalKeyRef.current) return;
    setModel(deserializeFishboneContent(content));
  }, [content, externalKey]);

  React.useEffect(() => {
    if (!onContentChange) return;

    const signature = JSON.stringify(model);
    if (signature === lastModelSignatureRef.current) return;

    const timeout = window.setTimeout(() => {
      const nextContent = serializeFishboneContent(model, content);
      const emittedKey = typeof nextContent.fishboneModel === 'string' ? nextContent.fishboneModel : '';

      lastModelSignatureRef.current = signature;
      lastEmittedExternalKeyRef.current = emittedKey;
      onContentChange(nextContent);
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
              onClear={() => onContentChange?.({ problem: '', people: '', process: '', materials: '', environment: '', methods: '' })}
            />
          </div>
        </>
      )}
      <FishboneCanvas model={model} isEditable={isEditable} onChange={setModel} />
    </div>
  );
};
