'use client'

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Option } from '@/app/(job-seeker)/jobs/hooks/useContractTypes';

const fetchWorkModels = async (): Promise<Option[]> => {
  const { data } = await api.get<Option[]>('/v1/work-models');
  return data;
};

export const useWorkModels = () => {
  return useQuery<Option[], Error>({
    queryKey: ['workModels'],
    queryFn: fetchWorkModels,
  });
};
