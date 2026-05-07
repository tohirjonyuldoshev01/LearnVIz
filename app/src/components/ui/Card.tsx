import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children: React.ReactNode;
  hover?: boolean;
  variant?: 'default' | 'highlight' | 'subtle';
}

export const Card: React.FC<CardProps> = ({
  className,
  hover = false,
  children,
  variant = 'default',
  ...props
}) => {
  const variants = {
    default:
      'bg-white/60 dark:bg-slate-800/50 border border-white/30 dark:border-slate-700/30 shadow-[0_8px_32px_rgba(167,139,250,0.08)] backdrop-blur-xl',
    highlight:
      'bg-gradient-to-br from-pastel-purple/10 via-white/60 to-pastel-blue/10 dark:from-pastel-purple/15 dark:via-slate-800/60 dark:to-pastel-blue/10 border border-pastel-purple/25 dark:border-pastel-purple/20 shadow-[0_12px_40px_rgba(167,139,250,0.15)] backdrop-blur-xl',
    subtle:
      'bg-white/40 dark:bg-slate-800/30 border border-transparent hover:border-white/40 dark:hover:border-slate-700/30 backdrop-blur-sm',
  };

  return (
    <div
      className={clsx(
        'rounded-2xl p-6 transition-all duration-300 text-[color:var(--text-main)] dark:text-[color:var(--text-main)]',
        variants[variant],
        hover &&
          'hover:-translate-y-1 hover:shadow-[0_16px_48px_rgba(167,139,250,0.18)] dark:hover:shadow-[0_16px_48px_rgba(0,0,0,0.4)] cursor-pointer hover:border-pastel-purple/30 dark:hover:border-pastel-purple/25',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
