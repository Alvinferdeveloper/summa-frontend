
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { Job } from '@/app/(job-seeker)/jobs/components/JobListItem'; // Reutilizamos la interfaz Job

export interface JobApplication {
  ID: number;
  status: string;
  job_post: Job;
  CreatedAt: string;
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
