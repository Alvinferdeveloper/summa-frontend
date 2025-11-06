
'use client';

import { useCompletion } from '@ai-sdk/react';
import { Job } from '../components/JobListItem';

interface CoverLetterAssistantParams {
  job: Job;
}

export const useCoverLetterAssistant = () => {
  const { completion, setCompletion, isLoading, complete } = useCompletion({
    api: '/api/generate-cover-letter',
  });

  const runAssistant = ({ job }: CoverLetterAssistantParams) => {
    complete('', {
      body: { job },
    });
  };

  return { generatedCoverLetter: completion, setGeneratedCoverLetter: setCompletion, runAssistant, isLoading };
};
