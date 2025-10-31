
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { JobApplication } from '../types';
const fetchAllJobApplicants = async (jobId: string): Promise<JobApplication[]> => {
  const { data } = await api.get(`/v1/jobs/${jobId}/all-applicants`);
  return data;
};

export const useAllJobApplicants = (jobId: string) => {
  return useQuery<JobApplication[], Error>({
    queryKey: ['allJobApplicants', jobId],
    queryFn: () => fetchAllJobApplicants(jobId),
    enabled: !!jobId,
  });
};
