import React, { TextareaHTMLAttributes } from 'react';
import clsx from 'clsx';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  className,
  ...props
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
          {label}
        </label>
      )}
      <textarea
        className={clsx(
          'w-full px-4 py-2 border rounded-xl resize-none transition-all duration-300',
          'bg-pastel-blue/10 dark:bg-gray-800 text-gray-900 dark:text-gray-50 focus:outline-none focus:ring-2 focus:ring-pastel-purple/50 focus:border-pastel-purple',
          error
            ? 'border-pastel-purple/70 bg-pastel-pink/35 dark:bg-pastel-pink/20'
            : 'border-pastel-blue/80 dark:border-pastel-blue/60 hover:border-pastel-purple/60',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-pastel-purple dark:text-pastel-pink">{error}</p>}
    </div>
  );
};
