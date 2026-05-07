'use client';

import React, { useEffect } from 'react';
import { useAuthContext } from '@/context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';

/**
 * SessionExpiredAlert Component
 * 
 * Displays a dismissible alert when user session has expired.
 * Shows automatically when sessionExpired flag is true.
 * Can be dismissed by clicking the X button or after 5 seconds.
 */
export const SessionExpiredAlert: React.FC = () => {
  const { sessionExpired, clearSessionExpiredMessage } = useAuthContext();
  const [visible, setVisible] = React.useState(false);

  useEffect(() => {
    if (sessionExpired) {
      setVisible(true);

      // Auto-dismiss after 5 seconds
      const timer = setTimeout(() => {
        setVisible(false);
        clearSessionExpiredMessage();
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [sessionExpired, clearSessionExpiredMessage]);

  const handleDismiss = () => {
    setVisible(false);
    clearSessionExpiredMessage();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
          className="fixed top-4 right-4 z-50 max-w-md"
        >
          <div className="bg-pastel-yellow/45 dark:bg-gray-800 rounded-xl shadow-lg border-l-4 border-pastel-purple p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-pastel-purple flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                Session Expired
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Your session has expired after 7 days. Please sign in again to continue.
              </p>
            </div>
            <button
              onClick={handleDismiss}
              className="text-gray-500 hover:text-pastel-purple dark:hover:text-pastel-pink flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SessionExpiredAlert;
