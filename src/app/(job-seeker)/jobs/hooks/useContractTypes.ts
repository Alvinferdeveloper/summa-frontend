'use client'

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface Option {
  id: number;
  name: string;
}

const fetchContractTypes = async (): Promise<Option[]> => {
  const { data } = await api.get<Option[]>('/v1/contract-types');
  return data;
};

export const useContractTypes = () => {
  return useQuery<Option[], Error>({
    queryKey: ['contractTypes'],
    queryFn: fetchContractTypes,
  });
};
