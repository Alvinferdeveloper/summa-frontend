'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Job } from '@/app/(job-seeker)/jobs/components/JobListItem';

const fetchJobPost = async (id: string): Promise<Job> => {
  const { data } = await api.get<Job>(`/v1/jobs/${id}`);
  return data;
};

export const useJobPost = (id: string) => {
  return useQuery<Job, Error>({
    queryKey: ['jobPost', id],
    queryFn: () => fetchJobPost(id),
    enabled: !!id,
  });
};
