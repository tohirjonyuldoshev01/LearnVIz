import apiClient from '@/lib/axios';
import {
  EvaluationRequest,
  EvaluationResponse,
} from '@/types';

export const aiService = {
  // Extract a readable error message from axios/OpenAI errors
  parseError(error: any): Error {
    const status = error?.response?.status;
    const apiMessage =
      error?.response?.data?.error ||
      error?.response?.data?.message ||
      error?.message;

    if (status === 429) {
      return new Error(
        'AI quota reached. Please wait a bit or check your plan and billing.'
      );
    }

    return new Error(apiMessage || 'Unexpected AI service error');
  },

  // Evaluate completed diagram content using AI
  evaluateDiagram: async (
    request: EvaluationRequest
  ): Promise<EvaluationResponse> => {
    try {
      const response = await apiClient.post<EvaluationResponse>(
        '/api/diagrams/evaluate',
        request
      );

      if (!response.data.success) {
        throw new Error(response.data.error || 'Failed to evaluate content');
      }

      return response.data;
    } catch (error: any) {
      throw aiService.parseError(error);
    }
  },

  // Validate API health
  checkHealth: async (): Promise<boolean> => {
    try {
      const response = await apiClient.get('/api/health');
      return response.status === 200;
    } catch {
      return false;
    }
  },
};
