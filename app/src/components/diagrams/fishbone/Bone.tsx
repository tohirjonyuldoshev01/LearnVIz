import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { FishboneBone, FishboneBoneLayout } from './types';
import { SubBone } from './SubBone';

interface BoneProps {
  bone: FishboneBone;
  layout: FishboneBoneLayout;
  isEditable: boolean;
  isHovered: boolean;
  isSelected: boolean;
  hoveredSubId: string | null;
  selectedSubId: string | null;
  editingKey: string | null;
  onHover: (id: string | null) => void;
  onHoverSub: (id: string | null) => void;
  onSelect: (id: string) => void;
  onSelectSub: (id: string) => void;
  onStartEdit: (key: string) => void;
  onCommitBoneLabel: (boneId: string, value: string) => void;
  onCommitSubLabel: (boneId: string, subId: string, value: string) => void;
  onAddSubCause: (boneId: string) => void;
  onDeleteBone: (boneId: string) => void;
  onDeleteSubCause: (boneId: string, subId: string) => void;
  onDragBonePointerDown: (boneId: string, event: React.PointerEvent<SVGGElement>) => void;
  onContextMenu: (event: React.MouseEvent, target: { type: 'bone' | 'sub'; boneId: string; subId?: string }) => void;
  color?: string;
}

