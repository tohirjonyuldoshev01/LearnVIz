import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '@/context/LanguageContext';
import { FishboneSubBoneLayout } from './types';

interface SubBoneProps {
  layout: FishboneSubBoneLayout;
  text: string;
  isEditable: boolean;
  isHovered: boolean;
  isSelected: boolean;
  isEditing: boolean;
  onHover: (id: string | null) => void;
  onSelect: () => void;
  onStartEdit: () => void;
  onCommitEdit: (text: string) => void;
  onDelete: () => void;
  onContextMenu: (event: React.MouseEvent) => void;
  color?: string;
}

export const SubBone: React.FC<SubBoneProps> = ({
  layout,
  text,
  isEditable,
  isHovered,
  isSelected,
  isEditing,
  onHover,
  onSelect,
  onStartEdit,
  onCommitEdit,
  onDelete,
  onContextMenu,
  color = '#B3BFFF',
}) => {
  const { t } = useLanguage();
  const editorRef = React.useRef<HTMLDivElement | null>(null);
  const displayText =
    text === 'New sub-cause' || text === 'Sub-cause'
      ? t.createDiagram.editor.fishbone.defaultSubCause
      : text;

  React.useEffect(() => {
    if (isEditing && editorRef.current) {
      editorRef.current.textContent = displayText;
      editorRef.current.focus();
    }
  }, [displayText, isEditing]);

  const commit = () => {
    const value = editorRef.current?.textContent?.trim() || '';
    onCommitEdit(value);
  };

  const stroke = color;
  const width = isSelected ? 3.6 : isHovered ? 2.8 : 2.2;

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.2 }}
      onMouseEnter={() => onHover(layout.id)}
      onMouseLeave={() => onHover(null)}
      onClick={onSelect}
      onContextMenu={onContextMenu}
      style={{ transition: 'all 220ms ease' }}
    >
      <line
        x1={layout.start.x}
        y1={layout.start.y}
        x2={layout.end.x}
        y2={layout.end.y}
        stroke={color}
        strokeWidth={width}
      />

      {/* Decorative dot at the end that text sits near */}
      <circle cx={layout.end.x + 4} cy={layout.start.y} r={2} fill={color} />
      
      {/* Arrowhead pointed AT the category curve */}
      <polygon 
        points={`${layout.start.x},${layout.start.y} ${layout.start.x - 7},${layout.start.y - 4} ${layout.start.x - 7},${layout.start.y + 4}`} 
        fill={color} 
      />

      {isEditing ? (
        <foreignObject x={layout.label.x - 75} y={layout.label.y - 12} width={150} height={34}>
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
            className="w-full min-h-[30px] px-2 py-1 rounded-md border bg-white text-xs outline-none font-medium text-center"
            style={{ borderColor: color, color: color, fontFamily: 'ui-rounded, "Nunito", sans-serif' }}
          />
        </foreignObject>
      ) : (
        <text
          x={layout.label.x}
          y={layout.label.y}
          textAnchor="middle"
          fontSize={13}
          fill={color}
          stroke="#ffffff"
          strokeWidth={1}
          paintOrder="stroke"
          fontFamily="ui-rounded, 'Nunito', 'Arial Rounded MT Bold', sans-serif"
          className={isEditable ? 'cursor-text select-none transition-all' : 'select-none'}
          onDoubleClick={() => isEditable && onStartEdit()}
        >
          {displayText || t.createDiagram.editor.fishbone.defaultSubCause}
        </text>
      )}

      {isEditable && isHovered && (
        <g
          transform={`translate(${layout.start.x + 10}, ${layout.start.y - 20})`}
          className="cursor-pointer"
          onClick={onDelete}
        >
          <rect width={20} height={20} rx={10} fill="#FFBBE1" stroke="#DD7BDF" />
          <text x={10} y={14} textAnchor="middle" fontSize={11} fontWeight={700} fill="#DD7BDF">×</text>
        </g>
      )}
    </motion.g>
  );
};
