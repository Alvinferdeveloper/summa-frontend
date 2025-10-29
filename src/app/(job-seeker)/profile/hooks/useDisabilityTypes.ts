
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

interface DisabilityType {
  id: number; 
  name: string;
  description: string;
}

const fetchDisabilityTypes = async (): Promise<DisabilityType[]> => {
  const { data } = await api.get('/v1/disability-types');
  return data;
};

export const useDisabilityTypes = () => {
  return useQuery<DisabilityType[], Error>({
    queryKey: ['disabilityTypes'],
    queryFn: fetchDisabilityTypes,
  });
};
