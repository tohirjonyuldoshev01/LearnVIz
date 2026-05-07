import React from 'react';
import { motion } from 'framer-motion';
import { Check, Sparkles } from 'lucide-react';
import { DiagramType } from '@/types';
import { DiagramIllustrations } from './DiagramIllustrations';

interface DiagramCardProps {
  type: DiagramType;
  name: string;
  description: string;
  icon: string;
  isSelected: boolean;
  onClick: () => void;
  index: number;
}

const DIAGRAM_THEMES: Record<DiagramType, {
  gradient: string;
  iconBg: string;
  hoverGradient: string;
  selectedGradient: string;
  borderColor: string;
  accentColor: string;
  glowColor: string;
  ringColor: string;
}> = {
  swot: {
    gradient: 'from-blue-50/80 via-indigo-50/60 to-sky-50/80 dark:from-blue-950/50 dark:via-indigo-950/40 dark:to-sky-950/50',
    iconBg: 'bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-500 dark:from-blue-500 dark:to-indigo-600',
    hoverGradient: 'from-blue-100 to-indigo-100 dark:from-blue-800/40 dark:to-indigo-800/40',
    selectedGradient: 'from-blue-100/90 via-indigo-100/80 to-sky-100/90 dark:from-blue-900/60 dark:via-indigo-900/50 dark:to-sky-900/60',
    borderColor: 'border-blue-200/60 dark:border-blue-700/40',
    accentColor: 'from-blue-400 to-indigo-500',
    glowColor: 'shadow-blue-200/50 dark:shadow-blue-800/30',
    ringColor: 'ring-blue-400/50',
  },
  fishbone: {
    gradient: 'from-teal-50/80 via-cyan-50/60 to-emerald-50/80 dark:from-teal-950/50 dark:via-cyan-950/40 dark:to-emerald-950/50',
    iconBg: 'bg-gradient-to-br from-teal-400 via-teal-500 to-cyan-500 dark:from-teal-500 dark:to-cyan-600',
    hoverGradient: 'from-teal-100 to-cyan-100 dark:from-teal-800/40 dark:to-cyan-800/40',
    selectedGradient: 'from-teal-100/90 via-cyan-100/80 to-emerald-100/90 dark:from-teal-900/60 dark:via-cyan-900/50 dark:to-emerald-900/60',
    borderColor: 'border-teal-200/60 dark:border-teal-700/40',
    accentColor: 'from-teal-400 to-cyan-500',
    glowColor: 'shadow-teal-200/50 dark:shadow-teal-800/30',
    ringColor: 'ring-teal-400/50',
  },
  venn: {
    gradient: 'from-purple-50/80 via-fuchsia-50/60 to-pink-50/80 dark:from-purple-950/50 dark:via-fuchsia-950/40 dark:to-pink-950/50',
    iconBg: 'bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500 dark:from-purple-500 dark:to-pink-600',
    hoverGradient: 'from-purple-100 to-pink-100 dark:from-purple-800/40 dark:to-pink-800/40',
    selectedGradient: 'from-purple-100/90 via-fuchsia-100/80 to-pink-100/90 dark:from-purple-900/60 dark:via-fuchsia-900/50 dark:to-pink-900/60',
    borderColor: 'border-purple-200/60 dark:border-purple-700/40',
    accentColor: 'from-purple-400 to-pink-500',
    glowColor: 'shadow-purple-200/50 dark:shadow-purple-800/30',
    ringColor: 'ring-purple-400/50',
  },
  mindmap: {
    gradient: 'from-green-50/80 via-emerald-50/60 to-teal-50/80 dark:from-green-950/50 dark:via-emerald-950/40 dark:to-teal-950/50',
    iconBg: 'bg-gradient-to-br from-green-400 via-emerald-500 to-teal-500 dark:from-green-500 dark:to-emerald-600',
    hoverGradient: 'from-green-100 to-emerald-100 dark:from-green-800/40 dark:to-emerald-800/40',
    selectedGradient: 'from-green-100/90 via-emerald-100/80 to-teal-100/90 dark:from-green-900/60 dark:via-emerald-900/50 dark:to-teal-900/60',
    borderColor: 'border-green-200/60 dark:border-green-700/40',
    accentColor: 'from-green-400 to-emerald-500',
    glowColor: 'shadow-green-200/50 dark:shadow-green-800/30',
    ringColor: 'ring-green-400/50',
  },
  flowchart: {
    gradient: 'from-amber-50/80 via-orange-50/60 to-yellow-50/80 dark:from-amber-950/50 dark:via-orange-950/40 dark:to-yellow-950/50',
    iconBg: 'bg-gradient-to-br from-amber-400 via-orange-500 to-yellow-500 dark:from-amber-500 dark:to-orange-600',
    hoverGradient: 'from-amber-100 to-orange-100 dark:from-amber-800/40 dark:to-orange-800/40',
    selectedGradient: 'from-amber-100/90 via-orange-100/80 to-yellow-100/90 dark:from-amber-900/60 dark:via-orange-900/50 dark:to-yellow-900/60',
    borderColor: 'border-amber-200/60 dark:border-amber-700/40',
    accentColor: 'from-amber-400 to-orange-500',
    glowColor: 'shadow-amber-200/50 dark:shadow-amber-800/30',
    ringColor: 'ring-amber-400/50',
  },
  timeline: {
    gradient: 'from-rose-50/80 via-pink-50/60 to-red-50/80 dark:from-rose-950/50 dark:via-pink-950/40 dark:to-red-950/50',
    iconBg: 'bg-gradient-to-br from-rose-400 via-pink-500 to-red-500 dark:from-rose-500 dark:to-red-600',
    hoverGradient: 'from-rose-100 to-red-100 dark:from-rose-800/40 dark:to-red-800/40',
    selectedGradient: 'from-rose-100/90 via-pink-100/80 to-red-100/90 dark:from-rose-900/60 dark:via-pink-900/50 dark:to-red-900/60',
    borderColor: 'border-rose-200/60 dark:border-rose-700/40',
    accentColor: 'from-rose-400 to-red-500',
    glowColor: 'shadow-rose-200/50 dark:shadow-rose-800/30',
    ringColor: 'ring-rose-400/50',
  },
  pyramid: {
    gradient: 'from-yellow-50/80 via-amber-50/60 to-orange-50/80 dark:from-yellow-950/50 dark:via-amber-950/40 dark:to-orange-950/50',
    iconBg: 'bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 dark:from-yellow-500 dark:to-amber-600',
    hoverGradient: 'from-yellow-100 to-amber-100 dark:from-yellow-800/40 dark:to-amber-800/40',
    selectedGradient: 'from-yellow-100/90 via-amber-100/80 to-orange-100/90 dark:from-yellow-900/60 dark:via-amber-900/50 dark:to-orange-900/60',
    borderColor: 'border-yellow-200/60 dark:border-yellow-700/40',
    accentColor: 'from-yellow-400 to-amber-500',
    glowColor: 'shadow-yellow-200/50 dark:shadow-yellow-800/30',
    ringColor: 'ring-yellow-400/50',
  },
  causeeffect: {
    gradient: 'from-cyan-50/80 via-sky-50/60 to-blue-50/80 dark:from-cyan-950/50 dark:via-sky-950/40 dark:to-blue-950/50',
    iconBg: 'bg-gradient-to-br from-cyan-400 via-sky-500 to-blue-500 dark:from-cyan-500 dark:to-sky-600',
    hoverGradient: 'from-cyan-100 to-sky-100 dark:from-cyan-800/40 dark:to-sky-800/40',
    selectedGradient: 'from-cyan-100/90 via-sky-100/80 to-blue-100/90 dark:from-cyan-900/60 dark:via-sky-900/50 dark:to-blue-900/60',
    borderColor: 'border-cyan-200/60 dark:border-cyan-700/40',
    accentColor: 'from-cyan-400 to-sky-500',
    glowColor: 'shadow-cyan-200/50 dark:shadow-cyan-800/30',
    ringColor: 'ring-cyan-400/50',
  },
  conceptmap: {
    gradient: 'from-indigo-50/80 via-violet-50/60 to-purple-50/80 dark:from-indigo-950/50 dark:via-violet-950/40 dark:to-purple-950/50',
    iconBg: 'bg-gradient-to-br from-indigo-400 via-violet-500 to-purple-500 dark:from-indigo-500 dark:to-violet-600',
    hoverGradient: 'from-indigo-100 to-violet-100 dark:from-indigo-800/40 dark:to-violet-800/40',
    selectedGradient: 'from-indigo-100/90 via-violet-100/80 to-purple-100/90 dark:from-indigo-900/60 dark:via-violet-900/50 dark:to-purple-900/60',
    borderColor: 'border-indigo-200/60 dark:border-indigo-700/40',
    accentColor: 'from-indigo-400 to-violet-500',
    glowColor: 'shadow-indigo-200/50 dark:shadow-indigo-800/30',
    ringColor: 'ring-indigo-400/50',
  },
  tchart: {
    gradient: 'from-fuchsia-50/80 via-purple-50/60 to-violet-50/80 dark:from-fuchsia-950/50 dark:via-purple-950/40 dark:to-violet-950/50',
    iconBg: 'bg-gradient-to-br from-fuchsia-400 via-purple-500 to-violet-500 dark:from-fuchsia-500 dark:to-purple-600',
    hoverGradient: 'from-fuchsia-100 to-purple-100 dark:from-fuchsia-800/40 dark:to-purple-800/40',
    selectedGradient: 'from-fuchsia-100/90 via-purple-100/80 to-violet-100/90 dark:from-fuchsia-900/60 dark:via-purple-900/50 dark:to-violet-900/60',
    borderColor: 'border-fuchsia-200/60 dark:border-fuchsia-700/40',
    accentColor: 'from-fuchsia-400 to-purple-500',
    glowColor: 'shadow-fuchsia-200/50 dark:shadow-fuchsia-800/30',
    ringColor: 'ring-fuchsia-400/50',
  },
};

