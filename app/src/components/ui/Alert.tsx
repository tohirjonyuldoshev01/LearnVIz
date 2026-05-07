import React from 'react';
import { motion } from 'framer-motion';
import { X, Info, CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react';
import clsx from 'clsx';

interface AlertProps {
  type?: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  children: React.ReactNode;
  onClose?: () => void;
  className?: string;
}

export const Alert: React.FC<AlertProps> = ({
  type = 'info',
  title,
  children,
  onClose,
  className,
}) => {
  const typeStyles = {
    info: {
      bg: 'bg-pastel-blue/25 dark:bg-pastel-blue/15',
      border: 'border-pastel-blue/80 dark:border-pastel-blue/60',
      text: 'text-gray-900 dark:text-gray-100',
      icon: <Info className="w-5 h-5 text-pastel-purple" />,
    },
    success: {
      bg: 'bg-pastel-yellow/40 dark:bg-pastel-yellow/25',
      border: 'border-pastel-yellow dark:border-pastel-yellow/80',
      text: 'text-gray-900 dark:text-gray-100',
      icon: <CheckCircle className="w-5 h-5 text-pastel-purple" />,
    },
    warning: {
      bg: 'bg-pastel-yellow/35 dark:bg-pastel-yellow/20',
      border: 'border-pastel-purple/40 dark:border-pastel-purple/50',
      text: 'text-gray-900 dark:text-gray-100',
      icon: <AlertTriangle className="w-5 h-5 text-pastel-purple" />,
    },
    error: {
      bg: 'bg-pastel-pink/40 dark:bg-pastel-pink/25',
      border: 'border-pastel-purple/50 dark:border-pastel-purple/60',
      text: 'text-gray-900 dark:text-gray-100',
      icon: <AlertCircle className="w-5 h-5 text-pastel-purple" />,
    },
  };

  const styles = typeStyles[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={clsx(
        'border rounded-lg p-4 flex justify-between items-start gap-4',
        styles.bg,
        styles.border,
        styles.text,
        className
      )}
    >
      <div className="flex gap-3 flex-1">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1 }}>
          {styles.icon}
        </motion.div>
        <div className="flex-1">
          {title && <p className="font-semibold mb-1">{title}</p>}
          <p className="text-sm opacity-90">{children}</p>
        </div>
      </div>
      {onClose && (
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onClose}
          className="text-lg font-bold cursor-pointer hover:opacity-70 transition-opacity"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </motion.button>
      )}
    </motion.div>
  );
};
