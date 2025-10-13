
'use client';

import { useQuery } from '@tanstack/react-query';
import apiClient from '@/lib/axios';

interface DisabilityType {
  id: number;
  name: string;
  description: string;
}

const fetchDisabilityTypes = async (): Promise<DisabilityType[]> => {
  const { data } = await apiClient.get('/v1/disability-types');
  return data;
};

export const useDisabilityTypes = () => {
  return useQuery<DisabilityType[], Error>({
    queryKey: ['disabilityTypes'],
    queryFn: fetchDisabilityTypes,
  });
};
