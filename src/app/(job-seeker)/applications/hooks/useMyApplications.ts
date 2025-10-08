
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Job } from '@/app/(job-seeker)/jobs/components/JobListItem'; // Reutilizamos la interfaz Job

export interface JobApplication {
  id: number;
  status: string;
  job_post: Job;
  created_at: string;
}

const fetchMyApplications = async (): Promise<JobApplication[]> => {
  const { data } = await api.get('/v1/applications');
  return data;
};

export const useMyApplications = () => {
  return useQuery<JobApplication[], Error>({
    queryKey: ['myApplications'],
    queryFn: fetchMyApplications,
  });
};
