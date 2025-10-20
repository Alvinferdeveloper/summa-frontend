'use client'

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Option } from '@/app/(job-seeker)/jobs/hooks/useContractTypes';

const fetchWorkSchedules = async (): Promise<Option[]> => {
  const { data } = await api.get<Option[]>('/v1/work-schedules');
  return data;
};

export const useWorkSchedules = () => {
  return useQuery<Option[], Error>({
    queryKey: ['workSchedules'],
    queryFn: fetchWorkSchedules,
  });
};
