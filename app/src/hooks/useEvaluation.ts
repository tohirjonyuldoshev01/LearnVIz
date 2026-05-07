import { useState, useCallback, useRef } from 'react';
import { aiService } from '@/services/aiService';
import { EvaluationRequest, EvaluationResponse } from '@/types';

interface UseEvaluationOptions {
  onSuccess?: (evaluation: EvaluationResponse) => void;
  onError?: (error: string) => void;
}

const DEBOUNCE_MS = 2000; // minimum interval between AI calls

export const useEvaluation = (options?: UseEvaluationOptions) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [evaluation, setEvaluation] = useState<EvaluationResponse | null>(null);
  const lastCallRef = useRef<number>(0);

  const evaluate = useCallback(
    async (request: EvaluationRequest) => {
      // Debounce: reject if called too quickly after the previous call
      const now = Date.now();
      if (now - lastCallRef.current < DEBOUNCE_MS) {
        const msg = 'Please wait a moment before evaluating again.';
        setError(msg);
        options?.onError?.(msg);
        throw new Error(msg);
      }
      lastCallRef.current = now;

      setIsLoading(true);
      setError(null);
      try {
        const result = await aiService.evaluateDiagram(request);
        setEvaluation(result);
        options?.onSuccess?.(result);
        return result;
      } catch (err: any) {
        const errorMessage = err.message || 'Failed to evaluate diagram';
        setError(errorMessage);
        options?.onError?.(errorMessage);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const clearEvaluation = useCallback(() => {
    setEvaluation(null);
    setError(null);
  }, []);

  return {
    evaluation,
    isLoading,
    error,
    evaluate,
    clearEvaluation,
  };
};