export const DiagramCard: React.FC<DiagramCardProps> = ({
  type,
  name,
  description,
  icon,
  isSelected,
  onClick,
  index,
}) => {
  const theme = DIAGRAM_THEMES[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
    >
      <motion.button
        onClick={onClick}
        whileHover={{ y: -10, scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        className={`
          w-full h-[260px] rounded-3xl p-6 transition-all duration-300
          bg-gradient-to-br ${isSelected ? theme.selectedGradient : theme.gradient}
          backdrop-blur-xl
          border ${isSelected ? 'border-white/70 dark:border-white/20' : theme.borderColor}
          shadow-lg ${isSelected ? theme.glowColor : ''} hover:shadow-2xl dark:hover:shadow-xl
          overflow-hidden relative group cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-offset-2 ${theme.ringColor}
        `}
      >
        {/* Glassmorphism overlay */}
        <div className="absolute inset-0 rounded-3xl bg-transparent dark:bg-gray-900/60 pointer-events-none" />

        {/* Animated background orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <motion.div
            className={`absolute -top-1/3 -right-1/3 w-72 h-72 rounded-full bg-gradient-to-br ${theme.accentColor} opacity-[0.07] group-hover:opacity-[0.15] transition-opacity duration-500 blur-2xl`}
            animate={isSelected ? { scale: [1, 1.15, 1], x: [0, 5, 0] } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.div
            className={`absolute -bottom-1/3 -left-1/3 w-60 h-60 rounded-full bg-gradient-to-tr ${theme.accentColor} opacity-[0.05] group-hover:opacity-[0.12] transition-opacity duration-500 blur-2xl`}
            animate={isSelected ? { scale: [1, 1.1, 1], y: [0, -5, 0] } : {}}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
          />
        </div>

        {/* Neumorphism inner highlight */}
        <div className="absolute inset-[1px] rounded-3xl bg-gradient-to-b from-white/40 to-transparent dark:from-white/15 pointer-events-none" />

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center h-full justify-between">
          {/* Icon Container — 3D floating effect */}
          <motion.div
            className={`
              w-[88px] h-[88px] rounded-[22px] ${theme.iconBg}
              flex items-center justify-center
              shadow-xl group-hover:shadow-2xl transition-shadow duration-300
              flex-shrink-0
            `}
            style={{ boxShadow: '0 8px 24px -4px rgba(0,0,0,0.18), inset 0 1px 2px 0 rgba(255,255,255,0.25)' }}
            animate={isSelected ? { y: [-3, 3, -3] } : {}}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            whileHover={{ scale: 1.12, rotate: 3 }}
          >
            {/* Inner glass highlight */}
            <div className="absolute inset-0 rounded-[22px] bg-gradient-to-b from-white/25 to-transparent pointer-events-none" />
            <DiagramIllustrations type={type} className="w-14 h-14 drop-shadow-sm" />
          </motion.div>

          {/* Text Content */}
          <div className="flex flex-col items-center gap-1.5 flex-grow justify-center">
            <h3 className="font-bold text-[15px] text-gray-800 dark:text-white text-center leading-tight drop-shadow-sm">
              {name}
            </h3>
            <p className="text-[11px] text-gray-500 dark:text-gray-300 text-center leading-relaxed line-clamp-3 max-w-[180px]">
              {description}
            </p>
          </div>

          {/* Selection Indicator */}
          {isSelected && (
            <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-gray-800/80 backdrop-blur-md shadow-sm border border-white/50 dark:border-gray-700/50">
              <Check className="w-3.5 h-3.5 text-emerald-500" strokeWidth={3} />
              <span className="text-[11px] font-semibold text-gray-700 dark:text-gray-200">
                Selected
              </span>
            </div>
          )}

          {/* Hover sparkle indicator (shows only on hover, hides when selected) */}
          {!isSelected && (
            <motion.div
              className="flex items-center gap-1 px-3 py-1 rounded-full bg-white/0 group-hover:bg-white/60 dark:group-hover:bg-gray-800/60 backdrop-blur-sm transition-all duration-300"
              initial={{ opacity: 0 }}
              whileHover={{ opacity: 1 }}
            >
              <Sparkles className="w-3 h-3 text-gray-400 opacity-0 group-hover:opacity-70 transition-opacity duration-300" />
              <span className="text-[10px] font-medium text-gray-400 opacity-0 group-hover:opacity-70 transition-opacity duration-300">
                Click to select
              </span>
            </motion.div>
          )}
        </div>

        {/* Border shimmer on hover */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
          style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, transparent 50%, rgba(255,255,255,0.1) 100%)' }}
        />
      </motion.button>
    </motion.div>
  );
};
