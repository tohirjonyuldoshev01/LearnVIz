import React from 'react';
import { motion } from 'framer-motion';

interface SkeletonProps {
  width?: string;
  height?: string;
  rounded?: boolean;
  count?: number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '24px',
  rounded = false,
  count = 1,
  className = '',
}) => {
  const skeletons = Array.from({ length: count });

  return (
    <div className="space-y-3">
      {skeletons.map((_, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className={`bg-gray-200 dark:bg-gray-700 ${rounded ? 'rounded-full' : 'rounded-lg'} ${className}`}
          style={{ width, height }}
        />
      ))}
    </div>
  );
};

export default Skeleton;
