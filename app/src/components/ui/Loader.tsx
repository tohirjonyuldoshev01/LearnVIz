import React from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  variant?: 'default' | 'minimal';
}

export const Loader: React.FC<LoaderProps> = ({
  size = 'md',
  text,
  variant = 'default',
}) => {
  const sizeClass = {
    sm: 'h-5 w-5',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  }[size];

  const spacingClass = {
    sm: 'gap-2',
    md: 'gap-3',
    lg: 'gap-4',
  }[size];

  if (variant === 'minimal') {
    return (
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }}>
        <Loader2 className={`${sizeClass} text-pastel-purple`} />
      </motion.div>
    );
  }

  return (
    <div className={`flex flex-col items-center justify-center ${spacingClass}`}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
      >
        <Loader2 className={`${sizeClass} text-pastel-purple dark:text-pastel-pink`} />
      </motion.div>
      {text && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-sm text-gray-600 dark:text-gray-400 font-medium"
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};
