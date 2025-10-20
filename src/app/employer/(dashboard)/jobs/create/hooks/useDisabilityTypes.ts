'use client'

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface DisabilityTypeOption {
  id: number;
  name: string;
}

const fetchDisabilityTypes = async (): Promise<DisabilityTypeOption[]> => {
  const { data } = await api.get<DisabilityTypeOption[]>('/v1/disability-types');
  return data;
};

export const useDisabilityTypes = () => {
  return useQuery<DisabilityTypeOption[], Error>({
    queryKey: ['disabilityTypes'],
    queryFn: fetchDisabilityTypes,
  });
};
