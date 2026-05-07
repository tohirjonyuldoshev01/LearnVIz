import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  delay?: number;
  onClick?: () => void;
  variant?: 'default' | 'highlight' | 'subtle';
}

export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  hover = true,
  delay = 0,
  onClick,
  variant = 'default',
}) => {
  const variantStyles = {
    default:
      'bg-white/60 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 shadow-[0_8px_32px_rgba(167,139,250,0.08)] backdrop-blur-xl',
    highlight:
      'bg-gradient-to-br from-pastel-purple/10 via-white/60 to-pastel-blue/10 dark:from-pastel-purple/15 dark:via-slate-800/60 dark:to-pastel-blue/10 border border-pastel-purple/25 dark:border-pastel-purple/20 shadow-[0_12px_40px_rgba(167,139,250,0.15)] backdrop-blur-xl',
    subtle:
      'bg-white/40 dark:bg-slate-800/30 border border-transparent hover:border-white/40 dark:hover:border-slate-700/30 backdrop-blur-sm',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: [0.25, 0.1, 0.25, 1] }}
      whileHover={hover ? { y: -6, boxShadow: '0 20px 48px rgba(167, 139, 250, 0.18)', transition: { duration: 0.3, ease: 'easeOut' } } : {}}
      whileTap={hover ? { scale: 0.98, transition: { duration: 0.15 } } : {}}
      onClick={onClick}
      className={`
        rounded-2xl p-6 transition-all duration-300 cursor-pointer
        text-[color:var(--text-main)] dark:text-[color:var(--text-main)]
        ${variantStyles[variant]}
        ${hover ? 'hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(167,139,250,0.18)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] hover:border-pastel-purple/30 dark:hover:border-pastel-purple/25' : ''}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedCard;
