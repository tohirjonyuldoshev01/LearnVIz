import React, { ButtonHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'danger' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  animated?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  icon,
  fullWidth = false,
  className,
  children,
  disabled,
  animated = true,
  ...props
}) => {
  const variants = {
    primary:
      'bg-gradient-to-r from-pastel-purple to-pastel-blue text-white hover:shadow-lg hover:shadow-purple-200/50 dark:hover:shadow-purple-900/30 border-0 disabled:opacity-50 disabled:cursor-not-allowed',
    secondary:
      'bg-white/70 dark:bg-slate-800/70 text-gray-800 dark:text-gray-100 hover:bg-white/90 dark:hover:bg-slate-700/80 shadow-sm hover:shadow-md border border-gray-200/50 dark:border-slate-600/50 backdrop-blur-sm',
    accent:
      'bg-gradient-to-r from-pastel-pink to-pastel-purple text-white hover:shadow-lg hover:shadow-pink-200/50 dark:hover:shadow-pink-900/30 border-0 disabled:opacity-50',
    danger:
      'bg-gradient-to-r from-rose-400 to-red-500 text-white hover:shadow-lg hover:shadow-rose-200/50 border-0 disabled:opacity-50',
    outline:
      'border-2 border-pastel-purple/50 text-pastel-purple hover:bg-pastel-purple/10 hover:border-pastel-purple dark:border-pastel-purple/40 dark:text-pastel-purple dark:hover:bg-pastel-purple/10',
    ghost:
      'text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-white/10 backdrop-blur-sm',
  };

  const sizes = {
    sm: 'px-3.5 py-1.5 text-sm rounded-xl',
    md: 'px-5 py-2.5 text-base rounded-xl',
    lg: 'px-7 py-3.5 text-lg rounded-2xl',
  };

  const buttonContent = (
    <>
      {isLoading ? (
        <motion.svg
          className="h-5 w-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </motion.svg>
      ) : (
        icon && icon
      )}
      {children}
    </>
  );

  const buttonClasses = clsx(
    'font-semibold transition-all duration-300 ease-out flex items-center justify-center gap-2 relative overflow-hidden focus-visible:ring-2 focus-visible:ring-pastel-purple/50',
    variants[variant],
    sizes[size],
    fullWidth && 'w-full',
    (isLoading || disabled) && 'cursor-not-allowed opacity-75',
    className
  );

  if (!animated) {
    return (
      <button
        className={buttonClasses}
        disabled={isLoading || disabled}
        {...props}
      >
        {buttonContent}
      </button>
    );
  }

  return (
    <motion.button
      className={buttonClasses}
      disabled={isLoading || disabled}
      whileHover={disabled ? {} : { scale: 1.05, transition: { duration: 0.25, ease: [0.25, 0.1, 0.25, 1] } }}
      whileTap={disabled ? {} : { scale: 0.97, transition: { duration: 0.1 } }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      {...(props as any)}
    >
      {buttonContent}
    </motion.button>
  );
};

