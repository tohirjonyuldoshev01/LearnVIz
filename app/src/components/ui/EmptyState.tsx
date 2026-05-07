import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from './Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  secondaryAction,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center py-20 px-4"
    >
      {icon && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="mb-6"
        >
          {icon}
        </motion.div>
      )}

      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-50 mb-2 text-center">
        {title}
      </h2>

      <p className="text-gray-600 dark:text-gray-200 text-center max-w-md mb-8">
        {description}
      </p>

      <div className="flex gap-3 flex-wrap justify-center">
        {action && (
          <Link href={action.href}>
            <Button variant="primary" size="lg">
              {action.label}
            </Button>
          </Link>
        )}

        {secondaryAction && (
          <Button
            variant="outline"
            size="lg"
            onClick={secondaryAction.onClick}
          >
            {secondaryAction.label}
          </Button>
        )}
      </div>
    </motion.div>
  );
};

export default EmptyState;