export const Bone: React.FC<BoneProps> = ({
  bone,
  layout,
  isEditable,
  isHovered,
  isSelected,
  hoveredSubId,
  selectedSubId,
  editingKey,
  onHover,
  onHoverSub,
  onSelect,
  onSelectSub,
  onStartEdit,
  onCommitBoneLabel,
  onCommitSubLabel,
  onAddSubCause,
  onDeleteBone,
  onDeleteSubCause,
  onDragBonePointerDown,
  onContextMenu,
  color = '#DD7BDF',
}) => {
  const { t } = useLanguage();
  const editorRef = React.useRef<HTMLDivElement | null>(null);
  const mapLabel = (value: string) => {
    const labels: Record<string, string> = {
      People: t.createDiagram.editor.fishbone.categories.people,
      Process: t.createDiagram.editor.fishbone.categories.process,
      Materials: t.createDiagram.editor.fishbone.categories.materials,
      Environment: t.createDiagram.editor.fishbone.categories.environment,
      Methods: t.createDiagram.editor.fishbone.categories.methods,
      Category: t.createDiagram.editor.fishbone.defaultCategory,
    };

    if (labels[value]) {
      return labels[value];
    }

    const match = value.match(/^Category\s+(\d+)$/);
    if (match) {
      return `${t.createDiagram.editor.fishbone.defaultCategory} ${match[1]}`;
    }

    return value;
  };

  React.useEffect(() => {
    if (editingKey === `bone:${bone.id}` && editorRef.current) {
      editorRef.current.textContent = mapLabel(bone.label);
      editorRef.current.focus();
    }
  }, [bone.id, bone.label, editingKey, t]);

  const boneEditKey = `bone:${bone.id}`;
  const stroke = color;
  const strokeWidth = isSelected ? 5.8 : isHovered ? 4.8 : 3.2;

  const commit = () => {
    const value = editorRef.current?.textContent?.trim() || '';
    onCommitBoneLabel(bone.id, value);
  };

  const actionAnchorX = layout.end.x + 15;
  const actionAnchorY = layout.end.y + (bone.side === 'top' ? 25 : -25);

  // Path data for curved ribs connecting to spine
  // Need to reproduce the exact control point used in layout computation for identical drawing
  const rawLength = Math.abs(layout.end.y - layout.base.y);
  const controlX = layout.base.x - rawLength * 0.15;
  const controlY = bone.side === 'top' 
    ? layout.base.y - rawLength * 0.6 
    : layout.base.y + rawLength * 0.6;
    
  const ribPath = `M ${layout.base.x} ${layout.base.y} Q ${controlX} ${controlY} ${layout.end.x} ${layout.end.y}`;

  return (
    <motion.g
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -6 }}
      transition={{ duration: 0.22 }}
      onMouseEnter={() => onHover(bone.id)}
      onMouseLeave={() => onHover(null)}
      onClick={() => onSelect(bone.id)}
      onContextMenu={(event) => onContextMenu(event, { type: 'bone', boneId: bone.id })}
      style={{ transition: 'all 220ms ease' }}
    >
      <path
        d={ribPath}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        fill="none"
      />

      {isSelected && (
        <path
          d={ribPath}
          stroke={color}
          strokeOpacity={0.26}
          strokeWidth={12}
          strokeLinecap="round"
          fill="none"
        />
      )}
      
      {isHovered && !isSelected && (
        <path
          d={ribPath}
          stroke={color}
          strokeOpacity={0.16}
          strokeWidth={10}
          strokeLinecap="round"
          fill="none"
        />
      )}

      {/* Node at the end of the diagonal line */}
      <circle
        cx={layout.end.x}
        cy={layout.end.y}
        r={7}
        fill={color}
        className="cursor-pointer transition-transform duration-200 hover:scale-125"
      />

      {editingKey === boneEditKey ? (
        <foreignObject x={layout.label.x - 82} y={layout.label.y - 20} width={178} height={38}>
          <div
            ref={editorRef}
            contentEditable
            suppressContentEditableWarning
            onBlur={commit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                commit();
              }
            }}
            className="w-full min-h-[34px] px-2 py-1 rounded-md border text-sm outline-none bg-white/90 font-medium text-center"
            style={{ borderColor: color, color: color, fontFamily: 'ui-rounded, "Nunito", sans-serif' }}
          />
        </foreignObject>
      ) : (
        <text
          x={layout.label.x}
          y={layout.label.y}
          textAnchor="middle"
          fontSize={15}
          fontWeight={700}
          fill={color}
          stroke="#ffffff"
          strokeWidth={1.2}
          paintOrder="stroke"
          letterSpacing={0.2}
          fontFamily="ui-rounded, 'Nunito', 'Arial Rounded MT Bold', sans-serif"
          className={isEditable ? 'cursor-text select-none' : 'select-none'}
          onDoubleClick={() => isEditable && onStartEdit(boneEditKey)}
        >
          {mapLabel(bone.label || 'Category')}
        </text>
      )}

      <AnimatePresence>
        {bone.subCauses.map((subCause) => {
          const subLayout = layout.subBones.find((sub) => sub.id === subCause.id);
          if (!subLayout) return null;

          const subEditKey = `sub:${bone.id}:${subCause.id}`;

          return (
            <SubBone
              key={subCause.id}
              layout={subLayout}
              text={subCause.text}
              isEditable={isEditable}
              isHovered={hoveredSubId === subCause.id}
              isSelected={selectedSubId === subCause.id}
              isEditing={editingKey === subEditKey}
              onHover={onHoverSub}
              onSelect={() => onSelectSub(subCause.id)}
              onStartEdit={() => onStartEdit(subEditKey)}
              onCommitEdit={(value) => onCommitSubLabel(bone.id, subCause.id, value)}
              onDelete={() => onDeleteSubCause(bone.id, subCause.id)}
              onContextMenu={(event) =>
                onContextMenu(event, { type: 'sub', boneId: bone.id, subId: subCause.id })
              }
              color={color}
            />
          );
        })}
      </AnimatePresence>

      {isEditable && isHovered && (
        <>
          <g
            transform={`translate(${layout.base.x - 10}, ${layout.base.y - 10})`}
            onPointerDown={(event) => onDragBonePointerDown(bone.id, event)}
            className="cursor-grab"
          >
            <rect width={20} height={20} rx={10} fill="#B3BFFF" stroke="#DD7BDF" />
            <text x={10} y={14} textAnchor="middle" fontSize={10} fill="#DD7BDF">⋮</text>
          </g>

          <g
            transform={`translate(${actionAnchorX - 10}, ${actionAnchorY - 10})`}
            className="cursor-pointer"
            onClick={() => onAddSubCause(bone.id)}
          >
            <rect width={20} height={20} rx={10} fill="#FFF58A" stroke="#DD7BDF" />
            <text x={10} y={14} textAnchor="middle" fontSize={12} fontWeight={700} fill="#DD7BDF">+</text>
          </g>

          <g
            transform={`translate(${actionAnchorX + 15}, ${actionAnchorY - 10})`}
            className="cursor-pointer"
            onClick={() => onDeleteBone(bone.id)}
          >
            <rect width={20} height={20} rx={10} fill="#FFBBE1" stroke="#DD7BDF" />
            <text x={10} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#DD7BDF">×</text>
          </g>
        </>
      )}
    </motion.g>
  );
};
