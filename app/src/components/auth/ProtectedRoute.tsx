'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/context/AuthContext';
import { Loader } from '@/components/ui/Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute Component
 * 
 * Wraps pages that require authentication.
 * Redirects to login if user is not authenticated.
 * Shows loading state during auth initialization.
 * 
 * Usage in page.tsx:
 * ```
 * import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
 * 
 * export default function DashboardPage() {
 *   return (
 *     <ProtectedRoute>
 *       <Dashboard />
 *     </ProtectedRoute>
 *   );
 * }
 * ```
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const router = useRouter();
  const { isAuthenticated, isInitialized, isLoading } = useAuthContext();

  React.useEffect(() => {
    if (isInitialized && !isLoading && !isAuthenticated) {
      router.push('/auth/login');
    }
  }, [isInitialized, isLoading, isAuthenticated, router]);

  // Already authenticated — render immediately regardless of loading state.
  if (isInitialized && isAuthenticated) {
    return <>{children}</>;
  }

  // Auth not yet resolved — show spinner while initializing.
  if (!isInitialized || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader size="lg" text="Loading..." />
      </div>
    );
  }

  // Initialized but not authenticated — redirect effect will run, show brief message.
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Loader size="lg" text="Redirecting to login..." />
    </div>
  );
};

export default ProtectedRoute;
