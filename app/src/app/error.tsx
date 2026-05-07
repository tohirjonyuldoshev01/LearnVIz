'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { useLanguage } from '@/context/LanguageContext';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { t } = useLanguage();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-20 h-20 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto text-3xl">
          !
        </div>
        <h2 className="text-3xl font-bold text-gray-900">{t.errors.somethingWentWrong}</h2>
        <p className="text-gray-600">
          {t.errors.unexpectedError}
        </p>
        <div className="flex justify-center gap-4 pt-4">
          <Button onClick={() => reset()} variant="primary">
            {t.errors.tryAgain}
          </Button>
          <Button onClick={() => window.location.href = '/'} variant="outline">
            {t.errors.goHome}
          </Button>
        </div>
      </div>
    </div>
  );
}
