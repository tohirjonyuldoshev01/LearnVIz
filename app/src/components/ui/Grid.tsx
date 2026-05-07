import React from 'react';
import clsx from 'clsx';

interface GridProps {
  columns?: 1 | 2 | 3 | 4 | 6;
  gap?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}

export const Grid: React.FC<GridProps> = ({
  columns = 3,
  gap = 'md',
  children,
  className,
}) => {
  const cols = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    6: 'grid-cols-6',
  };

  const gaps = {
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
  };

  return (
    <div
      className={clsx('grid', cols[columns], gaps[gap], className)}
    >
      {children}
    </div>
  );
};
