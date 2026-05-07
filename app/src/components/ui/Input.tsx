import React, { InputHTMLAttributes } from 'react';
import clsx from 'clsx';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helpText?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  helpText,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
          {label}
        </label>
      )}
      <input
        className={clsx(
          'w-full px-4 py-2.5 border rounded-xl transition-all duration-300',
          'bg-white/50 dark:bg-slate-800/50 text-gray-900 dark:text-gray-50 backdrop-blur-sm',
          'focus:outline-none focus:ring-2 focus:ring-pastel-purple/40 focus:border-pastel-purple/60',
          error
            ? 'border-rose-300/70 bg-rose-50/30 dark:bg-rose-900/10 focus:ring-rose-400/40'
            : 'border-gray-200/60 dark:border-slate-600/40 hover:border-pastel-purple/40',
          'placeholder:text-gray-400 dark:placeholder:text-gray-500',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm font-medium text-pastel-purple dark:text-pastel-pink">
          {error}
        </p>
      )}
      {helpText && !error && (
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {helpText}
        </p>
      )}
    </div>
  );
};
