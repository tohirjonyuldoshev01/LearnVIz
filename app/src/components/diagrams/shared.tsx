'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { MousePointerClick, HelpCircle, BookOpen } from 'lucide-react';

/* ─── Reusable animation variants ─── */
export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.07, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] },
  }),
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: (i: number = 0) => ({
    opacity: 1,
    scale: 1,
    transition: { delay: i * 0.08, duration: 0.4, ease: 'easeOut' },
  }),
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

/* ─── Interaction hint ─── */
export const InteractionHint: React.FC<{ text?: string }> = ({ text = 'Click elements to interact' }) => {
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="flex items-center justify-center gap-2 text-xs text-gray-400 dark:text-gray-500 mb-3 cursor-pointer select-none"
      onClick={() => setDismissed(true)}
    >
      <MousePointerClick className="w-3.5 h-3.5" />
      <span>{text}</span>
    </motion.div>
  );
};

/* ─── Section wrapper with glassmorphism ─── */
export const GlassPanel: React.FC<{
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isActive?: boolean;
  accentColor?: string;
}> = ({ children, className = '', onClick, isActive, accentColor = 'border-white/20' }) => (
  <motion.div
    onClick={onClick}
    whileHover={onClick ? { scale: 1.015, y: -2 } : undefined}
    whileTap={onClick ? { scale: 0.985 } : undefined}
    className={`
      relative rounded-2xl p-5
      bg-white/50 dark:bg-white/[0.06]
      backdrop-blur-xl
      border ${isActive ? 'border-pastel-purple/70 shadow-lg shadow-pastel-purple/10' : accentColor}
      shadow-sm hover:shadow-md
      transition-shadow duration-300
      ${onClick ? 'cursor-pointer' : ''}
      ${className}
    `}
  >
    {/* Inner highlight */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-white/40 to-transparent dark:from-white/[0.04] pointer-events-none" />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

/* ─── Expandable detail panel ─── */
export const ExpandableDetail: React.FC<{
  isOpen: boolean;
  children: React.ReactNode;
}> = ({ isOpen, children }) => (
  <AnimatePresence>
    {isOpen && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1, transition: { duration: 0.3, ease: 'easeOut' } }}
        exit={{ height: 0, opacity: 0, transition: { duration: 0.2, ease: 'easeIn' } }}
        className="overflow-hidden"
      >
        <div className="pt-3">{children}</div>
      </motion.div>
    )}
  </AnimatePresence>
);

/* ─── Editable text area shared component ─── */
export const DiagramTextArea: React.FC<{
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
  className?: string;
}> = ({ value, onChange, placeholder, minHeight = '80px', className = '' }) => (
  <textarea
    value={value}
    onChange={(e) => onChange(e.target.value)}
    placeholder={placeholder}
    className={`
      w-full p-3 rounded-xl border border-white/40 dark:border-gray-700
      bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm
      text-sm text-gray-700 dark:text-gray-200
      placeholder:text-gray-400 dark:placeholder:text-gray-500
      focus:outline-none focus:ring-2 focus:ring-pastel-purple/50 focus:border-pastel-purple/50
      transition-all duration-200 resize-none
      ${className}
    `}
    style={{ minHeight }}
  />
);

/* ─── Animated connecting arrow ─── */
export const ConnectingArrow: React.FC<{
  direction?: 'down' | 'right';
  className?: string;
}> = ({ direction = 'down', className = '' }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.5 }}
    animate={{ opacity: 1, scale: 1 }}
    className={`flex items-center justify-center ${className}`}
  >
    <div className={`
      flex items-center justify-center
      w-8 h-8 rounded-full
      bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm
      border border-white/40 dark:border-gray-700
      text-gray-400 dark:text-gray-500
      shadow-sm
    `}>
      {direction === 'down' ? (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 2v8m0 0l3-3m-3 3L3 7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      ) : (
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2 6h8m0 0L7 3m3 3L7 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      )}
    </div>
  </motion.div>
);

/* ─── Read-only text display ─── */
export const DiagramText: React.FC<{
  text: string;
  className?: string;
}> = ({ text, className = '' }) => (
  <p className={`text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed ${className}`}>
    {text || <span className="text-gray-400 dark:text-gray-600 italic">—</span>}
  </p>
);

/* ─── Section hint tooltip (small "?" with hint text) ─── */
export const SectionHint: React.FC<{ hint: string }> = ({ hint }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative inline-flex items-center gap-1.5 mb-1.5">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1 text-[11px] text-pastel-purple/80 hover:text-pastel-purple transition-colors"
        aria-label="Hint"
      >
        <HelpCircle className="w-3.5 h-3.5" />
        <span className="font-medium">{hint}</span>
      </button>
    </div>
  );
};

/* ─── Guidance intro block (shows steps above the editor) ─── */
export const GuidanceIntro: React.FC<{
  intro: string;
  steps: string[];
}> = ({ intro, steps }) => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-4 rounded-xl border border-pastel-purple/20 bg-pastel-purple/[0.06] dark:bg-pastel-purple/[0.04] px-4 py-3"
    >
      <button
        type="button"
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center gap-2 w-full text-left"
      >
        <BookOpen className="w-4 h-4 text-pastel-purple flex-shrink-0" />
        <span className="text-xs font-semibold text-gray-700 dark:text-gray-200 flex-1">{intro}</span>
        <motion.span
          animate={{ rotate: collapsed ? 0 : 180 }}
          transition={{ duration: 0.2 }}
          className="text-gray-400 text-xs"
        >
          ▾
        </motion.span>
      </button>
      <AnimatePresence>
        {!collapsed && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden mt-2 space-y-0.5 pl-6"
          >
            {steps.map((step, i) => (
              <li key={i} className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
                {step}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Show Example button ─── */
export const ShowExampleButton: React.FC<{
  label?: string;
  clearLabel?: string;
  onFill: () => void;
  onClear: () => void;
}> = ({ label, clearLabel, onFill, onClear }) => {
  const [filled, setFilled] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        if (filled) {
          onClear();
        } else {
          onFill();
        }
        setFilled(!filled);
      }}
      className={`
        inline-flex items-center gap-1.5 text-[11px] font-semibold px-3 py-1.5 rounded-lg
        border transition-all duration-200
        ${filled
          ? 'border-rose-200 bg-rose-50 text-rose-500 hover:bg-rose-100 dark:border-rose-800 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-950/50'
          : 'border-pastel-purple/30 bg-pastel-purple/[0.06] text-pastel-purple hover:bg-pastel-purple/[0.12] hover:border-pastel-purple/50 dark:bg-pastel-purple/[0.04]'
        }
      `}
    >
      <BookOpen className="w-3 h-3" />
      {filled ? (clearLabel || 'Namunani o\'chirish') : (label || 'Namuna ko\'rish')}
    </button>
  );
};
