import React, { SelectHTMLAttributes } from 'react';
import clsx from 'clsx';
import { useLanguage } from '@/context/LanguageContext';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: Array<{ value: string; label: string }>;
}

export const Select: React.FC<SelectProps> = ({
  label,
  error,
  options,
  className,
  ...props
}) => {
  const { t } = useLanguage();

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
          {label}
        </label>
      )}
      <select
        className={clsx(
          'w-full px-4 py-2.5 border rounded-xl transition-all duration-300 appearance-none',
          'bg-pastel-blue/10 dark:bg-gray-800 text-gray-900 dark:text-gray-50',
          'focus:outline-none focus:ring-2 focus:ring-pastel-purple/50 focus:border-pastel-purple',
          error
            ? 'border-pastel-purple/70 bg-pastel-pink/35 dark:bg-pastel-pink/20 focus:ring-pastel-purple/60'
            : 'border-pastel-blue/80 dark:border-pastel-blue/60 hover:border-pastel-purple/60',
          'cursor-pointer',
          className
        )}
        {...props}
      >
        <option value="">{t.select.placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-2 text-sm font-medium text-pastel-purple dark:text-pastel-pink">
          {error}
        </p>
      )}
    </div>
  );
};
