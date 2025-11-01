'use client';

import { useCompletion } from '@ai-sdk/react';

export const useJobExplanation = () => {
  const { complete, completion, isLoading } = useCompletion({
    api: '/api/explain-job',
  });

  const getExplanation = (jobDescription: string) => {
    complete(jobDescription);
  };

  return { explanation: completion, getExplanation, isLoading };
};
