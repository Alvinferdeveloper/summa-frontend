'use client';

import { useCompletion } from '@ai-sdk/react';

export type CvAssistantTask = 'generate-summary' | 'rewrite-description';

interface CvAssistantParams {
  task: CvAssistantTask;
  context: {
    profileData?: any;
    informalText: string;
  };
}

export const useCvAssistant = () => {
  const { completion, setCompletion, isLoading, complete } = useCompletion({
    api: '/api/assist-cv',
  });

  const runAssistant = ({ task, context }: CvAssistantParams) => {
    complete('', {
      body: { task, context },
    });
  };

  return { result: completion, setResult: setCompletion, runAssistant, isLoading };
};
