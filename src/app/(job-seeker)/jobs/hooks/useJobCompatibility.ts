
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface CompatibilityData {
  score: number;
  met_needs: string[];
  unmet_needs: string[];
  total_candidate_needs: number;
}

const fetchJobCompatibility = async (jobId: string): Promise<CompatibilityData> => {
  const { data } = await api.get(`/v1/jobs/${jobId}/compatibility`);
  return data;
};

export const useJobCompatibility = (jobId: string | number) => {
  return useQuery<CompatibilityData, Error>({
    queryKey: ['jobCompatibility', jobId],
    queryFn: () => fetchJobCompatibility(jobId.toString()),
    enabled: !!jobId,
  });
};
