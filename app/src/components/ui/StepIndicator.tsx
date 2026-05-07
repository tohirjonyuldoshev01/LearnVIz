import React from 'react';
import { motion } from 'framer-motion';

interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  totalSteps,
  stepLabels = [],
}) => {
  return (
    <div className="w-full mb-8">
      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex gap-2 items-center">
          {Array.from({ length: totalSteps }).map((_, index) => (
            <React.Fragment key={index}>
              <motion.div
                initial={false}
                animate={{
                  backgroundColor:
                    index < currentStep
                      ? '#DD7BDF'
                      : index === currentStep - 1
                      ? '#DD7BDF'
                      : '#B3BFFF',
                }}
                className="h-1.5 flex-1 rounded-full"
                transition={{ duration: 0.4 }}
              />
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Steps */}
      <div className="flex justify-between">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <motion.div
            key={index}
            className="flex flex-col items-center flex-1"
            initial={{ opacity: 0.5 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div
              className={`w-10 h-10 rounded-full font-semibold text-sm flex items-center justify-center mb-2 transition-all ${
                index < currentStep - 1
                  ? 'bg-pastel-yellow text-gray-900'
                  : index === currentStep - 1
                  ? 'bg-pastel-purple text-white ring-2 ring-pastel-pink/70 dark:ring-pastel-purple/70'
                  : 'bg-pastel-blue/60 dark:bg-pastel-blue/40 text-gray-700 dark:text-gray-300'
              }`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              {index < currentStep - 1 ? '✓' : index + 1}
            </motion.div>

            {stepLabels[index] && (
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center">
                {stepLabels[index]}
              </p>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
