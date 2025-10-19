'use client'

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Option } from './useContractTypes'; // Reuse the Option type

const fetchExperienceLevels = async (): Promise<Option[]> => {
  const { data } = await api.get<Option[]>('/v1/experience-levels');
  return data;
};

export const useExperienceLevels = () => {
  return useQuery<Option[], Error>({
    queryKey: ['experienceLevels'],
    queryFn: fetchExperienceLevels,
  });
};
